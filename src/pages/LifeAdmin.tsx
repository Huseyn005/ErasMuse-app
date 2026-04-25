import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PhraseCard } from "@/components/PhraseCard";
import { lifeAdmin, type Scenario } from "@/data/lifeAdmin";
import { AlertTriangle, Phone, ChevronDown } from "lucide-react";

const EMERGENCY_PHRASES = [
  { bg: "Имам нужда от помощ.", en: "I need help." },
  { bg: "Извикайте линейка.", en: "Call an ambulance." },
  { bg: "Изгубих се.", en: "I am lost." },
  { bg: "Не говоря български.", en: "I do not speak Bulgarian." },
];

const MEDICAL_OPTIONS = [
  { id: "m1", label: "Emergency", text: "Call 112 immediately. Stay where you are if safe." },
  { id: "m2", label: "I feel sick (not urgent)", text: "Visit a clinic. Bring insurance. Use simple words: 'Имам нужда от лекар.'" },
  { id: "m3", label: "Pharmacy", text: "Find an Аптека (green cross). Describe symptom; ask for English instructions." },
  { id: "m4", label: "I need a doctor", text: "Visit a GP, bring ID and insurance. Ask for a prescription if needed." },
  { id: "m5", label: "I have a medical document", text: "Use Document Decoder for a plain explanation." },
  { id: "m6", label: "I need translation help", text: "Open ERASMuse Document Decoder or ask the international office." },
];

const LifeAdmin = () => {
  const [showPhrases, setShowPhrases] = useState(false);
  const [openScenario, setOpenScenario] = useState<string | null>(null);
  const [medical, setMedical] = useState<string | null>(null);

  return (
    <div className="px-4 lg:px-8 py-6 max-w-5xl mx-auto space-y-8">
      <PageHeader
        title="Life Admin & Health"
        subtitle="Documents, local services, emergency guidance, and healthcare navigation."
      />

      <div className="rounded-2xl border border-warning/40 bg-warning-soft p-3 text-xs text-warning-foreground">
        ⚠️ For emergencies in Bulgaria, call 112. This app does not replace medical, legal, or official advice.
      </div>

      {/* Emergency card */}
      <section className="surface p-5 border-destructive/40 bg-destructive-soft">
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-xl bg-destructive text-destructive-foreground flex items-center justify-center shrink-0">
            <Phone className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h3 className="font-display font-bold text-lg text-destructive">Emergency</h3>
            <p className="text-sm mt-1">
              If there is immediate danger, serious injury, fire, crime, or urgent medical emergency, call <span className="font-bold">112</span>.
            </p>
            <Button variant="outline" size="sm" className="mt-3 border-destructive/40"
              onClick={() => setShowPhrases(s => !s)}>
              {showPhrases ? "Hide" : "Show"} emergency phrases
            </Button>
            {showPhrases && (
              <div className="mt-3 space-y-2 animate-fade-up">
                {EMERGENCY_PHRASES.map((p, i) => <PhraseCard key={i} {...p} />)}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Medical decision helper */}
      <section className="surface p-5 bg-gradient-card">
        <h3 className="font-display font-bold text-lg">Medical care decision helper</h3>
        <p className="text-sm text-muted-foreground mt-1">What do you need?</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2 mt-3">
          {MEDICAL_OPTIONS.map(o => (
            <button key={o.id}
              onClick={() => setMedical(medical === o.id ? null : o.id)}
              className={`text-left px-3 py-3 rounded-xl border text-sm transition-all ${
                medical === o.id ? "border-primary bg-secondary" : "border-border bg-card hover:border-primary/40"
              }`}>
              <div className="font-semibold">{o.label}</div>
              {medical === o.id && <p className="text-xs text-muted-foreground mt-2">{o.text}</p>}
            </button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          ERASMuse is not a doctor. ERASMuse is not a lawyer. It does not replace official advice.
        </p>
      </section>

      {/* Government / scenarios */}
      <section>
        <h2 className="font-display text-xl font-bold mb-3">Common scenarios</h2>
        <div className="space-y-3">
          {lifeAdmin.map(s => (
            <ScenarioRow key={s.id} s={s} open={openScenario === s.id} onToggle={() => setOpenScenario(openScenario === s.id ? null : s.id)} />
          ))}
        </div>
      </section>
    </div>
  );
};

function ScenarioRow({ s, open, onToggle }: { s: Scenario; open: boolean; onToggle: () => void }) {
  return (
    <div className="surface p-4">
      <button onClick={onToggle} className="w-full flex items-center justify-between gap-3 text-left">
        <div>
          <div className="font-semibold">{s.title}</div>
          <Badge variant="secondary" className="text-[10px] mt-1 capitalize">{s.category}</Badge>
        </div>
        <ChevronDown className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="mt-3 space-y-3 animate-fade-up">
          <ol className="space-y-1.5">
            {s.steps.map((st, i) => (
              <li key={i} className="text-sm flex gap-2">
                <span className="text-primary font-bold">{i + 1}.</span> {st}
              </li>
            ))}
          </ol>
          {s.warning && (
            <div className="rounded-xl border border-warning/40 bg-warning-soft p-3 text-sm flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
              <span>{s.warning}</span>
            </div>
          )}
          {s.phrases.map((p, i) => <PhraseCard key={i} {...p} />)}
        </div>
      )}
    </div>
  );
}

export default LifeAdmin;
