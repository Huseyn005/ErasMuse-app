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
  Calendar,
  AlertTriangle,
  Send
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WeatherWidget } from "@/components/WeatherWidget";
import { usePlan } from "@/hooks/usePlan";
import { events } from "@/data/events";
import { buddies } from "@/data/buddies";
import { sendMessage, sirmaConfigured, getAgents } from "@/lib/sirmaAI";
import { getMockAnswer, type AssistantAnswer } from "@/lib/mockAssistant";
import { AnswerCard } from "@/components/AnswerCard";
import { useAIMode } from "@/contexts/AIModeContext";
import { useProfile } from "@/hooks/useProfile";
import { toast } from "sonner";

const Index = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { items } = usePlan();
  const { isLive } = useAIMode();
  const [profile] = useProfile();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState<AssistantAnswer | null>(null);

  const quickPrompts = [
    { key: "events", label: t("home.quickPrompts.events") },
    { key: "planDay", label: t("home.quickPrompts.planDay") },
    { key: "food", label: t("home.quickPrompts.food") },
    { key: "documents", label: t("home.quickPrompts.documents") },
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
      icon: Users, 
      title: t("home.quickActions.findBuddy"), 
      desc: t("home.quickActions.findBuddyDesc"), 
      href: "/buddies", 
      accent: "coral" as const 
    },
    { 
      icon: Calendar, 
      title: t("home.quickActions.planWeek"), 
      desc: t("home.quickActions.planWeekDesc"), 
      href: "/buddies?tab=my-plan", 
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
      icon: Bus, 
      title: t("home.quickActions.transport"), 
      desc: t("home.quickActions.transportDesc"), 
      href: "/move", 
      accent: "teal" as const 
    },
    { 
      icon: AlertTriangle, 
      title: t("home.quickActions.emergency"), 
      desc: t("home.quickActions.emergencyDesc"), 
      href: "/life-admin", 
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

  // Get upcoming plan items
  const upcomingItems = items.slice(0, 3);
  
  // Get recommended events
  const recommendedEvents = events.slice(0, 3);
  
  // Get suggested buddies
  const suggestedBuddies = buddies.filter(b => b.type === "event").slice(0, 3);

  return (
    <div className="px-4 lg:px-8 py-6 lg:py-10 space-y-8 max-w-6xl mx-auto">
      {/* Welcome Section */}
      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
              {t("home.heroTitle")} <span className="text-accent">{t("home.heroCity")}</span>
            </h1>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base max-w-xl">
              {t("home.subtitle")}
            </p>
          </div>
          <WeatherWidget />
        </div>
      </section>

      {/* Ask ERASMuse Card - Prominent at Top */}
      <section className="surface p-6 lg:p-8 bg-gradient-card">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-display text-xl font-bold">{t("home.askERASMuse")}</h2>
            <p className="text-sm text-muted-foreground">{t("home.askPlaceholder")}</p>
          </div>
          <Badge className="ml-auto" variant="secondary">
            <span className={`w-2 h-2 rounded-full mr-1.5 ${isLive && sirmaConfigured ? "bg-green-500 animate-pulse" : "bg-muted-foreground"}`} />
            {isLive && sirmaConfigured ? "Live AI" : "Demo"}
          </Badge>
        </div>

        {/* Quick Prompt Chips */}
        <div className="flex flex-wrap gap-2 mb-4">
          {quickPrompts.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => handleAsk(label)}
              disabled={loading}
              className="chip hover:chip-active hover:bg-primary hover:text-primary-foreground hover:border-primary disabled:opacity-50 transition-all"
            >
              {label}
            </button>
          ))}
        </div>

        {/* Input */}
        <form 
          onSubmit={(e) => { e.preventDefault(); handleAsk(); }}
          className="flex items-center gap-2 p-2 rounded-xl border border-border bg-background"
        >
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("ask.placeholder")}
            disabled={loading}
            className="flex-1 bg-transparent px-3 py-2 text-sm outline-none"
          />
          <Button type="submit" disabled={!query.trim() || loading} size="sm" className="gap-1.5">
            <Send className="w-4 h-4" /> {t("ask.send")}
          </Button>
        </form>

        {/* Loading State */}
        {loading && (
          <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse-dot" />
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse-dot" style={{ animationDelay: "0.2s" }} />
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse-dot" style={{ animationDelay: "0.4s" }} />
            <span className="ml-2">{t("ask.thinking")}</span>
          </div>
        )}

        {/* Answer */}
        {answer && !loading && (
          <div className="mt-4">
            <AnswerCard answer={answer} onAction={onAction} />
          </div>
        )}
      </section>

      {/* Quick Action Cards Grid */}
      <section>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
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

      {/* Below-the-fold Sections */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Upcoming Plan Items */}
        <section className="surface p-5 bg-gradient-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold">{t("home.upcoming")}</h3>
            <Button variant="ghost" size="sm" onClick={() => navigate("/buddies?tab=my-plan")} className="text-xs">
              {t("common.viewAll")} <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </div>
          {upcomingItems.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t("plan.emptyDesc")}</p>
          ) : (
            <div className="space-y-2">
              {upcomingItems.map((item) => (
                <div key={item.id} className="p-3 rounded-xl bg-background border border-border">
                  <div className="font-medium text-sm truncate">{item.title}</div>
                  {item.meta && <div className="text-xs text-muted-foreground">{item.meta}</div>}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Recommended Events */}
        <section className="surface p-5 bg-gradient-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold">{t("home.recommended")}</h3>
            <Button variant="ghost" size="sm" onClick={() => navigate("/explore")} className="text-xs">
              {t("common.viewAll")} <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </div>
          <div className="space-y-2">
            {recommendedEvents.map((event) => (
              <div 
                key={event.id} 
                className="p-3 rounded-xl bg-background border border-border cursor-pointer hover:border-primary/40 transition-colors"
                onClick={() => navigate("/explore")}
              >
                <div className="font-medium text-sm truncate">{event.title}</div>
                <div className="text-xs text-muted-foreground">{event.date} - {event.locationName}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Suggested Buddies */}
        <section className="surface p-5 bg-gradient-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold">{t("home.suggestedBuddies")}</h3>
            <Button variant="ghost" size="sm" onClick={() => navigate("/buddies")} className="text-xs">
              {t("common.viewAll")} <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </div>
          <div className="space-y-2">
            {suggestedBuddies.map((buddy) => (
              <div 
                key={buddy.id} 
                className="p-3 rounded-xl bg-background border border-border flex items-center gap-3 cursor-pointer hover:border-primary/40 transition-colors"
                onClick={() => navigate("/buddies")}
              >
                <div className="w-8 h-8 rounded-full bg-coral/15 text-coral font-bold flex items-center justify-center text-sm">
                  {buddy.firstName.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-sm truncate">{buddy.firstName}</div>
                  <div className="text-xs text-muted-foreground">{buddy.userType}</div>
                </div>
                <Badge variant="secondary" className="text-[10px]">{buddy.matchScore}%</Badge>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* How it works */}
      <section>
        <h2 className="font-display text-xl font-bold mb-4">{t("home.howItWorks")}</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { n: 1, t: t("home.step1Title"), d: t("home.step1Desc") },
            { n: 2, t: t("home.step2Title"), d: t("home.step2Desc") },
            { n: 3, t: t("home.step3Title"), d: t("home.step3Desc") },
          ].map(s => (
            <div key={s.n} className="surface p-5 bg-gradient-card">
              <div className="w-9 h-9 rounded-xl bg-primary text-primary-foreground font-bold flex items-center justify-center mb-3">{s.n}</div>
              <div className="font-semibold">{s.t}</div>
              <div className="text-sm text-muted-foreground mt-1">{s.d}</div>
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
    navy: "bg-primary/10 text-primary",
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
      <div className="font-semibold">{title}</div>
      <div className="text-sm text-muted-foreground mt-1">{desc}</div>
      <ArrowRight className="w-4 h-4 mt-3 text-muted-foreground group-hover:translate-x-1 transition-transform" />
    </button>
  );
}

export default Index;
