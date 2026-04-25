import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { buddies, type Buddy } from "@/data/buddies";
import { events } from "@/data/events";
import { Send, Bookmark, Flag, Ban, Users, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { usePlan } from "@/hooks/usePlan";

const TABS = ["Event Buddies", "Travel Buddies", "My Requests"] as const;

const Buddies = () => {
  const [tab, setTab] = useState<typeof TABS[number]>("Event Buddies");
  const { add } = usePlan();

  const eventBuddies = buddies.filter(b => b.type === "event");
  const travelBuddies = buddies.filter(b => b.type === "travel");

  return (
    <div className="px-4 lg:px-8 py-6 max-w-6xl mx-auto space-y-6">
      <PageHeader
        title="Buddy Finder"
        subtitle="Find someone to attend events, explore Ruse, or travel with."
      />

      <div className="rounded-2xl border border-accent/30 bg-secondary p-3 text-xs text-secondary-foreground">
        🛡️ Safety first: meet in public places, avoid sharing personal details too early, and use university or public locations when possible.
      </div>

      <div className="flex flex-wrap gap-2">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`chip ${tab === t ? "chip-active bg-primary text-primary-foreground border-primary" : ""}`}>
            {t}
          </button>
        ))}
      </div>

      {tab === "Event Buddies" && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {eventBuddies.map(b => {
            const ev = events.find(e => e.id === b.relatedEventId);
            return (
              <BuddyCard key={b.id} b={b} subtitle={ev ? `${ev.title} · ${ev.date}` : "Event buddy"} onAdd={() =>
                ev && add({ refId: b.id, type: "buddy", title: `Buddy: ${b.firstName}`, meta: ev.title, href: "/buddies" })
              } />
            );
          })}
        </div>
      )}

      {tab === "Travel Buddies" && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {travelBuddies.map(b => (
            <BuddyCard
              key={b.id}
              b={b}
              subtitle={`${b.from} → ${b.to} · ${b.date}`}
              extra={b.meetingPoint ? `Meet at ${b.meetingPoint}` : undefined}
              onAdd={() => add({ refId: b.id, type: "buddy", title: `${b.from} → ${b.to}`, meta: b.date ?? "", href: "/buddies" })}
            />
          ))}
        </div>
      )}

      {tab === "My Requests" && (
        <div className="surface p-8 text-center bg-gradient-card">
          <Users className="w-10 h-10 mx-auto text-muted-foreground" />
          <p className="font-display font-semibold mt-3">No requests yet</p>
          <p className="text-sm text-muted-foreground mt-1">Send an invite to a buddy and you'll see it here.</p>
        </div>
      )}
    </div>
  );
};

function BuddyCard({ b, subtitle, extra, onAdd }: { b: Buddy; subtitle: string; extra?: string; onAdd: () => void }) {
  return (
    <div className="surface p-4 bg-gradient-card hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-coral/15 text-coral font-bold flex items-center justify-center">
            {b.firstName.charAt(0)}
          </div>
          <div>
            <div className="font-semibold">{b.firstName}</div>
            <div className="text-[11px] text-muted-foreground">{b.userType}</div>
          </div>
        </div>
        <Badge className="bg-success text-success-foreground gap-1"><Sparkles className="w-3 h-3" /> {b.matchScore}%</Badge>
      </div>
      <div className="text-xs text-muted-foreground mt-3">{subtitle}</div>
      {extra && <div className="text-[11px] text-muted-foreground">{extra}</div>}
      <div className="flex flex-wrap gap-1 mt-2">
        {b.languages.map(l => <Badge key={l} variant="secondary" className="text-[10px]">{l}</Badge>)}
      </div>
      <div className="flex gap-2 mt-3">
        <Button size="sm" className="gap-1.5" onClick={() => toast.success("Invite prepared ✓ · In the real version this would send a safe connection request.")}>
          <Send className="w-3.5 h-3.5" /> Send invite
        </Button>
        <Button size="sm" variant="outline" onClick={onAdd}><Bookmark className="w-3.5 h-3.5" /></Button>
        <Button size="sm" variant="ghost" onClick={() => toast("Reported (demo)")}><Flag className="w-3.5 h-3.5" /></Button>
        <Button size="sm" variant="ghost" onClick={() => toast("Blocked (demo)")}><Ban className="w-3.5 h-3.5" /></Button>
      </div>
    </div>
  );
}

export default Buddies;
