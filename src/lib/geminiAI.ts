import { supabase } from "@/integrations/supabase/client";
import { getMockAnswer, type AssistantAnswer } from "./mockAssistant";

export const aiConfigured = true;

export async function getAgents(): Promise<{ id: string }[]> {
  return [{ id: "default" }];
}

export async function sendMessage(
  _agentId: string,
  message: string,
  _conversationId?: string,
  forceDemo = false,
  language = "en",
): Promise<AssistantAnswer> {
  if (forceDemo) return getMockAnswer(message, language);

  try {
    const { data, error } = await supabase.functions.invoke("gemini-proxy", {
      body: { message, language },
    });

    if (error) {
      throw new Error(`Gemini proxy error: ${error.message}`);
    }

    const content: string = data?.content ?? "";
    if (!content) throw new Error("Gemini proxy returned an empty response");

    try {
      const parsed = JSON.parse(content);
      if (parsed && parsed.title) return parsed as AssistantAnswer;
    } catch {
      // Not JSON, wrap it
    }

    return {
      title: "ERASMuse says",
      summary: content,
      steps: [],
      phrases: [],
      warnings: [],
      nextActions: [],
    };
  } catch (err) {
    console.error("Gemini request failed:", err);
    throw err;
  }
}
