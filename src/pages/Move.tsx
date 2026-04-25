import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PhraseCard } from "@/components/PhraseCard";
import { routes, type Route } from "@/data/routes";
import { usePlan } from "@/hooks/usePlan";
import { Bus, Train, MapPin, ArrowRight, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const STOPS = ["University of Ruse", "Student dorms", "City Center", "Railway Station", "Bus Station", "Danube River area"];

const TICKET_VOCAB: { bg: string; en: string }[] = [
  { bg: "билет", en: "ticket" },
  { bg: "влак", en: "train" },
  { bg: "гара", en: "railway station" },
  { bg: "перон", en: "platform" },
  { bg: "час", en: "time" },
  { bg: "място", en: "seat" },
  { bg: "отиване и връщане", en: "return ticket" },
];

const Move = () => {
  const navigate = useNavigate();
  const { add } = usePlan();
  const [from, setFrom] = useState("University of Ruse");
  const [to, setTo] = useState("Railway Station");
  const [route, setRoute] = useState<Route | null>(null);

  const [tFrom, setTFrom] = useState("Ruse");
  const [tTo, setTTo] = useState("Sofia");
  const [tDate, setTDate] = useState("");
  const [tDiscount, setTDiscount] = useState(true);
  const [ticket, setTicket] = useState<Route | null>(null);

  const findRoute = () => {
    const found = routes.find(r => r.from === from && r.to === to)
      || routes.find(r => r.from.includes(from.split(" ")[0]) && r.to.includes(to.split(" ")[0]))
      || routes[0];
    setRoute(found);
  };

  const explainTicket = () => {
    setTicket(routes.find(r => r.id === "r2") ?? routes[0]);
  };

  return (
    <div className="px-4 lg:px-8 py-6 max-w-6xl mx-auto space-y-10">
      <PageHeader
        title="Move around Ruse and Bulgaria"
        subtitle="Routes, buses, trains, tickets, stations, and travel phrases — explained simply."
      />

      <section className="grid lg:grid-cols-2 gap-5">
        <div className="surface p-5 bg-gradient-card space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-accent/15 text-accent flex items-center justify-center"><Bus className="w-4 h-4" /></div>
            <h3 className="font-display font-bold text-lg">Route helper</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <SelectField label="From" value={from} onChange={setFrom} options={STOPS} />
            <SelectField label="To" value={to} onChange={setTo} options={STOPS} />
          </div>
          <Button onClick={findRoute} className="w-full gap-2"><MapPin className="w-4 h-4" /> Find route</Button>

          {route && (
            <div className="space-y-3 pt-1">
              <div className="flex items-center gap-2 text-sm">
                <Badge>{route.estimatedTime}</Badge>
                <Badge variant="secondary">{route.difficulty}</Badge>
                {route.travelBuddyAvailable && <Badge className="bg-coral text-coral-foreground hover:bg-coral/90">Buddy available</Badge>}
              </div>
              <ol className="space-y-1.5">
                {route.steps.map((s, i) => (
                  <li key={i} className="text-sm flex gap-2">
                    <span className="text-primary font-bold">{i + 1}.</span> {s}
                  </li>
                ))}
              </ol>
              {route.phrases.map((p, i) => <PhraseCard key={i} {...p} />)}
              <div className="text-xs text-muted-foreground">{route.notes}</div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline"
                  onClick={() => add({ refId: route.id, type: "route", title: `${route.from} → ${route.to}`, meta: route.estimatedTime, href: "/move" })}>
                  Add to plan
                </Button>
                {route.travelBuddyAvailable && (
                  <Button size="sm" className="gap-1.5 bg-coral text-coral-foreground hover:bg-coral/90"
                    onClick={() => navigate("/buddies")}><Users className="w-3.5 h-3.5" /> Find travel buddy</Button>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="surface p-5 bg-gradient-card space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-warning/15 text-warning flex items-center justify-center"><Train className="w-4 h-4" /></div>
            <h3 className="font-display font-bold text-lg">Train ticket assistant</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="From"><input value={tFrom} onChange={e => setTFrom(e.target.value)} className="input" /></Field>
            <Field label="To"><input value={tTo} onChange={e => setTTo(e.target.value)} className="input" /></Field>
            <Field label="Date"><input type="date" value={tDate} onChange={e => setTDate(e.target.value)} className="input" /></Field>
            <Field label="Student discount?">
              <div className="flex gap-2">
                <Button type="button" size="sm" variant={tDiscount ? "default" : "outline"} onClick={() => setTDiscount(true)}>Yes</Button>
                <Button type="button" size="sm" variant={!tDiscount ? "default" : "outline"} onClick={() => setTDiscount(false)}>No</Button>
              </div>
            </Field>
          </div>
          <Button onClick={explainTicket} className="w-full">Explain how to buy ticket</Button>

          {ticket && (
            <div className="space-y-3 pt-1">
              <div className="text-sm font-semibold">Steps</div>
              <ol className="space-y-1.5">
                {ticket.steps.map((s, i) => (
                  <li key={i} className="text-sm flex gap-2">
                    <span className="text-primary font-bold">{i + 1}.</span> {s}
                  </li>
                ))}
              </ol>
              <div className="text-sm font-semibold pt-1">Vocabulary</div>
              <div className="grid grid-cols-2 gap-2">
                {TICKET_VOCAB.map(v => (
                  <div key={v.bg} className="px-3 py-2 rounded-xl border border-border bg-card text-sm flex items-center justify-between">
                    <span className="font-semibold">{v.bg}</span>
                    <span className="text-xs text-muted-foreground">{v.en}</span>
                  </div>
                ))}
              </div>
              {ticket.phrases.map((p, i) => <PhraseCard key={i} {...p} />)}
              <div className="surface p-3 bg-warning-soft border-warning/30">
                <div className="text-xs font-semibold text-warning-foreground">Travel checklist</div>
                <ul className="text-xs mt-1 list-disc list-inside text-warning-foreground/90">
                  <li>Bring passport / ID</li>
                  <li>Cash for the ticket counter</li>
                  <li>Student card if eligible</li>
                  <li>Arrive 15 minutes early</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </section>

      <section>
        <h2 className="font-display text-xl font-bold mb-3">Common routes</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {routes.map(r => (
            <div key={r.id} className="surface p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between gap-2">
                <div className="font-semibold text-sm">{r.from} <ArrowRight className="inline w-3.5 h-3.5 mx-0.5 text-muted-foreground" /> {r.to}</div>
                <Badge variant="secondary">{r.difficulty}</Badge>
              </div>
              <div className="text-xs text-muted-foreground mt-1">{r.estimatedTime}</div>
              {r.phrases[0] && <div className="mt-3 text-xs text-muted-foreground italic">"{r.phrases[0].bg}"</div>}
              <div className="flex gap-2 mt-3">
                <Button size="sm" variant="outline" onClick={() => { setFrom(r.from); setTo(r.to); setRoute(r); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
                  View
                </Button>
                <Button size="sm" variant="ghost" onClick={() => navigate("/ask")}>Ask AI</Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="surface p-5 bg-gradient-card">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h3 className="font-display font-bold text-lg">Travel buddy</h3>
            <p className="text-sm text-muted-foreground">Going somewhere? Find someone taking the same route.</p>
          </div>
          <Button className="bg-coral text-coral-foreground hover:bg-coral/90 gap-2" onClick={() => navigate("/buddies")}>
            <Users className="w-4 h-4" /> Open Buddy Finder
          </Button>
        </div>
      </section>
    </div>
  );
};

function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <Field label={label}>
      <select value={value} onChange={e => onChange(e.target.value)} className="input">
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
    </Field>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold text-muted-foreground mb-1">{label}</span>
      {children}
      <style>{`.input{width:100%;height:38px;padding:0 12px;border-radius:12px;border:1px solid hsl(var(--border));background:hsl(var(--card));font-size:14px;}`}</style>
    </label>
  );
}

export default Move;
