import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Search } from "lucide-react";
import { events } from "@/data/events";
import { hiddenGems } from "@/data/hiddenGems";
import { campus } from "@/data/campus";
import { lifeAdmin } from "@/data/lifeAdmin";
import { routes } from "@/data/routes";
import { Badge } from "@/components/ui/badge";

type Result = { id: string; label: string; type: string; href: string; chip: string };

export function GlobalSearch() {
  const { t } = useTranslation();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const results = useMemo<Result[]>(() => {
    const t = q.trim().toLowerCase();
    if (!t) return [];
    const r: Result[] = [];
    events.forEach(e => {
      if (e.title.toLowerCase().includes(t) || e.tags.some(tag => tag.toLowerCase().includes(t)))
        r.push({ id: e.id, label: e.title, type: "Event", href: "/explore", chip: "Event" });
    });
    hiddenGems.forEach(g => {
      if (g.name.toLowerCase().includes(t) || g.category.toLowerCase().includes(t))
        r.push({ id: g.id, label: g.name, type: "Hidden gem", href: "/explore", chip: "Gem" });
    });
    campus.forEach(c => {
      if (c.name.toLowerCase().includes(t))
        r.push({ id: c.id, label: c.name, type: "Campus", href: "/campus", chip: "Campus" });
    });
    lifeAdmin.forEach(s => {
      if (s.title.toLowerCase().includes(t))
        r.push({ id: s.id, label: s.title, type: "Life Admin", href: "/life-admin", chip: "Life" });
    });
    routes.forEach(rt => {
      if (`${rt.from} ${rt.to}`.toLowerCase().includes(t))
        r.push({ id: rt.id, label: `${rt.from} → ${rt.to}`, type: "Route", href: "/move", chip: "Route" });
    });
    return r.slice(0, 8);
  }, [q]);

  return (
    <div className="relative">
      <div className="flex items-center gap-2 px-3 h-10 rounded-xl border border-border bg-card">
        <Search className="w-4 h-4 text-muted-foreground" />
        <input
          value={q}
          onChange={e => { setQ(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder={t('search.placeholder')}
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>
      {open && results.length > 0 && (
        <div className="absolute left-0 right-0 mt-2 surface p-2 z-50 max-h-80 overflow-y-auto">
          {results.map(r => (
            <button
              key={`${r.type}-${r.id}`}
              onClick={() => { navigate(r.href); setOpen(false); setQ(""); }}
              className="w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg hover:bg-secondary text-left"
            >
              <div>
                <div className="text-sm font-medium">{r.label}</div>
                <div className="text-xs text-muted-foreground">{r.type}</div>
              </div>
              <Badge variant="secondary" className="text-[10px]">{r.chip}</Badge>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
