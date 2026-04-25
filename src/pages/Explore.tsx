import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RuseMap, type MapMarker } from "@/components/RuseMap";
import { events } from "@/data/events";
import { hiddenGems } from "@/data/hiddenGems";
import { buddies } from "@/data/buddies";
import { usePlan } from "@/hooks/usePlan";
import { evening15LevaPlan } from "@/lib/mockAssistant";
import { AnswerCard } from "@/components/AnswerCard";
import { Sparkles, MapPin, Users, Bookmark, Calendar, Search, Send } from "lucide-react";
import { formatLv } from "@/lib/currency";
import { toast } from "sonner";

const Explore = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { add } = usePlan();
  const [cat, setCat] = useState("All");
  const [selected, setSelected] = useState<string | null>(null);
  const [aiQuery, setAiQuery] = useState("");
  const [plan, setPlan] = useState<typeof evening15LevaPlan | null>(null);
  const [loading, setLoading] = useState(false);

  const categories = [
    { key: "All", label: t("explore.filters.all") },
    { key: "Events", label: t("explore.filters.events") },
    { key: "Food", label: t("explore.filters.food") },
    { key: "Places", label: t("explore.filters.places") },
    { key: "Weekend", label: t("explore.filters.weekend") },
    { key: "Budget", label: t("explore.filters.budget") },
    { key: "Buddies", label: t("explore.filters.withBuddies") },
  ];

  const filteredEvents = useMemo(
    () => (cat === "All" ? events : events.filter(e => e.category === cat || e.tags.includes(cat))),
    [cat]
  );

  const markers: MapMarker[] = [
    ...filteredEvents.map(e => ({ id: e.id, lat: e.lat, lng: e.lng, type: "event" as const, label: e.title })),
    ...hiddenGems.map(g => ({ id: g.id, lat: g.lat, lng: g.lng, type: "gem" as const, label: g.name })),
    ...buddies.filter(b => b.lat && b.lng).map(b => ({ id: b.id, lat: b.lat!, lng: b.lng!, type: "buddy" as const, label: b.firstName })),
  ];

  const generatePlan = async (query?: string) => {
    setLoading(true);
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 800));
    setPlan(evening15LevaPlan);
    setLoading(false);
    toast.success("Your Ruse plan is ready");
  };

  const quickFilters = [
    t("explore.filters.events"),
    t("explore.filters.food"),
    t("explore.filters.places"),
    t("explore.filters.weekend"),
    t("explore.filters.budget"),
    t("explore.filters.withBuddies"),
  ];

  return (
    <div className="px-4 lg:px-8 py-6 max-w-7xl mx-auto space-y-6">
      <PageHeader
        title={t("explore.title")}
        subtitle={t("explore.subtitle")}
      />

      {/* AI Assistant Card - TOP */}
      <section className="surface p-6 bg-gradient-card">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-accent text-accent-foreground flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h3 className="font-display font-bold">{t("explore.askAI")}</h3>
          </div>
        </div>

        {/* AI Input */}
        <form
          onSubmit={(e) => { e.preventDefault(); generatePlan(aiQuery); }}
          className="flex items-center gap-2 p-2 rounded-xl border border-border bg-background"
        >
          <Search className="w-4 h-4 text-muted-foreground ml-2" />
          <input
            value={aiQuery}
            onChange={(e) => setAiQuery(e.target.value)}
            placeholder={t("explore.moodPlaceholder")}
            disabled={loading}
            className="flex-1 bg-transparent px-2 py-2 text-sm outline-none"
          />
          <Button type="submit" disabled={loading} size="sm" className="gap-1.5">
            <Sparkles className="w-4 h-4" /> {t("explore.createPlan")}
          </Button>
        </form>

        {/* Loading State */}
        {loading && (
          <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse-dot" />
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse-dot" style={{ animationDelay: "0.2s" }} />
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse-dot" style={{ animationDelay: "0.4s" }} />
            <span className="ml-2">Creating your plan...</span>
          </div>
        )}

        {/* Generated Plan */}
        {plan && !loading && (
          <div className="mt-4">
            <AnswerCard answer={plan} onAction={(a) => {
              if (a.toLowerCase().includes("buddy")) navigate("/buddies");
              else if (a.toLowerCase().includes("map")) navigate("/explore");
              else if (a.toLowerCase().includes("plan")) navigate("/buddies?tab=my-plan");
            }} />
          </div>
        )}
      </section>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-3">
        {categories.map(c => (
          <button
            key={c.key}
            onClick={() => setCat(c.key)}
            className={`chip ${cat === c.key ? "chip-active bg-primary text-primary-foreground border-primary" : ""}`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Map + Events List */}
      <div className="grid lg:grid-cols-[1fr_1.2fr] gap-5">
        {/* Events List */}
        <div className="space-y-3 order-2 lg:order-1 h-[420px] lg:h-[500px] overflow-y-auto pr-1">
          {filteredEvents.map(e => (
            <button
              key={e.id}
              onClick={() => setSelected(e.id)}
              className={`w-full text-left surface p-4 hover:shadow-md transition-all ${selected === e.id ? "ring-2 ring-accent" : ""
                }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-display font-semibold">{e.title}</div>
                  <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {e.date} - {e.time} - {e.locationName}
                  </div>
                </div>
                <Badge className={e.price === 0 ? "bg-success text-success-foreground" : "bg-warning text-warning-foreground"}>
                  {formatLv(e.price)}
                </Badge>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {e.tags.slice(0, 3).map(tag => (
                  <Badge key={tag} variant="secondary" className="text-[10px]">{tag}</Badge>
                ))}
              </div>
              {e.whyAi && (
                <div className="text-xs text-accent mt-2 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> {e.whyAi}
                </div>
              )}
              <div className="flex gap-2 mt-3">
                <Button size="sm" variant="outline" onClick={(ev) => { ev.stopPropagation(); navigate("/buddies"); }}>
                  {t("explore.findBuddy")}
                </Button>
                <Button size="sm" variant="outline" onClick={(ev) => { ev.stopPropagation(); navigate("/move"); }}>
                  {t("explore.route")}
                </Button>
                <Button size="sm" variant="ghost" onClick={(ev) => {
                  ev.stopPropagation();
                  add({ refId: e.id, type: "event", title: e.title, meta: `${e.date} - ${e.time}`, href: "/explore" });
                  toast.success("Added to plan");
                }}>
                  <Bookmark className="w-3.5 h-3.5" />
                </Button>
              </div>
            </button>
          ))}
        </div>

        {/* Map */}
        <div className="order-1 lg:order-2 space-y-3">
          <RuseMap markers={markers} selectedId={selected} onSelect={(m) => setSelected(m.id)} height="h-[420px] lg:h-[500px]" />
          <div className="surface p-3 text-xs text-muted-foreground flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5" /> {t("explore.mapHint")}
          </div>
        </div>
      </div>

      {/* Hidden Gems */}
      <section>
        <h2 className="font-display text-xl font-bold mb-3">{t("explore.hiddenGems")}</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {hiddenGems.slice(0, 4).map(g => (
            <div key={g.id} className="surface p-4 bg-gradient-card hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between gap-2">
                <Badge variant="secondary">{g.category}</Badge>
                <span className="text-xs font-semibold text-accent">{g.hiddenScore}/10</span>
              </div>
              <div className="font-display font-semibold mt-2">{g.name}</div>
              <div className="text-xs text-muted-foreground mt-1 line-clamp-2">{g.description}</div>
              <div className="text-[11px] text-accent mt-2 italic">{t("explore.localTip")}: {g.localTip}</div>
              <div className="flex justify-between items-center mt-3">
                <span className="text-xs text-muted-foreground">{g.distance} - {formatLv(g.budget)}</span>
                <Button size="sm" variant="outline" onClick={() => {
                  add({ refId: g.id, type: "gem", title: g.name, meta: g.distance, href: "/explore" });
                  toast.success("Saved to plan");
                }}>
                  {t("explore.save")}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Explore;
