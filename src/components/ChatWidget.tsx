import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, X, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnswerCard } from "@/components/AnswerCard";
import { sendMessage, sirmaConfigured, getAgents } from "@/lib/sirmaAI";
import { getMockAnswer, type AssistantAnswer } from "@/lib/mockAssistant";
import { useAIMode } from "@/contexts/AIModeContext";
import { useProfile } from "@/hooks/useProfile";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const SUGGESTION_KEYS = [
  "trainTicket",
  "contract",
  "tonight",
  "doctor",
  "travelBuddy",
];

type Msg = { role: "user" | "ai"; content: string; answer?: AssistantAnswer };

interface ChatWidgetProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChatWidget({ isOpen, onClose }: ChatWidgetProps) {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [profile] = useProfile();
  const { isLive: globalLive } = useAIMode();
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [loading, setLoading] = useState(false);
  const [agentId, setAgentId] = useState<string>("");
  const [apiReady, setApiReady] = useState(false);

  const lastSendRef = useRef(0);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isLive = globalLive && apiReady && sirmaConfigured;

  // Initialize agent on mount
  useEffect(() => {
    if (!sirmaConfigured) { 
      setApiReady(false); 
      return; 
    }
    getAgents().then(list => {
      const first = (list as { id?: string }[])[0];
      if (first?.id) { 
        setAgentId(first.id); 
        setApiReady(true); 
      }
    });
  }, []);

  // Focus input when widget opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Auto-scroll to bottom when messages change
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
      const currentLang = i18n.language || "en";
      const ctx = `User type: ${profile.userType ?? "Other"}. Language: ${currentLang}. Section: Chat Widget.`;
      const useDemo = !isLive;
      const answer = await sendMessage(agentId, `${ctx}\n\nUser: ${value}`, undefined, useDemo, currentLang);
      setMessages(m => [...m, { role: "ai", content: "", answer }]);
    } catch {
      setMessages(m => [...m, { role: "ai", content: "", answer: getMockAnswer(value, i18n.language) }]);
    } finally {
      setLoading(false);
    }
  };

  const onAction = (a: string) => {
    if (a.toLowerCase().includes("plan")) navigate("/buddies?tab=my-plan");
    else if (a.toLowerCase().includes("buddy")) navigate("/buddies");
    else if (a.toLowerCase().includes("map") || a.toLowerCase().includes("route")) navigate("/explore");
    else if (a.toLowerCase().includes("explore")) navigate("/explore");
    else if (a.toLowerCase().includes("document")) navigate("/documents");
    else toast.success("Saved");
    onClose();
  };

  // Desktop: floating widget, Mobile: full-screen overlay
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Mobile: Full-screen overlay with blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 z-50 bg-background/80 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Desktop: Semi-transparent backdrop (optional click to close) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="hidden lg:block fixed inset-0 z-40"
            onClick={onClose}
          />

          {/* Mobile: Full-screen chat */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="lg:hidden fixed inset-0 z-50 flex flex-col bg-background"
          >
            <ChatHeader isLive={isLive} onClose={onClose} t={t} />
            <ChatBody
              messages={messages}
              loading={loading}
              scrollerRef={scrollerRef}
              onAction={onAction}
              onSend={onSend}
              t={t}
            />
            <ChatFooter
              text={text}
              setText={setText}
              loading={loading}
              onSend={onSend}
              inputRef={inputRef}
              t={t}
            />
          </motion.div>

          {/* Desktop: Floating widget in bottom-right */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="hidden lg:flex fixed bottom-6 right-6 z-50 w-[420px] h-[600px] flex-col bg-card rounded-2xl shadow-2xl border border-border overflow-hidden"
          >
            <ChatHeader isLive={isLive} onClose={onClose} t={t} />
            <ChatBody
              messages={messages}
              loading={loading}
              scrollerRef={scrollerRef}
              onAction={onAction}
              onSend={onSend}
              t={t}
            />
            <ChatFooter
              text={text}
              setText={setText}
              loading={loading}
              onSend={onSend}
              inputRef={inputRef}
              t={t}
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function ChatHeader({ isLive, onClose, t }: { isLive: boolean; onClose: () => void; t: (key: string) => string }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-primary text-primary-foreground shrink-0">
      <div className="flex items-center gap-3">
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          <span className="font-semibold">{t("chat.assistant")}</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className={cn(
          "w-2 h-2 rounded-full",
          isLive ? "bg-green-400 animate-pulse" : "bg-white/50"
        )} />
        <span className="text-xs text-white/70">{isLive ? t("chat.live") : t("chat.demo")}</span>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-white/10 transition-colors ml-2"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

function ChatBody({
  messages,
  loading,
  scrollerRef,
  onAction,
  onSend,
  t,
}: {
  messages: Msg[];
  loading: boolean;
  scrollerRef: React.RefObject<HTMLDivElement>;
  onAction: (a: string) => void;
  onSend: (text: string) => void;
  t: (key: string) => string;
}) {
  return (
    <div ref={scrollerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
      {/* Empty state with suggestions */}
      {messages.length === 0 && (
        <div className="space-y-4">
          <div className="text-center py-6">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <Sparkles className="w-7 h-7" />
            </div>
            <h3 className="font-display text-lg font-semibold text-foreground">
              {t("chat.emptyTitle")}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {t("chat.emptySubtitle")}
            </p>
          </div>

          {/* Suggestion chips */}
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide px-1">
              {t("chat.quickQuestions")}
            </p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTION_KEYS.map(key => (
                <button
                  key={key}
                  onClick={() => onSend(t(`ask.suggestions.${key}`))}
                  className="text-xs px-3 py-2 rounded-xl border border-border bg-background hover:bg-muted hover:border-primary/30 transition-colors text-left"
                >
                  {t(`ask.suggestions.${key}`)}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      {messages.map((m, i) =>
        m.role === "user" ? (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-end"
          >
            <div className="bg-primary text-primary-foreground px-4 py-2.5 rounded-2xl rounded-br-sm max-w-[85%] text-sm">
              {m.content}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {m.answer && <AnswerCard answer={m.answer} onAction={onAction} />}
          </motion.div>
        )
      )}

      {/* Loading indicator */}
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="surface p-4 inline-flex items-center gap-2 text-sm text-muted-foreground"
        >
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" style={{ animationDelay: "0.2s" }} />
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" style={{ animationDelay: "0.4s" }} />
          <span className="ml-2">{t("chat.thinking")}</span>
        </motion.div>
      )}
    </div>
  );
}

function ChatFooter({
  text,
  setText,
  loading,
  onSend,
  inputRef,
  t,
}: {
  text: string;
  setText: (val: string) => void;
  loading: boolean;
  onSend: (text?: string) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  t: (key: string) => string;
}) {
  return (
    <div className="p-3 border-t border-border bg-background shrink-0">
      <form
        onSubmit={(e) => { e.preventDefault(); onSend(); }}
        className="flex items-center gap-2 p-2 rounded-xl border border-border bg-card"
      >
        <input
          ref={inputRef}
          value={text}
          onChange={e => setText(e.target.value.slice(0, 500))}
          placeholder={t("ask.placeholder")}
          maxLength={500}
          disabled={loading}
          className="flex-1 bg-transparent px-3 py-2 text-sm outline-none"
        />
        <span className="text-[10px] text-muted-foreground tabular-nums">{text.length}/500</span>
        <Button type="submit" disabled={!text.trim() || loading} size="sm" className="gap-1.5">
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">Send</span>
        </Button>
      </form>
    </div>
  );
}
