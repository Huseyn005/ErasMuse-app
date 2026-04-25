// Sirma AI client for ERASMuse
import { getMockAnswer, getMockDocumentAnalysis, type AssistantAnswer } from "./mockAssistant";

const DOMAIN = (import.meta.env.VITE_SIRMA_AI_DOMAIN as string | undefined) || "https://stage.sirma.ai";
const KEY = (import.meta.env.VITE_SIRMA_AI_KEY as string | undefined) || "MDUfxZ9oHRV88xfPVjJd2Nw1NCOPcbMnv8jSmcFFaVhgHyY7fdhzFbaKYtpkMl69rrZwUIwEAudbvvnO1KQkzknDG9WgIkrK83VVBNOGYZBCxg8rQzdOflSTiKCe5oZG";
const AGENT_ID = (import.meta.env.VITE_SIRMA_AGENT_ID as string | undefined) || "0bc1c8fb-90da-4ed1-9070-5af5fb7259f7";

export const sirmaConfigured = Boolean(DOMAIN && KEY && AGENT_ID);

// Helper to get full language name from code
function getLanguageName(code: string): string {
  const names: Record<string, string> = {
    en: "English",
    bg: "Bulgarian",
    es: "Spanish",
    tr: "Turkish",
    fr: "French",
    de: "German",
    az: "Azerbaijani",
    ka: "Georgian",
    ru: "Russian",
  };
  return names[code] || "English";
}

export type DocumentAnalysis = {
  simpleExplanation: string;
  keyDetails: { label: string; value: string }[];
  riskFlags: { title: string; detail: string }[];
  questionsToAsk: string[];
  bgSummary: string;
  enMessage?: string;
  bgMessage?: string;
  type?: string;
  title?: string;
};

export async function getAgents(): Promise<{ id: string }[]> {
  // Return the configured agent directly since we know the ID
  if (!sirmaConfigured) return [];
  return [{ id: AGENT_ID }];
}

/**
 * Send a message to the Sirma AI agent
 * Uses multipart/form-data as required by the API
 * @param forceDemo - If true, uses demo mode regardless of API availability
 * @param language - The language code to respond in (e.g., 'en', 'bg', 'es')
 */
export async function sendMessage(
  agentId: string,
  message: string,
  _conversationId?: string,
  forceDemo = false,
  language = "en"
): Promise<AssistantAnswer> {
  if (forceDemo || !sirmaConfigured || !agentId) return getMockAnswer(message, language);
  
  try {
    const formData = new FormData();
    // Add language instruction to ensure AI responds in the requested language
    const languageInstruction = language !== "en" 
      ? `\n\nIMPORTANT: Please respond in ${getLanguageName(language)} language.`
      : "";
    formData.append("message", message + languageInstruction);
    
    const res = await fetch(`${DOMAIN}/client/api/v1/agents/${agentId}/run`, {
      method: "POST",
      headers: { "X-API-Key": KEY },
      body: formData,
    });
    
    if (!res.ok) {
      console.error("[v0] Sirma AI error:", res.status, res.statusText);
      return getMockAnswer(message);
    }
    
    const data = await res.json();
    
    // Extract content from the Sirma AI response structure
    const content: string = data?.data?.content || data?.content || "";
    
    if (!content) {
      return getMockAnswer(message);
    }
    
    // Try to parse as JSON if it looks like structured data
    try {
      const parsed = JSON.parse(content);
      if (parsed && parsed.title) return parsed as AssistantAnswer;
    } catch {
      // Not JSON — wrap the text into our shape
    }
    
    // Convert plain text response to AssistantAnswer format
    return {
      title: "ERASMuse says",
      summary: content,
      steps: [],
      phrases: [],
      warnings: [],
      nextActions: [],
    };
  } catch (err) {
    console.error("[v0] Sirma AI request failed:", err);
    return getMockAnswer(message);
  }
}

/**
 * Analyze a document using Sirma AI
 * Supports text content or file uploads
 * @param forceDemo - If true, uses demo mode regardless of API availability
 */
export async function analyzeDocument(
  content: string | File,
  fileName?: string,
  forceDemo = false
): Promise<DocumentAnalysis> {
  if (forceDemo) {
    // Simulate a delay for demo mode
    await new Promise(resolve => setTimeout(resolve, 1500));
    return getMockDocumentAnalysis(fileName);
  }
  
  if (!sirmaConfigured) {
    throw new Error("Sirma AI is not configured");
  }
  
  const formData = new FormData();
  
  // Build the analysis prompt
  let prompt: string;
  
  if (content instanceof File) {
    // Attach file to form data
    formData.append("file", content, content.name);
    prompt = `Please analyze this document "${content.name}" and provide:
1. A simple explanation of what this document is about (in plain English that a student can understand)
2. Key details extracted from the document (dates, amounts, names, requirements, etc.)
3. Any risk flags or concerning clauses that need attention
4. Questions the reader should ask before signing or accepting this document
5. A brief summary in Bulgarian (Резюме на български)
6. A suggested response message in English
7. A suggested response message in Bulgarian

Format your response as JSON with these fields:
{
  "type": "document type (e.g., Rental Contract, University Letter, etc.)",
  "title": "brief title",
  "simpleExplanation": "...",
  "keyDetails": [{"label": "...", "value": "..."}],
  "riskFlags": [{"title": "...", "detail": "..."}],
  "questionsToAsk": ["..."],
  "bgSummary": "...",
  "enMessage": "...",
  "bgMessage": "..."
}`;
  } else {
    // Text content
    prompt = `Please analyze this document text and provide:
1. A simple explanation of what this document is about (in plain English that a student can understand)
2. Key details extracted from the document (dates, amounts, names, requirements, etc.)
3. Any risk flags or concerning clauses that need attention
4. Questions the reader should ask before signing or accepting this document
5. A brief summary in Bulgarian (Резюме на български)
6. A suggested response message in English
7. A suggested response message in Bulgarian

Document${fileName ? ` (${fileName})` : ""}:
"""
${content}
"""

Format your response as JSON with these fields:
{
  "type": "document type (e.g., Rental Contract, University Letter, etc.)",
  "title": "brief title",
  "simpleExplanation": "...",
  "keyDetails": [{"label": "...", "value": "..."}],
  "riskFlags": [{"title": "...", "detail": "..."}],
  "questionsToAsk": ["..."],
  "bgSummary": "...",
  "enMessage": "...",
  "bgMessage": "..."
}`;
  }
  
  formData.append("message", prompt);
  
  const res = await fetch(`${DOMAIN}/client/api/v1/agents/${AGENT_ID}/run`, {
    method: "POST",
    headers: { "X-API-Key": KEY },
    body: formData,
  });
  
  if (!res.ok) {
    const errorText = await res.text();
    console.error("[v0] Sirma AI document analysis error:", res.status, errorText);
    throw new Error(`Analysis failed: ${res.status}`);
  }
  
  const data = await res.json();
  const responseContent: string = data?.data?.content || data?.content || "";
  
  if (!responseContent) {
    throw new Error("No analysis returned from AI");
  }
  
  // Try to extract JSON from the response
  // The AI might wrap it in markdown code blocks
  let jsonStr = responseContent;
  const jsonMatch = responseContent.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch) {
    jsonStr = jsonMatch[1].trim();
  } else {
    // Try to find JSON object directly
    const objMatch = responseContent.match(/\{[\s\S]*\}/);
    if (objMatch) {
      jsonStr = objMatch[0];
    }
  }
  
  try {
    const parsed = JSON.parse(jsonStr);
    return {
      type: parsed.type || "Document",
      title: parsed.title || fileName || "Analyzed Document",
      simpleExplanation: parsed.simpleExplanation || parsed.simple_explanation || "Analysis complete.",
      keyDetails: parsed.keyDetails || parsed.key_details || [],
      riskFlags: parsed.riskFlags || parsed.risk_flags || [],
      questionsToAsk: parsed.questionsToAsk || parsed.questions_to_ask || [],
      bgSummary: parsed.bgSummary || parsed.bg_summary || "",
      enMessage: parsed.enMessage || parsed.en_message,
      bgMessage: parsed.bgMessage || parsed.bg_message,
    };
  } catch {
    // If JSON parsing fails, create a basic response from the text
    return {
      type: "Document",
      title: fileName || "Analyzed Document",
      simpleExplanation: responseContent.slice(0, 1000),
      keyDetails: [],
      riskFlags: [],
      questionsToAsk: [],
      bgSummary: "",
    };
  }
}
