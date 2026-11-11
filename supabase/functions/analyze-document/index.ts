import { corsFor, json, clientIp, rateLimited, tooLarge } from '../_shared/guard.ts';

// Analyze a user-uploaded document using native Google Gemini API (gemini-3.5-flash-lite).
// Accepts either plain text OR a base64 file (PDF/image/DOCX/etc.).
// Returns a structured analysis matching the Documents page UI.

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');

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
    const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': GEMINI_API_KEY!,
        },
        body: JSON.stringify({
            systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
            contents: [{ role: 'user', parts }],
            generationConfig: { responseMimeType: 'application/json' },
        }),
        signal: AbortSignal.timeout(45_000),
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Google API error ${res.status}: ${text.slice(0, 300)}`);
    }
    const data = await res.json();
    const content: string = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    return content;
}

Deno.serve(async req => {
    const corsHeaders = corsFor(req);
    if (!corsHeaders) return json({ error: 'Origin not allowed' }, 403);
    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: corsHeaders });
    if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405, corsHeaders);
    if (tooLarge(req, 15_000_000)) return json({ error: 'Request too large' }, 413, corsHeaders);
    if (rateLimited(clientIp(req), 10)) return json({ error: 'Too many requests, try again later' }, 429, corsHeaders);

    try {
        if (!GEMINI_API_KEY) {
            return json({ error: 'Service not configured' }, 503, corsHeaders);
        }

        const body = await req.json();
        const { text, fileBase64, mimeType, fileName } = body ?? {};

        if (!text && !fileBase64) {
            return json({ error: "Provide either 'text' or 'fileBase64' + 'mimeType'." }, 400, corsHeaders);
        }

        const parts: unknown[] = [];
        if (fileBase64 && mimeType) {
            parts.push({
                inlineData: {
                    mimeType: mimeType,
                    data: fileBase64,
                },
            });
            parts.push({
                text: `File name: ${fileName ?? 'document'}. Analyze the attached document and return JSON as specified.`,
            });
        } else {
            parts.push({
                text: `Analyze the following document text and return JSON as specified.\n\n---\n${String(text).slice(0, 60000)}\n---`,
            });
        }

        const content = await callAI(parts);

        let parsed: Record<string, unknown> | null = null;
        try {
            parsed = JSON.parse(content);
        } catch {
            const match = content.match(/\{[\s\S]*\}/);
            if (match) {
                try {
                    parsed = JSON.parse(match[0]);
                } catch {
                    /* noop */
                }
            }
        }

        if (!parsed) {
            return json({ error: 'AI did not return valid JSON.', raw: content.slice(0, 500) }, 502, corsHeaders);
        }

        return json({ analysis: parsed }, 200, corsHeaders);
    } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        const status = message.includes('429') ? 429 : message.includes('402') ? 402 : 500;
        return json({ error: message }, status, corsHeaders);
    }
});
