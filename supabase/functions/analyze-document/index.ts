// Analyze a user-uploaded document using Lovable AI Gateway.
// Accepts either plain text OR a base64 file (PDF/image/DOCX/etc.).
// Returns a structured analysis matching the Documents page UI.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

const SYSTEM_PROMPT = `You are ERASMuse, a multilingual life copilot for students and visitors in Ruse, Bulgaria.
A user has uploaded a real document (rental contract, university letter, medical instruction, government form, ticket, bill, etc.).
Read it carefully and produce a clear, actionable analysis in plain English.

Your output MUST be a single JSON object with EXACTLY this shape — no markdown, no commentary:

{
  "type": "short label like 'Rental contract', 'University letter', 'Medical instruction', 'Government form', 'Travel document', 'Bill', 'Other'",
  "title": "short human title for the document (max 80 chars)",
  "simpleExplanation": "2-4 sentences in simple English explaining what this document is and what it means for the user",
  "keyDetails": [ { "label": "short label", "value": "concrete value from the doc" } ],
  "riskFlags": [ { "title": "short risk title", "detail": "1-2 sentence explanation" } ],
  "questionsToAsk": [ "concrete question 1", "concrete question 2" ],
  "bgSummary": "2-3 sentence summary in Bulgarian (Cyrillic)",
  "enMessage": "polite English message the user could send to the other party",
  "bgMessage": "the same message translated to Bulgarian (Cyrillic)"
}

Rules:
- Extract real values from the document (amounts, dates, addresses, names) where possible.
- If something is missing, write "Not specified in document".
- Keep keyDetails to 4-8 items, riskFlags to 1-5 items, questionsToAsk to 2-5 items.
- For medical/legal/financial docs, include a risk flag reminding it is not professional advice.
- Currency: keep лв values and add EUR estimate in parentheses when relevant.
- Output JSON ONLY. No prose before or after.`;

async function callAI(parts: unknown[]) {
  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: parts },
      ],
      response_format: { type: "json_object" },
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`AI gateway ${res.status}: ${text.slice(0, 300)}`);
  }
  const data = await res.json();
  const content: string = data?.choices?.[0]?.message?.content ?? "";
  return content;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const body = await req.json();
    const { text, fileBase64, mimeType, fileName } = body ?? {};

    if (!text && !fileBase64) {
      return new Response(
        JSON.stringify({ error: "Provide either 'text' or 'fileBase64' + 'mimeType'." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const parts: unknown[] = [];
    if (fileBase64 && mimeType) {
      // Gemini multimodal supports images and PDFs via image_url with data URLs.
      parts.push({
        type: "image_url",
        image_url: { url: `data:${mimeType};base64,${fileBase64}` },
      });
      parts.push({
        type: "text",
        text: `File name: ${fileName ?? "document"}. Analyze the attached document and return JSON as specified.`,
      });
    } else {
      parts.push({
        type: "text",
        text: `Analyze the following document text and return JSON as specified.\n\n---\n${String(text).slice(0, 60000)}\n---`,
      });
    }

    const content = await callAI(parts);

    let parsed: Record<string, unknown> | null = null;
    try {
      parsed = JSON.parse(content);
    } catch {
      // Try to extract JSON object from the string
      const match = content.match(/\{[\s\S]*\}/);
      if (match) {
        try { parsed = JSON.parse(match[0]); } catch { /* noop */ }
      }
    }

    if (!parsed) {
      return new Response(
        JSON.stringify({ error: "AI did not return valid JSON.", raw: content.slice(0, 500) }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify({ analysis: parsed }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    const status = message.includes("429") ? 429 : message.includes("402") ? 402 : 500;
    return new Response(
      JSON.stringify({ error: message }),
      { status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
