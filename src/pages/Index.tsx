import { useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles, Compass, Bus, FileText, GraduationCap, Map as MapIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/shell/Logo";
import { WeatherWidget } from "@/components/WeatherWidget";
import { RuseMap } from "@/components/RuseMap";
import { events } from "@/data/events";
import { hiddenGems } from "@/data/hiddenGems";
import { campus } from "@/data/campus";
import { useProfile, type UserType } from "@/hooks/useProfile";

const userTypeMessages: Record<string, string> = {
  "Erasmus / International student": "Great. We'll prioritize university, documents, events, and student-friendly places.",
  "Tourist / Visitor": "Welcome! We'll focus on hidden gems, safe transport, and friendly local phrases.",
  "Local student": "Nice — we'll surface campus events, help with documents, and weekend ideas.",
  "Local citizen": "Welcome back. We'll keep events, hidden gems, and document help close at hand.",
  "Other": "We'll show you a broad mix — adjust your interests anytime in your profile.",
};

const types: UserType[] = [
  "Erasmus / International student",
  "Tourist / Visitor",
  "Local student",
  "Local citizen",
  "Other",
];

const Index = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useProfile();

  const allMarkers = [
    ...events.slice(0, 6).map(e => ({ id: e.id, lat: e.lat, lng: e.lng, type: "event" as const, label: e.title })),
    ...hiddenGems.slice(0, 4).map(g => ({ id: g.id, lat: g.lat, lng: g.lng, type: "gem" as const, label: g.name })),
    ...campus.slice(0, 3).map(c => ({ id: c.id, lat: c.lat, lng: c.lng, type: "campus" as const, label: c.name })),
  ];

  return (
    <div className="px-4 lg:px-8 py-6 lg:py-10 space-y-12 max-w-7xl mx-auto">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-hero text-primary-foreground p-6 sm:p-10 lg:p-14 shadow-glow">
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-accent/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-20 w-72 h-72 bg-coral/30 rounded-full blur-3xl" />
        <div className="relative grid lg:grid-cols-[1.2fr_1fr] gap-8 items-center">
          <div className="space-y-5">
            <Badge className="bg-card/15 text-primary-foreground border border-card/20 backdrop-blur hover:bg-card/20">
              ✨ Built for Erasmus students, useful for everyone
            </Badge>
            <Logo size="lg" />
            <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.05]">
              Your AI life copilot in <span className="bg-gradient-to-r from-accent to-warning bg-clip-text text-transparent">Ruse</span>
            </h1>
            <p className="text-base sm:text-lg opacity-90 max-w-xl">
              A multilingual assistant that helps Erasmus students, foreigners, tourists, and locals discover the city, understand documents, move around, and handle daily life.
            </p>
            <div className="flex flex-wrap gap-3 pt-1">
              <Button size="lg" onClick={() => navigate("/ask")} className="bg-card text-primary hover:bg-card/90 gap-2">
                <Sparkles className="w-4 h-4" /> Ask AI Assistant
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/explore")}
                className="bg-transparent border-card/40 text-primary-foreground hover:bg-card/15 gap-2">
                Try demo flows <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
            <div className="pt-2"><WeatherWidget /></div>
          </div>

          {/* Hero conversation card */}
          <div className="surface bg-card text-card-foreground p-5 rounded-3xl shadow-glow">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse-dot" />
              <span className="text-xs font-semibold text-muted-foreground">Live AI · Demo</span>
              <Badge variant="secondary" className="ml-auto text-[10px]">Sample chat</Badge>
            </div>
            <div className="space-y-3">
              <div className="flex justify-end">
                <div className="bg-secondary text-secondary-foreground px-3 py-2 rounded-2xl rounded-br-sm text-sm max-w-[85%]">
                  Can you help me buy a train ticket to Sofia?
                </div>
              </div>
              <div className="flex">
                <div className="bg-primary text-primary-foreground px-3 py-2 rounded-2xl rounded-bl-sm text-sm max-w-[90%]">
                  Yes. I'll show you the steps, the Bulgarian phrase to use, and what to check before travel.
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="chip">📋 Steps</span>
                <span className="chip">🇧🇬 Phrase</span>
                <span className="chip">🎫 Discounts</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick action cards */}
      <section>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickAction icon={Compass} title="Explore nearby" desc="Events, hidden gems, and people to go with." onClick={() => navigate("/explore")} accent="amber" />
          <QuickAction icon={Bus} title="Move around" desc="Routes, tickets, trains, buses and travel buddies." onClick={() => navigate("/move")} accent="teal" />
          <QuickAction icon={FileText} title="Decode documents" desc="Understand contracts, forms and university letters." onClick={() => navigate("/documents")} accent="navy" />
          <QuickAction icon={GraduationCap} title="Campus & Life" desc="University, health, emergency, and daily life guidance." onClick={() => navigate("/campus")} accent="coral" />
        </div>
      </section>

      {/* Map preview */}
      <section className="grid lg:grid-cols-[1fr_1.4fr] gap-6 items-center">
        <div>
          <Badge variant="secondary" className="mb-3">📍 The map</Badge>
          <h2 className="font-display text-2xl lg:text-3xl font-bold">See Ruse on the map</h2>
          <p className="text-muted-foreground mt-2">
            Find nearby events, hidden gems, campus places, and people to go with — all in one place.
          </p>
          <Button onClick={() => navigate("/explore")} className="mt-5 gap-2">
            <MapIcon className="w-4 h-4" /> Open the map in Explore
          </Button>
        </div>
        <RuseMap markers={allMarkers} height="h-[360px]" />
      </section>

      {/* How it works */}
      <section>
        <h2 className="font-display text-2xl font-bold mb-5">How it works</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { n: 1, t: "Ask or upload", d: "Ask a question, upload a document, or pick a topic." },
            { n: 2, t: "AI explains", d: "ERASMuse translates, summarizes, and creates action steps." },
            { n: 3, t: "Do it confidently", d: "Get routes, phrases, checklists, buddies, and guidance." },
          ].map(s => (
            <div key={s.n} className="surface p-5 bg-gradient-card">
              <div className="w-9 h-9 rounded-xl bg-primary text-primary-foreground font-bold flex items-center justify-center mb-3">{s.n}</div>
              <div className="font-semibold">{s.t}</div>
              <div className="text-sm text-muted-foreground mt-1">{s.d}</div>
            </div>
          ))}
        </div>
      </section>

      {/* User type selector */}
      <section className="surface p-6 lg:p-8 bg-gradient-card">
        <h2 className="font-display text-xl font-bold">Who are you?</h2>
        <p className="text-sm text-muted-foreground mt-1">Pick what fits — we'll personalise your home.</p>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-2 mt-4">
          {types.map(t => (
            <button
              key={t}
              onClick={() => setProfile(p => ({ ...p, userType: t }))}
              className={`text-left p-3 rounded-xl border text-sm font-medium transition-all ${
                profile.userType === t
                  ? "border-primary bg-secondary shadow-soft"
                  : "border-border hover:border-primary/40 bg-card"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        {profile.userType && (
          <p className="mt-4 text-sm text-primary font-medium">
            {userTypeMessages[profile.userType] ?? userTypeMessages.Other}
          </p>
        )}
      </section>
    </div>
  );
};

function QuickAction({
  icon: Icon, title, desc, onClick, accent,
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
    <button onClick={onClick}
      className="surface p-5 text-left hover:shadow-glow transition-all hover:-translate-y-0.5 bg-gradient-card group">
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
