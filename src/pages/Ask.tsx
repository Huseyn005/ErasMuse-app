import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/PageHeader";
import { AnswerCard } from "@/components/AnswerCard";
import { sendMessage, sirmaConfigured, getAgents } from "@/lib/sirmaAI";
import { getMockAnswer, type AssistantAnswer } from "@/lib/mockAssistant";
import { useProfile } from "@/hooks/useProfile";
import { useAIMode } from "@/contexts/AIModeContext";
import { toast } from "sonner";

const SUGGESTIONS = [
  "How do I buy a train ticket from Ruse to Sofia?",
  "Explain this rental contract in simple English.",
  "What can I do tonight in Ruse?",
  "Where is the Erasmus office?",
  "What should I do if I need a doctor?",
  "Find me a travel buddy to Sofia.",
];

type Msg = { role: "user" | "ai"; content: string; answer?: AssistantAnswer };

const Ask = () => {
  const navigate = useNavigate();
  const [profile] = useProfile();
  const { isLive: globalLive } = useAIMode();
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [loading, setLoading] = useState(false);
  const [agentId, setAgentId] = useState<string>("");
  const [apiReady, setApiReady] = useState(false);
  const lastSendRef = useRef(0);
  const scrollerRef = useRef<HTMLDivElement>(null);

  // Determine if we're actually live (global toggle + API configured)
  const isLive = globalLive && apiReady && sirmaConfigured;

  useEffect(() => {
    if (!sirmaConfigured) { setApiReady(false); return; }
    getAgents().then(list => {
      const first = (list as { id?: string }[])[0];
      if (first?.id) { setAgentId(first.id); setApiReady(true); }
    });
  }, []);

  useEffect(() => {
    scrollerRef.current?.scrollTo({ top: scrollerRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const onSend = async (raw?: string) => {
    const value = (raw ?? text).trim().slice(0, 500);
    if (!value || loading) return;
    const now = Date.now();
    if (now - lastSendRef.current < 1500) {
      toast("Please wait a moment between messages.");
      return;
    }
    lastSendRef.current = now;
    setText("");
    setMessages(m => [...m, { role: "user", content: value }]);
    setLoading(true);
    try {
      const ctx = `User type: ${profile.userType ?? "Other"}. Language: ${profile.language}. Section: Ask AI.`;
      const useDemo = !isLive;
      const answer = await sendMessage(agentId || "default", `${ctx}\n\nUser: ${value}`, undefined, useDemo);
      setMessages(m => [...m, { role: "ai", content: "", answer }]);
    } catch {
      setMessages(m => [...m, { role: "ai", content: "", answer: getMockAnswer(value) }]);
    } finally {
      setLoading(false);
    }
  };

  const onAction = (a: string) => {
    if (a.toLowerCase().includes("plan")) navigate("/plan");
    else if (a.toLowerCase().includes("buddy")) navigate("/buddies");
    else if (a.toLowerCase().includes("map") || a.toLowerCase().includes("route")) navigate("/explore");
    else if (a.toLowerCase().includes("explore")) navigate("/explore");
    else if (a.toLowerCase().includes("document")) navigate("/documents");
    else toast.success("Saved ✓");
  };

  return (
    <div className="px-4 lg:px-8 py-6 max-w-4xl mx-auto">
      <PageHeader
        title="Ask ERASMuse anything"
        subtitle="Transport, documents, university, events, health, and local life in Ruse."
      >
        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-card border border-border text-xs font-medium">
          <span className={`w-2 h-2 rounded-full ${isLive ? "bg-green-500 animate-pulse" : "bg-muted-foreground"}`} />
          {isLive ? "Live AI" : "Demo mode"}
        </span>
      </PageHeader>

      <div ref={scrollerRef} className="space-y-4 mb-4 max-h-[60vh] overflow-y-auto pr-1">
        {messages.length === 0 && (
          <div className="surface p-6 bg-gradient-card text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <p className="font-display text-lg font-semibold">Let's make Ruse easier.</p>
            <p className="text-sm text-muted-foreground mt-1">Pick a question below or type your own.</p>
          </div>
        )}
        {messages.map((m, i) =>
          m.role === "user" ? (
            <div key={i} className="flex justify-end">
              <div className="bg-primary text-primary-foreground px-4 py-2.5 rounded-2xl rounded-br-sm max-w-[85%] text-sm">
                {m.content}
              </div>
            </div>
          ) : (
            <div key={i}>
              {m.answer && <AnswerCard answer={m.answer} onAction={onAction} />}
            </div>
          )
        )}
        {loading && (
          <div className="surface p-4 inline-flex items-center gap-2 text-sm text-muted-foreground">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse-dot" />
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse-dot" style={{ animationDelay: "0.2s" }} />
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse-dot" style={{ animationDelay: "0.4s" }} />
            <span className="ml-2">ERASMuse is thinking…</span>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        {SUGGESTIONS.map(s => (
          <button key={s} onClick={() => onSend(s)} disabled={loading}
            className="chip hover:chip-active hover:bg-primary hover:text-primary-foreground hover:border-primary disabled:opacity-50">
            {s}
          </button>
        ))}
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); onSend(); }}
        className="surface p-2 flex items-center gap-2 sticky bottom-20 lg:bottom-0 bg-card"
      >
        <input
          value={text}
          onChange={e => setText(e.target.value.slice(0, 500))}
          placeholder="Ask in your language…"
          maxLength={500}
          disabled={loading}
          className="flex-1 bg-transparent px-3 py-2 text-sm outline-none"
        />
        <span className="text-[10px] text-muted-foreground hidden sm:inline">{text.length}/500</span>
        <Button type="submit" disabled={!text.trim() || loading} className="gap-1.5">
          <Send className="w-4 h-4" /> Send
        </Button>
      </form>
    </div>
  );
};

export default Ask;
