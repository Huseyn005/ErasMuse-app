import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PhraseCard } from "@/components/PhraseCard";
import { sampleDocuments, type SampleDoc } from "@/data/sampleDocuments";
import { Upload, FileText, AlertTriangle, Copy, Languages, MessageSquare } from "lucide-react";
import { toast } from "sonner";

const Documents = () => {
  const [selected, setSelected] = useState<string>(sampleDocuments[0].id);
  const [doc, setDoc] = useState<SampleDoc | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  const analyze = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setDoc(sampleDocuments.find(d => d.id === selected) ?? null);
      setAnalyzing(false);
    }, 700);
  };

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard ✓");
  };

  return (
    <div className="px-4 lg:px-8 py-6 max-w-5xl mx-auto space-y-8">
      <PageHeader
        title="Document Decoder"
        subtitle="Upload a contract, university letter, official paper, or Bulgarian text. We explain it in simple language."
      />

      <div className="rounded-2xl border border-border p-3 text-xs text-muted-foreground bg-secondary">
        ⚖️ This tool does not replace legal advice. It helps you understand the document, identify important points, and prepare questions.
      </div>

      <div className="surface p-6 bg-gradient-card border-dashed border-2 text-center">
        <Upload className="w-8 h-8 mx-auto text-muted-foreground" />
        <p className="mt-2 font-semibold">Drop your document here or choose a file</p>
        <p className="text-xs text-muted-foreground mt-1">Accepted: PDF, JPG, PNG, TXT, DOCX</p>
        <Button variant="outline" className="mt-3" onClick={() => toast("Demo mode — try a sample below.")}>
          Choose file
        </Button>
      </div>

      <div className="surface p-5">
        <div className="text-xs font-semibold text-muted-foreground uppercase mb-2">Or try a sample</div>
        <div className="flex flex-col sm:flex-row gap-3 sm:items-end">
          <label className="flex-1">
            <span className="block text-xs font-semibold text-muted-foreground mb-1">Sample document</span>
            <select value={selected} onChange={e => setSelected(e.target.value)} className="w-full h-10 px-3 rounded-xl border border-border bg-card text-sm">
              {sampleDocuments.map(d => <option key={d.id} value={d.id}>{d.title}</option>)}
            </select>
          </label>
          <Button onClick={analyze} disabled={analyzing} className="gap-2">
            <FileText className="w-4 h-4" /> {analyzing ? "Analysing…" : "Analyze document"}
          </Button>
        </div>
      </div>

      {doc && (
        <div className="space-y-4 animate-fade-up">
          <Badge variant="secondary">{doc.type}</Badge>

          <div className="surface p-5 bg-gradient-card">
            <h3 className="font-display font-bold text-lg">Simple explanation</h3>
            <p className="text-sm mt-2">{doc.analysis.simpleExplanation}</p>
          </div>

          <div className="surface p-5">
            <h3 className="font-display font-bold text-lg mb-3">Key details</h3>
            <div className="grid sm:grid-cols-2 gap-2">
              {doc.analysis.keyDetails.map(k => (
                <div key={k.label} className="flex items-start justify-between gap-2 px-3 py-2 rounded-xl border border-border">
                  <span className="text-xs text-muted-foreground">{k.label}</span>
                  <span className="text-sm font-medium text-right">{k.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="surface p-5 border-warning/40 bg-warning-soft">
            <h3 className="font-display font-bold text-lg flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-warning" /> Risk flags
            </h3>
            <div className="mt-3 space-y-2">
              {doc.analysis.riskFlags.map(r => (
                <details key={r.title} className="rounded-xl border border-warning/30 bg-card px-3 py-2">
                  <summary className="cursor-pointer text-sm font-semibold">{r.title}</summary>
                  <p className="text-sm text-muted-foreground mt-1.5">{r.detail}</p>
                </details>
              ))}
            </div>
          </div>

          <div className="surface p-5">
            <h3 className="font-display font-bold text-lg mb-3">Questions to ask</h3>
            <div className="space-y-2">
              {doc.analysis.questionsToAsk.map((q, i) => (
                <div key={i} className="flex items-start gap-2 px-3 py-2 rounded-xl border border-border">
                  <span className="text-sm flex-1">{q}</span>
                  <Button size="sm" variant="ghost" onClick={() => copy(q)} className="gap-1.5"><Copy className="w-3 h-3" /></Button>
                </div>
              ))}
            </div>
          </div>

          <div className="surface p-5 bg-gradient-card">
            <h3 className="font-display font-bold text-lg flex items-center gap-2">
              <Languages className="w-4 h-4 text-accent" /> Translated summary (Bulgarian)
            </h3>
            <p className="text-sm mt-2">{doc.analysis.bgSummary}</p>
            <Button size="sm" variant="outline" className="mt-3 gap-1.5" onClick={() => copy(doc.analysis.bgSummary)}>
              <Copy className="w-3.5 h-3.5" /> Copy
            </Button>
          </div>

          <div className="surface p-5">
            <h3 className="font-display font-bold text-lg flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-primary" /> Generate message
            </h3>
            <div className="grid md:grid-cols-2 gap-3 mt-3">
              <div className="rounded-xl border border-border p-3">
                <div className="text-xs font-semibold text-muted-foreground mb-1">English</div>
                <p className="text-sm">{doc.analysis.enMessage}</p>
                <Button size="sm" variant="outline" className="mt-2 gap-1.5" onClick={() => copy(doc.analysis.enMessage)}>
                  <Copy className="w-3.5 h-3.5" /> Copy
                </Button>
              </div>
              <div className="rounded-xl border border-border p-3">
                <div className="text-xs font-semibold text-muted-foreground mb-1">Bulgarian</div>
                <p className="text-sm">{doc.analysis.bgMessage}</p>
                <Button size="sm" variant="outline" className="mt-2 gap-1.5" onClick={() => copy(doc.analysis.bgMessage)}>
                  <Copy className="w-3.5 h-3.5" /> Copy
                </Button>
              </div>
            </div>
          </div>

          <PhraseCard bg="Може ли да обясните този член?" en="Could you explain this clause?" />
        </div>
      )}
    </div>
  );
};

export default Documents;
