import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { usePlan } from "@/hooks/usePlan";
import { useNavigate } from "react-router-dom";
import { BookmarkCheck, Trash2, Calendar, MapPin, Bus, Bell, Users } from "lucide-react";

const ICONS = { event: Calendar, gem: MapPin, route: Bus, reminder: Bell, buddy: Users, doc: BookmarkCheck };

const TYPE_LABELS = {
  event: "Saved events",
  gem: "Saved places",
  route: "Travel plans",
  reminder: "Important reminders",
  buddy: "Buddies",
  doc: "Documents",
} as const;

const Plan = () => {
  const navigate = useNavigate();
  const { items, remove } = usePlan();

  const grouped = (Object.keys(TYPE_LABELS) as (keyof typeof TYPE_LABELS)[]).map(k => ({
    key: k,
    label: TYPE_LABELS[k],
    items: items.filter(i => i.type === k),
  })).filter(g => g.items.length > 0);

  return (
    <div className="px-4 lg:px-8 py-6 max-w-5xl mx-auto space-y-6">
      <PageHeader title="My Plan" subtitle="Your saved events, places, routes, and reminders." />

      {items.length === 0 ? (
        <div className="surface p-10 text-center bg-gradient-card">
          <BookmarkCheck className="w-12 h-12 mx-auto text-muted-foreground" />
          <p className="font-display font-semibold mt-3">Your plan is empty.</p>
          <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
            Add events, hidden gems, routes, or reminders to build your Ruse day.
          </p>
          <div className="flex gap-2 justify-center mt-5">
            <Button onClick={() => navigate("/explore")}>Explore events</Button>
            <Button variant="outline" onClick={() => navigate("/move")}>Plan a trip</Button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {grouped.map(g => {
            const Icon = ICONS[g.key];
            return (
              <section key={g.key}>
                <h2 className="font-display text-lg font-bold mb-2 flex items-center gap-2">
                  <Icon className="w-4 h-4 text-primary" /> {g.label} <Badge variant="secondary" className="ml-1">{g.items.length}</Badge>
                </h2>
                <div className="space-y-2">
                  {g.items.map(i => (
                    <div key={i.id} className="surface p-4 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="font-semibold truncate">{i.title}</div>
                        {i.meta && <div className="text-xs text-muted-foreground">{i.meta}</div>}
                      </div>
                      <div className="flex gap-2 shrink-0">
                        {i.href && <Button size="sm" variant="outline" onClick={() => navigate(i.href!)}>Open</Button>}
                        <Button size="icon" variant="ghost" onClick={() => remove(i.id)}>
                          <Trash2 className="w-4 h-4 text-muted-foreground" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Plan;
