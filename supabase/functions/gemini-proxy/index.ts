import { clientIp, corsFor, json, rateLimited, tooLarge } from '../_shared/guard.ts';

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
const SYSTEM_PROMPT = (currentDateTime: string) =>
    `You are ERASMuse, a helpful, friendly multilingual life copilot for students and visitors in Ruse, Bulgaria. Answer questions clearly, accurately, and concisely. The current date and time in Ruse, Bulgaria is ${currentDateTime}. When asked for today's date, the day, or the current time, use this timestamp naturally and accurately. Do not guess or substitute a memorized date.`;

Deno.serve(async req => {
    const cors = corsFor(req);
    if (!cors) return json({ error: 'Origin not allowed' }, 403);
    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405, cors);
    if (tooLarge(req, 100_000)) return json({ error: 'Request too large' }, 413, cors);
    if (rateLimited(clientIp(req), 20)) return json({ error: 'Too many requests' }, 429, cors);

    if (!GEMINI_API_KEY) return json({ error: 'Service not configured' }, 503, cors);

    let body: { message?: unknown; language?: unknown };
    try {
        body = await req.json();
    } catch {
        return json({ error: 'Invalid JSON' }, 400, cors);
    }

    const message = typeof body.message === 'string' ? body.message.trim() : '';
    if (!message) return json({ error: 'Invalid message' }, 400, cors);

    const languageStr = typeof body.language === 'string' ? `\n\nIMPORTANT: Please respond in language code: ${body.language}` : '';
    const now = new Date();
    const currentDate = now.toLocaleDateString('en-US', {
        timeZone: 'Europe/Sofia',
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });
    const currentTime = now.toLocaleTimeString('en-US', {
        timeZone: 'Europe/Sofia',
        hour: 'numeric',
        minute: '2-digit',
    });
    const currentDateTime = `${currentDate}, ${currentTime}`;

    try {
        const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-goog-api-key': GEMINI_API_KEY,
            },
            body: JSON.stringify({
                systemInstruction: {
                    parts: [{
                        text: SYSTEM_PROMPT(currentDateTime),
                    }],
                },
                contents: [{ role: 'user', parts: [{ text: message + languageStr }] }],
            }),
        });

        if (!res.ok) {
            const errText = await res.text();
            throw new Error(`Google API error ${res.status}: ${errText}`);
        }

        const data = await res.json();
        const content = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't generate a response.";

        return json({ content }, 200, cors);
    } catch (err) {
        console.error('AI request failed:', err);
        return json({ error: 'Upstream unavailable' }, 502, cors);
    }
});
