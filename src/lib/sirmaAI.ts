// Minimal Sirma AI client with safe mock fallback.
import { getMockAnswer, type AssistantAnswer } from "./mockAssistant";

const DOMAIN = (import.meta.env.VITE_SIRMA_AI_DOMAIN as string | undefined) || "";
const KEY = (import.meta.env.VITE_SIRMA_AI_KEY as string | undefined) || "";

export const sirmaConfigured = Boolean(DOMAIN && KEY);

export async function getAgents(): Promise<unknown[]> {
  if (!sirmaConfigured) return [];
  try {
    const res = await fetch(`${DOMAIN}/client/api/v1/agents`, {
      headers: { "X-API-Key": KEY, "Content-Type": "application/json" },
    });
    if (!res.ok) throw new Error("agents");
    return (await res.json()) as unknown[];
  } catch {
    return [];
  }
}

const ENDPOINTS = (id: string) => [
  `/client/api/v1/agents/${id}/chat`,
  `/client/api/v1/agents/${id}/messages`,
  `/client/api/v1/agents/${id}/completions`,
  `/client/api/v1/chat`,
];

export async function sendMessage(
  agentId: string,
  message: string,
  conversationId?: string
): Promise<AssistantAnswer> {
  if (!sirmaConfigured || !agentId) return getMockAnswer(message);
  for (const ep of ENDPOINTS(agentId)) {
    try {
      const res = await fetch(`${DOMAIN}${ep}`, {
        method: "POST",
        headers: { "X-API-Key": KEY, "Content-Type": "application/json" },
        body: JSON.stringify({ message, conversationId }),
      });
      if (!res.ok) continue;
      const data = await res.json();
      const text: string =
        (typeof data === "string" && data) ||
        data?.message ||
        data?.response ||
        data?.choices?.[0]?.message?.content ||
        "";
      try {
        const parsed = JSON.parse(text);
        if (parsed && parsed.title) return parsed as AssistantAnswer;
      } catch {
        // not JSON — wrap into our shape
        return {
          title: "ERASMuse says",
          summary: text.slice(0, 600),
          steps: [],
          phrases: [],
          warnings: [],
          nextActions: [],
        };
      }
    } catch {
      // try next endpoint
    }
  }
  return getMockAnswer(message);
}
