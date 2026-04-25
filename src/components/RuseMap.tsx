import { useMemo, useRef } from "react";
import { cn } from "@/lib/utils";

export type MapMarker = {
  id: string;
  lat: number;
  lng: number;
  type: "event" | "gem" | "campus" | "buddy";
  label?: string;
};

const TYPE_COLOR: Record<MapMarker["type"], string> = {
  event: "bg-warning",
  gem: "bg-accent",
  campus: "bg-primary",
  buddy: "bg-coral",
};

// Ruse approximate bounds for our mock data.
const BOUNDS = { minLat: 43.825, maxLat: 43.858, minLng: 25.945, maxLng: 25.975 };

function project(lat: number, lng: number) {
  const x = ((lng - BOUNDS.minLng) / (BOUNDS.maxLng - BOUNDS.minLng)) * 100;
  const y = (1 - (lat - BOUNDS.minLat) / (BOUNDS.maxLat - BOUNDS.minLat)) * 100;
  return { x: Math.max(2, Math.min(98, x)), y: Math.max(4, Math.min(96, y)) };
}

export function RuseMap({
  markers, selectedId, onSelect, height = "h-[420px]",
}: {
  markers: MapMarker[];
  selectedId?: string | null;
  onSelect?: (m: MapMarker) => void;
  height?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const items = useMemo(() => markers.map(m => ({ ...m, p: project(m.lat, m.lng) })), [markers]);

  return (
    <div ref={ref} className={cn("relative w-full overflow-hidden rounded-2xl border border-border shadow-soft", height)}>
      {/* Stylised mock map background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--sky))_0%,transparent_50%),radial-gradient(circle_at_70%_80%,hsl(var(--sand))_0%,transparent_55%),linear-gradient(180deg,hsl(var(--secondary)),hsl(var(--background)))]" />
      {/* River band */}
      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
        <path d="M0,82 C25,72 45,90 65,80 S95,70 100,76 L100,100 L0,100 Z"
              fill="hsl(var(--accent) / 0.18)" stroke="hsl(var(--accent) / 0.4)" strokeWidth="0.4" />
        <path d="M0,32 C20,28 40,40 60,34 S90,30 100,34"
              fill="none" stroke="hsl(var(--primary) / 0.18)" strokeWidth="0.5" strokeDasharray="1.5,1.5" />
        <circle cx="50" cy="48" r="0.6" fill="hsl(var(--primary))" opacity="0.4" />
      </svg>
      <div className="absolute top-3 left-3 px-2 py-1 rounded-md bg-card/80 backdrop-blur text-[10px] font-medium border border-border text-muted-foreground">
        Ruse · 43.8356°N, 25.9657°E
      </div>
      <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5">
        <Legend color="bg-warning" label="Events" />
        <Legend color="bg-accent" label="Gems" />
        <Legend color="bg-primary" label="Campus" />
        <Legend color="bg-coral" label="Buddies" />
      </div>

      {items.map(m => {
        const isSel = m.id === selectedId;
        return (
          <button
            key={`${m.type}-${m.id}`}
            onClick={() => onSelect?.(m)}
            style={{ left: `${m.p.x}%`, top: `${m.p.y}%` }}
            className={cn(
              "absolute -translate-x-1/2 -translate-y-1/2 group focus:outline-none",
              isSel && "z-10"
            )}
            aria-label={m.label}
          >
            <span className={cn(
              "block rounded-full ring-2 ring-card transition-all",
              TYPE_COLOR[m.type],
              isSel ? "w-5 h-5 shadow-glow scale-110" : "w-3.5 h-3.5 shadow-soft group-hover:scale-125"
            )} />
            {(isSel || m.label) && (
              <span className={cn(
                "absolute left-1/2 -translate-x-1/2 mt-1 whitespace-nowrap text-[10px] font-medium px-1.5 py-0.5 rounded-md border border-border bg-card/90 backdrop-blur",
                isSel ? "opacity-100" : "opacity-0 group-hover:opacity-100 transition-opacity"
              )}>
                {m.label}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-card/80 backdrop-blur text-[10px] border border-border">
      <span className={cn("w-2 h-2 rounded-full", color)} /> {label}
    </span>
  );
}
