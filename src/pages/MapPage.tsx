import { useState, useMemo } from "react";
import { PageHeader } from "@/components/PageHeader";
import { RuseMap, type MapMarker } from "@/components/RuseMap";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { events } from "@/data/events";
import { hiddenGems } from "@/data/hiddenGems";
import { campus } from "@/data/campus";
import { buddies } from "@/data/buddies";
import { Locate, X } from "lucide-react";
import { toast } from "sonner";

type Filter = "events" | "gems" | "campus" | "buddies";

const MapPage = () => {
  const [filters, setFilters] = useState<Record<Filter, boolean>>({
    events: true, gems: true, campus: true, buddies: true,
  });
  const [selected, setSelected] = useState<string | null>(null);

  const markers: MapMarker[] = useMemo(() => {
    const list: MapMarker[] = [];
    if (filters.events) events.forEach(e => list.push({ id: e.id, lat: e.lat, lng: e.lng, type: "event", label: e.title }));
    if (filters.gems) hiddenGems.forEach(g => list.push({ id: g.id, lat: g.lat, lng: g.lng, type: "gem", label: g.name }));
    if (filters.campus) campus.forEach(c => list.push({ id: c.id, lat: c.lat, lng: c.lng, type: "campus", label: c.name }));
    if (filters.buddies) buddies.filter(b => b.lat && b.lng).forEach(b => list.push({ id: b.id, lat: b.lat!, lng: b.lng!, type: "buddy", label: b.firstName }));
    return list;
  }, [filters]);

  const selectedItem = selected
    ? events.find(e => e.id === selected)
      || hiddenGems.find(g => g.id === selected)
      || campus.find(c => c.id === selected)
      || buddies.find(b => b.id === selected)
    : null;

  return (
    <div className="px-4 lg:px-8 py-6 max-w-7xl mx-auto space-y-5">
      <PageHeader
        title="Ruse Map"
        subtitle="Events, hidden gems, campus places, and buddies around you."
      >
        <Button variant="outline" size="sm" className="gap-2"
          onClick={() => toast("Location permission denied. We'll use University of Ruse as your starting point.")}>
          <Locate className="w-4 h-4" /> Use my location
        </Button>
      </PageHeader>

      <div className="flex flex-wrap gap-2">
        {(["events", "gems", "campus", "buddies"] as Filter[]).map(f => (
          <button key={f}
            onClick={() => setFilters(s => ({ ...s, [f]: !s[f] }))}
            className={`chip capitalize ${filters[f] ? "chip-active bg-primary text-primary-foreground border-primary" : ""}`}>
            {f}
          </button>
        ))}
      </div>

      <RuseMap markers={markers} selectedId={selected} onSelect={(m) => setSelected(m.id)} height="h-[60vh]" />

      {selectedItem && (
        <div className="surface p-5 bg-gradient-card animate-fade-up">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="font-display font-bold text-lg">
                {"title" in selectedItem ? selectedItem.title :
                 "name" in selectedItem ? selectedItem.name :
                 selectedItem.firstName}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {"category" in selectedItem ? selectedItem.category :
                 "userType" in selectedItem ? selectedItem.userType : ""}
              </div>
            </div>
            <Button size="icon" variant="ghost" onClick={() => setSelected(null)}><X className="w-4 h-4" /></Button>
          </div>
          {"description" in selectedItem && <p className="text-sm mt-2">{selectedItem.description}</p>}
          {"note" in selectedItem && selectedItem.note && <p className="text-sm mt-2 italic text-muted-foreground">"{selectedItem.note}"</p>}
          <div className="flex flex-wrap gap-2 mt-3">
            {"tags" in selectedItem && selectedItem.tags?.slice(0, 3).map(t => <Badge key={t} variant="secondary">{t}</Badge>)}
          </div>
        </div>
      )}
    </div>
  );
};

export default MapPage;
