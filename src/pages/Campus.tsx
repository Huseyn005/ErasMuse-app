import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { campus } from "@/data/campus";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { usePlan } from "@/hooks/usePlan";
import { Check, Sparkles, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CHECKLIST = [
  "Confirm accommodation",
  "Visit Erasmus / international office",
  "Check university schedule",
  "Learn how to reach campus",
  "Join student communication channels",
  "Learn emergency number (112)",
  "Understand healthcare options",
  "Explore city center",
  "Save important contacts",
];

const ANNOUNCEMENTS = [
  { id: "an1", title: "Hackathon kickoff weekend", when: "Sat 10:00", where: "Main building", who: "All students", why: "Build, network, win prizes" },
  { id: "an2", title: "Erasmus welcome meeting", when: "Mon 18:00", where: "International office", who: "New Erasmus students", why: "Meet your buddies & coordinator" },
  { id: "an3", title: "Cultural night", when: "Fri 19:00", where: "Cafeteria", who: "Everyone", why: "Food, music & friendships" },
  { id: "an4", title: "University sports day", when: "Sun 11:00", where: "Sports hall", who: "All students", why: "Casual games + prizes" },
  { id: "an5", title: "Student club fair", when: "Tue 12:00", where: "Main entrance", who: "Everyone", why: "Find your community" },
];

const Campus = () => {
  const navigate = useNavigate();
  const { add } = usePlan();
  const [done, setDone] = useLocalStorage<string[]>("erasmuse:checklist", []);
  const [open, setOpen] = useState<string | null>(null);

  const toggle = (i: string) =>
    setDone(d => d.includes(i) ? d.filter(x => x !== i) : [...d, i]);

  return (
    <div className="px-4 lg:px-8 py-6 max-w-6xl mx-auto space-y-10">
      <PageHeader
        title="Campus Life"
        subtitle="University facilities, Erasmus information, announcements, events, and first-week help."
      />

      <section>
        <h2 className="font-display text-xl font-bold mb-3">Facilities at the University of Ruse</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {campus.map(f => (
            <div key={f.id} className="surface p-4 bg-gradient-card">
              <div className="flex items-start justify-between gap-2">
                <div className="font-semibold">{f.name}</div>
                <Badge variant="secondary" className="text-[10px]">{f.usefulFor[0]}</Badge>
              </div>
              <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {f.location}
              </div>
              <p className="text-sm mt-2">{f.description}</p>
              <div className="text-[11px] text-accent mt-2 italic">💡 {f.tips}</div>
              <div className="flex gap-2 mt-3">
                <Button size="sm" variant="outline" onClick={() => navigate("/ask")} className="gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Ask AI
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="surface p-5 bg-gradient-card">
        <h2 className="font-display text-xl font-bold mb-3">Erasmus first-week checklist</h2>
        <div className="grid md:grid-cols-2 gap-2">
          {CHECKLIST.map(c => {
            const isDone = done.includes(c);
            return (
              <label key={c} className="flex items-center gap-3 p-3 rounded-xl border border-border bg-card cursor-pointer hover:border-primary/40">
                <span className={`w-5 h-5 rounded-md flex items-center justify-center border ${isDone ? "bg-success border-success text-success-foreground" : "border-border"}`}>
                  {isDone && <Check className="w-3.5 h-3.5" />}
                </span>
                <span className={`text-sm ${isDone ? "line-through text-muted-foreground" : ""}`}>{c}</span>
                <input type="checkbox" checked={isDone} onChange={() => toggle(c)} className="sr-only" />
              </label>
            );
          })}
        </div>
        <div className="text-xs text-muted-foreground mt-3">
          Saved automatically — your progress stays here.
        </div>
      </section>

      <section>
        <h2 className="font-display text-xl font-bold mb-3">Announcements</h2>
        <div className="space-y-3">
          {ANNOUNCEMENTS.map(a => (
            <div key={a.id} className="surface p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-semibold">{a.title}</div>
                  <div className="text-xs text-muted-foreground">{a.when} · {a.where}</div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => setOpen(open === a.id ? null : a.id)}>
                    {open === a.id ? "Hide summary" : "Summarize"}
                  </Button>
                  <Button size="sm" onClick={() => add({ refId: a.id, type: "reminder", title: a.title, meta: `${a.when} · ${a.where}`, href: "/campus" })}>
                    Add to plan
                  </Button>
                </div>
              </div>
              {open === a.id && (
                <div className="mt-3 grid sm:grid-cols-2 gap-2 text-sm animate-fade-up">
                  <Bullet label="What" value={a.title} />
                  <Bullet label="When" value={a.when} />
                  <Bullet label="Where" value={a.where} />
                  <Bullet label="Who" value={a.who} />
                  <Bullet label="Why it matters" value={a.why} />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

function Bullet({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-3 py-2 rounded-xl border border-border bg-card">
      <div className="text-[10px] text-muted-foreground uppercase">{label}</div>
      <div className="text-sm">{value}</div>
    </div>
  );
}

export default Campus;
