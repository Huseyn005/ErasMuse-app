import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { Sparkles, MapPin, Users, Bookmark, Calendar } from "lucide-react";
import { formatLv } from "@/lib/currency";
import { toast } from "sonner";

const CATS = ["All", "Music", "Culture", "Food", "Tech", "Social", "Chill", "Education"];

const Explore = () => {
  const navigate = useNavigate();
  const { add } = usePlan();
  const [cat, setCat] = useState("All");
  const [selected, setSelected] = useState<string | null>(null);
  const [mood, setMood] = useState("");
  const [plan, setPlan] = useState<typeof evening15LevaPlan | null>(null);

  const filteredEvents = useMemo(
    () => (cat === "All" ? events : events.filter(e => e.category === cat || e.tags.includes(cat))),
    [cat]
  );

  const markers: MapMarker[] = [
    ...filteredEvents.map(e => ({ id: e.id, lat: e.lat, lng: e.lng, type: "event" as const, label: e.title })),
    ...hiddenGems.map(g => ({ id: g.id, lat: g.lat, lng: g.lng, type: "gem" as const, label: g.name })),
    ...buddies.filter(b => b.lat && b.lng).map(b => ({ id: b.id, lat: b.lat!, lng: b.lng!, type: "buddy" as const, label: b.firstName })),
  ];

  const generatePlan = () => {
    setPlan(evening15LevaPlan);
    toast.success("Your Ruse plan is ready ✓");
  };

  return (
    <div className="px-4 lg:px-8 py-6 max-w-7xl mx-auto space-y-8">
      <PageHeader
        title="Explore Ruse"
        subtitle="Events, hidden gems, student places, and people to go with."
      />

      <div className="grid lg:grid-cols-[1fr_1.2fr] gap-5">
        {/* Filters + list */}
        <div className="space-y-4 order-2 lg:order-1">
          <div className="flex flex-wrap gap-2">
            {CATS.map(c => (
              <button key={c}
                onClick={() => setCat(c)}
                className={`chip ${cat === c ? "chip-active bg-primary text-primary-foreground border-primary" : ""}`}>
                {c}
              </button>
            ))}
          </div>

          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
            {filteredEvents.map(e => (
              <button
                key={e.id}
                onClick={() => setSelected(e.id)}
                className={`w-full text-left surface p-4 hover:shadow-md transition-all ${
                  selected === e.id ? "ring-2 ring-accent" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-display font-semibold">{e.title}</div>
                    <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {e.date} · {e.time} · {e.locationName}
                    </div>
                  </div>
                  <Badge className={e.price === 0 ? "bg-success text-success-foreground" : "bg-warning text-warning-foreground"}>
                    {formatLv(e.price)}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {e.tags.slice(0, 3).map(t => <Badge key={t} variant="secondary" className="text-[10px]">{t}</Badge>)}
                </div>
                {e.whyAi && (
                  <div className="text-xs text-accent mt-2 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> {e.whyAi}
                  </div>
                )}
                <div className="flex gap-2 mt-3">
                  <Button size="sm" variant="outline" onClick={(ev) => { ev.stopPropagation(); navigate("/buddies"); }}>Find buddy</Button>
                  <Button size="sm" variant="outline" onClick={(ev) => { ev.stopPropagation(); navigate("/map"); }}>Route</Button>
                  <Button size="sm" variant="ghost" onClick={(ev) => {
                    ev.stopPropagation();
                    add({ refId: e.id, type: "event", title: e.title, meta: `${e.date} · ${e.time}`, href: "/explore" });
                  }}>
                    <Bookmark className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="order-1 lg:order-2 space-y-3">
          <RuseMap markers={markers} selectedId={selected} onSelect={(m) => setSelected(m.id)} height="h-[420px] lg:h-[560px]" />
          <div className="surface p-3 text-xs text-muted-foreground flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5" /> Click markers to highlight events. Filters update both list and map.
          </div>
        </div>
      </div>

      {/* Hidden gems */}
      <section>
        <h2 className="font-display text-xl font-bold mb-3">Hidden gems near you</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {hiddenGems.slice(0, 4).map(g => (
            <div key={g.id} className="surface p-4 bg-gradient-card hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between gap-2">
                <Badge variant="secondary">{g.category}</Badge>
                <span className="text-xs font-semibold text-accent">★ {g.hiddenScore}/10</span>
              </div>
              <div className="font-display font-semibold mt-2">{g.name}</div>
              <div className="text-xs text-muted-foreground mt-1 line-clamp-2">{g.description}</div>
              <div className="text-[11px] text-accent mt-2 italic">💡 {g.localTip}</div>
              <div className="flex justify-between items-center mt-3">
                <span className="text-xs text-muted-foreground">{g.distance} · {formatLv(g.budget)}</span>
                <Button size="sm" variant="outline" onClick={() =>
                  add({ refId: g.id, type: "gem", title: g.name, meta: g.distance, href: "/explore" })}>
                  Save
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Personalized local plan */}
      <section className="surface p-6 bg-gradient-card">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-9 h-9 rounded-xl bg-coral/15 text-coral flex items-center justify-center"><Users className="w-4 h-4" /></div>
          <h3 className="font-display font-bold text-lg">Tell us your mood — get a plan</h3>
        </div>
        <textarea
          value={mood}
          onChange={e => setMood(e.target.value)}
          placeholder="I am free after 18:00, I like music, I have 15 leva, and I don't want to go alone."
          className="w-full min-h-[80px] p-3 rounded-xl border border-border bg-card text-sm"
        />
        <Button className="mt-3 bg-accent text-accent-foreground hover:bg-accent/90 gap-2" onClick={generatePlan}>
          <Sparkles className="w-4 h-4" /> Create my Ruse plan
        </Button>
        {plan && (
          <div className="mt-5">
            <AnswerCard answer={plan} onAction={(a) => {
              if (a.toLowerCase().includes("buddy")) navigate("/buddies");
              else if (a.toLowerCase().includes("map")) navigate("/map");
              else if (a.toLowerCase().includes("plan")) navigate("/plan");
            }} />
          </div>
        )}
      </section>
    </div>
  );
};

export default Explore;
