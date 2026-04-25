import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ArrowRight,
  Sparkles,
  Compass,
  Bus,
  GraduationCap,
  Users,
  Map,
  Send
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WeatherWidget } from "@/components/WeatherWidget";
import { sendMessage, sirmaConfigured } from "@/lib/sirmaAI";
import { getMockAnswer, type AssistantAnswer } from "@/lib/mockAssistant";
import { AnswerCard } from "@/components/AnswerCard";
import { useAIMode } from "@/contexts/AIModeContext";
import { useProfile } from "@/hooks/useProfile";
import { toast } from "sonner";

const Index = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isLive } = useAIMode();
  const [profile] = useProfile();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState<AssistantAnswer | null>(null);

  const quickPrompts = [
    { key: "events", label: t("home.quickPrompts.events") },
    { key: "buddy", label: t("home.quickPrompts.buddy") },
  ];

  const quickActions = [
    {
      icon: Compass,
      title: t("home.quickActions.explore"),
      desc: t("home.quickActions.exploreDesc"),
      href: "/explore",
      accent: "teal" as const
    },
    {
      icon: Bus,
      title: t("home.quickActions.transport"),
      desc: t("home.quickActions.transportDesc"),
      href: "/move",
      accent: "amber" as const
    },
    {
      icon: GraduationCap,
      title: t("home.quickActions.campusInfo"),
      desc: t("home.quickActions.campusInfoDesc"),
      href: "/campus",
      accent: "navy" as const
    },
    {
      icon: Users,
      title: t("home.quickActions.findBuddy"),
      desc: t("home.quickActions.findBuddyDesc"),
      href: "/buddies",
      accent: "coral" as const
    },
  ];

  const handleAsk = async (text?: string) => {
    const value = (text ?? query).trim();
    if (!value || loading) return;

    setQuery("");
    setLoading(true);

    try {
      const ctx = `User type: ${profile.userType ?? "Other"}. Language: ${profile.language}. Section: Homepage.`;
      const result = await sendMessage("default", `${ctx}\n\nUser: ${value}`, undefined, !isLive || !sirmaConfigured);
      setAnswer(result);
    } catch {
      setAnswer(getMockAnswer(value));
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
  };

  return (
    <div className="px-4 lg:px-8 py-6 lg:py-10 space-y-6 max-w-6xl mx-auto">
      {/* Welcome Section - Outside the card */}
      <section className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground dark:text-slate-50">
            {t("home.heroTitle")} <span className="text-accent">{t("home.heroCity")}</span>
          </h1>
          <p className="text-muted-foreground dark:text-slate-300 mt-2 text-sm sm:text-base max-w-xl">
            {t("home.subtitle")}
          </p>
        </div>
        <WeatherWidget />
      </section>

      {/* Compact Hero Card - Teal/Green Gradient with AI on Right */}
      <section className="rounded-2xl bg-gradient-hero overflow-hidden">
        <div className="flex flex-col lg:flex-row min-h-[280px]">
          {/* Left Side - Branding & CTAs */}
          <div className="flex-1 p-6 lg:p-8 flex flex-col justify-center">
            <Badge className="w-fit mb-4 bg-white/15 text-white border-white/20 hover:bg-white/20">
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              {t("home.badge")}
            </Badge>

            <div className="mb-4">
              <span className="font-display text-2xl lg:text-3xl font-extrabold tracking-tight">
                <span className="text-white">ERAS</span>
                <span className="text-amber-400">M</span>
                <span className="text-white">use</span>
              </span>
            </div>

            <p className="text-white/80 text-sm lg:text-base max-w-md mb-6">
              {t("home.heroDescription")}
            </p>

            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => navigate("/ask")}
                className="bg-white text-primary hover:bg-white/90 gap-2"
              >
                <Sparkles className="w-4 h-4" />
                {t("home.askAssistant")}
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/explore")}
                className="border-white/30 text-white hover:bg-white/10 gap-2"
              >
                {t("home.tryDemoFlows")}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Right Side - Compact AI Chat Interface */}
          <div className="lg:w-[480px] p-4 lg:p-6 lg:pl-0 flex items-center">
            <div className="w-full bg-card rounded-xl border border-border/50 shadow-lg overflow-hidden">
              {/* Chat Header */}
              <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${isLive && sirmaConfigured ? "bg-green-500 animate-pulse" : "bg-muted-foreground"}`} />
                  <span className="text-sm font-medium text-foreground">Live AI</span>
                  <span className="text-xs text-muted-foreground">- Demo</span>
                </div>
                <Badge variant="secondary" className="text-[10px]">Sample chat</Badge>
              </div>

              {/* Chat Content */}
              <div className="p-4 space-y-3">
                {/* Sample User Message */}
                <div className="flex justify-end">
                  <div className="bg-accent/10 text-accent-foreground dark:text-slate-200 text-sm px-3 py-2 rounded-xl max-w-[90%]">
                    {t("home.sampleQuery")}
                  </div>
                </div>

                {/* Sample AI Response */}
                {/*
                <div className="bg-primary text-primary-foreground text-sm px-4 py-3 rounded-xl">
                  {t("home.sampleResponse")}
                </div>
                */}

                {/* Quick Action Pills */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {["Steps", "Phrase", "Discounts"].map((pill) => (
                    <button
                      key={pill}
                      // Add the onClick handler here
                      onClick={() => {
                        const promptMap = {
                          Steps: "Give me the step-by-step instructions for this.",
                          Phrase: "What is the Bulgarian phrase for this?",
                          Discounts: "Are there any Erasmus discounts available for this?"
                        };
                        handleAsk(promptMap[pill as keyof typeof promptMap]);
                      }}
                      disabled={loading} // Prevent multiple clicks while loading
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border  text-xs font-medium bg-muted text-muted-foreground hover:bg-muted/80 transition-colors disabled:opacity-50"
                    >
                      {pill === "Steps" && <span>📋</span>}
                      {pill === "Phrase" && <span className="text-[10px]">бг</span>}
                      {pill === "Discounts" && <span>💳</span>}
                      {pill}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Prompts */}
              {/*
              <div className="px-4 pb-3 flex flex-wrap gap-2">
                {quickPrompts.map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => handleAsk(label)}
                    disabled={loading}
                    className="text-xs px-3 py-1.5 rounded-full border border-border bg-background hover:bg-muted transition-colors disabled:opacity-50"
                  >
                    {label}
                  </button>
                ))}
              </div> */}

              {/* Input */}
              <div className="px-3 pb-3">
                <form
                  onSubmit={(e) => { e.preventDefault(); handleAsk(); }}
                  className="flex items-center gap-2 p-2 rounded-xl border border-border bg-background"
                >
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={t("ask.placeholder")}
                    disabled={loading}
                    className="flex-1 bg-transparent px-2 py-1.5 text-sm outline-none"
                  />
                  <Button type="submit" disabled={!query.trim() || loading} size="sm" className="h-8 w-8 p-0">
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Loading & Answer */}
        {(loading || answer) && (
          <div className="px-6 pb-6">
            {loading && (
              <div className="flex items-center gap-2 text-sm text-white/70">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse-dot" />
                <span className="w-2 h-2 rounded-full bg-white animate-pulse-dot" style={{ animationDelay: "0.2s" }} />
                <span className="w-2 h-2 rounded-full bg-white animate-pulse-dot" style={{ animationDelay: "0.4s" }} />
                <span className="ml-2">{t("ask.thinking")}</span>
              </div>
            )}
            {answer && !loading && (
              <div className="bg-card rounded-xl p-4">
                <AnswerCard answer={answer} onAction={onAction} />
              </div>
            )}
          </div>
        )}
      </section>

      {/* Quick Action Cards Grid - 4 columns */}
      <section>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <QuickActionCard
              key={action.href}
              icon={action.icon}
              title={action.title}
              desc={action.desc}
              onClick={() => navigate(action.href)}
              accent={action.accent}
            />
          ))}
        </div>
      </section>

      {/* Map Section */}
      <section className="surface p-5 bg-gradient-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-semibold text-foreground dark:text-slate-50">{t("explore.nearby")}</h3>
          <Button variant="ghost" size="sm" onClick={() => navigate("/explore")} className="text-xs">
            {t("common.viewAll")} <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        </div>
        <div className="aspect-[2/1] lg:aspect-[3/1] rounded-xl bg-muted flex items-center justify-center">
          <div className="text-center text-muted-foreground dark:text-slate-300">
            <Map className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">{t("explore.mapPlaceholder")}</p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section>
        <h2 className="font-display text-xl font-bold mb-4 text-foreground dark:text-slate-50">{t("home.howItWorks")}</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { n: 1, t: t("home.step1Title"), d: t("home.step1Desc") },
            { n: 2, t: t("home.step2Title"), d: t("home.step2Desc") },
            { n: 3, t: t("home.step3Title"), d: t("home.step3Desc") },
          ].map(s => (
            <div key={s.n} className="surface p-5 bg-gradient-card">
              <div className="w-9 h-9 rounded-xl bg-primary text-primary-foreground font-bold flex items-center justify-center mb-3">{s.n}</div>
              <div className="font-semibold text-foreground dark:text-slate-50">{s.t}</div>
              <div className="text-sm text-muted-foreground dark:text-slate-300 mt-1">{s.d}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

function QuickActionCard({
  icon: Icon,
  title,
  desc,
  onClick,
  accent,
}: {
  icon: typeof Compass;
  title: string;
  desc: string;
  onClick: () => void;
  accent: "amber" | "teal" | "navy" | "coral";
}) {
  const accentMap = {
    amber: "bg-warning/15 text-warning",
    teal: "bg-accent/15 text-accent",
    navy: "bg-primary/10 text-primary dark:bg-primary/20",
    coral: "bg-coral/15 text-coral",
  } as const;

  return (
    <button
      onClick={onClick}
      className="surface p-5 text-left hover:shadow-glow transition-all hover:-translate-y-0.5 bg-gradient-card group"
    >
      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center mb-3 ${accentMap[accent]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="font-semibold text-foreground dark:text-slate-50">{title}</div>
      <div className="text-sm text-muted-foreground dark:text-slate-300 mt-1 line-clamp-2">{desc}</div>
      <ArrowRight className="w-4 h-4 mt-3 text-muted-foreground group-hover:translate-x-1 transition-transform" />
    </button>
  );
}

export default Index;
