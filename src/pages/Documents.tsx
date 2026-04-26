import { useRef, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PhraseCard } from "@/components/PhraseCard";
import { sampleDocuments, type SampleDoc } from "@/data/sampleDocuments";
import {
  Upload, FileText, AlertTriangle, Copy, Languages, MessageSquare, Loader2, Sparkles, X,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAIMode } from "@/contexts/AIModeContext";

type Analysis = SampleDoc["analysis"] & { type?: string; title?: string };

const MAX_BYTES = 10 * 1024 * 1024; // 10 MB
const ACCEPTED = ".pdf,.jpg,.jpeg,.png,.webp,.txt,.md,.docx";

const Documents = () => {
  const { isLive } = useAIMode();
  const [selected, setSelected] = useState<string>(sampleDocuments[0].id);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [docTitle, setDocTitle] = useState<string>("");
  const [docType, setDocType] = useState<string>("");
  const [analyzing, setAnalyzing] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [pasted, setPasted] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    setAnalysis(null);
    setDocTitle("");
    setDocType("");
  };

  const onPickFile = (f: File | null) => {
    if (!f) return;
    if (f.size > MAX_BYTES) {
      toast.error("File too large. Max 10 MB.");
      return;
    }
    setFile(f);
    setPasted("");
    reset();
  };

  const analyzeReal = async () => {
    if (!file && !pasted.trim()) {
      toast.error("Choose a file or paste document text first.");
      return;
    }
    
    setAnalyzing(true);
    reset();
    try {
      let payload: { text?: string; fileBase64?: string; mimeType?: string; fileName?: string };
      
      if (file) {
        const isText = file.type.startsWith("text/") || /\.(txt|md)$/i.test(file.name);
        if (isText) {
          // For text files, read content directly
          const textContent = await file.text();
          payload = { text: textContent, fileName: file.name };
        } else {
          // For PDF/images, convert to base64
          const base64 = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
              const result = reader.result as string;
              // Remove data URL prefix
              const base64Data = result.split(',')[1] || result;
              resolve(base64Data);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
          payload = { 
            fileBase64: base64, 
            mimeType: file.type || "application/pdf", 
            fileName: file.name 
          };
        }
      } else {
        payload = { text: pasted };
      }

      // Call the Supabase edge function which uses Gemini for proper multimodal support
      const { data, error } = await supabase.functions.invoke("analyze-document", {
        body: payload,
      });

      if (error) {
        throw new Error(error.message || "Failed to analyze document");
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      const result = data?.analysis;
      if (!result) {
        throw new Error("No analysis returned from AI");
      }

      setAnalysis(result);
      setDocTitle(result.title || file?.name || "Your document");
      setDocType(result.type || "Document");
      toast.success("Document analyzed with AI");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to analyze document.";
      if (msg.includes("429")) toast.error("AI is rate-limited. Try again in a moment.");
      else if (msg.includes("402")) toast.error("AI quota exceeded. Please try again later.");
      else toast.error(msg);
    } finally {
      setAnalyzing(false);
    }
  };

  const analyzeSample = () => {
    setAnalyzing(true);
    setFile(null);
    setPasted("");
    setTimeout(() => {
      const d = sampleDocuments.find(x => x.id === selected);
      if (d) {
        setAnalysis(d.analysis);
        setDocTitle(d.title);
        setDocType(d.type);
      }
      setAnalyzing(false);
    }, 400);
  };

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard ✓");
  };

  const startNewScan = () => {
    setFile(null);
    setPasted("");
    reset();
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="px-4 lg:px-8 py-6 max-w-5xl mx-auto space-y-8">
      <PageHeader
        title="Document Analyzer"
        subtitle="Upload any document in Bulgarian or another language — I'll explain it simply."
      >
        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-card border border-border text-xs font-medium">
          <span className={`w-2 h-2 rounded-full ${isLive ? "bg-green-500 animate-pulse" : "bg-muted-foreground"}`} />
          {isLive ? "Live AI" : "Demo mode"}
        </span>
      </PageHeader>

      <div className="rounded-2xl border border-primary/20 p-4 text-sm text-foreground/80 bg-primary/5 flex items-start gap-3">
        <span className="text-primary text-lg leading-none">&#9432;</span>
        <span>
          <strong className="text-foreground">Not legal advice.</strong> This tool helps you understand documents, spot key points, and prepare questions to ask.
        </span>
      </div>

      {/* Hidden file input - always present for reference */}
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED}
        className="hidden"
        onChange={(e) => onPickFile(e.target.files?.[0] ?? null)}
      />

      {/* Upload zone - hidden when analysis is ready */}
      {!analysis && (
        <>
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault(); setDragOver(false);
              const f = e.dataTransfer.files?.[0];
              if (f) onPickFile(f);
            }}
            className={`surface p-6 bg-gradient-card border-dashed border-2 text-center transition-colors ${
              dragOver ? "border-primary bg-primary/5" : ""
            }`}
          >
            <Upload className="w-8 h-8 mx-auto text-muted-foreground" />
            <p className="mt-2 font-semibold">Drop your document here or choose a file</p>
            <p className="text-xs text-muted-foreground mt-1">
              Accepted: PDF, JPG, PNG, WEBP, TXT, MD, DOCX · Max 10 MB
            </p>
            <div className="mt-3 flex flex-wrap gap-2 justify-center">
              <Button variant="outline" onClick={() => inputRef.current?.click()}>
                Choose file
              </Button>
              {file && (
                <span className="inline-flex items-center gap-2 px-3 h-9 rounded-xl border border-border bg-card text-sm">
                  <FileText className="w-3.5 h-3.5" />
                  <span className="truncate max-w-[200px]">{file.name}</span>
                  <button
                    onClick={() => { setFile(null); reset(); if (inputRef.current) inputRef.current.value = ""; }}
                    className="text-muted-foreground hover:text-foreground"
                    aria-label="Remove file"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              )}
            </div>

            {/* Paste fallback */}
            <div className="mt-5 text-left">
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Or paste document text
              </label>
              <textarea
                value={pasted}
                onChange={(e) => { setPasted(e.target.value); if (e.target.value) setFile(null); }}
                placeholder="Paste a contract clause, a letter, or any document text in any language…"
                rows={4}
                className="w-full rounded-xl border border-border bg-card text-sm p-3 outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            <div className="mt-4 flex justify-center">
              <Button
                onClick={analyzeReal}
                disabled={analyzing || (!file && !pasted.trim())}
                size="lg"
                className="gap-2"
              >
                {analyzing
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing…</>
                  : <><Sparkles className="w-4 h-4" /> Analyze with AI</>}
              </Button>
            </div>
          </div>

          {/* Sample fallback */}
          <div className="surface p-5">
            <div className="text-xs font-semibold text-muted-foreground uppercase mb-2">Or try a sample</div>
            <div className="flex flex-col sm:flex-row gap-3 sm:items-end">
              <label className="flex-1">
                <span className="block text-xs font-semibold text-muted-foreground mb-1">Sample document</span>
                <select
                  value={selected}
                  onChange={e => setSelected(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-border bg-card text-sm"
                >
                  {sampleDocuments.map(d => <option key={d.id} value={d.id}>{d.title}</option>)}
                </select>
              </label>
              <Button variant="outline" onClick={analyzeSample} disabled={analyzing} className="gap-2">
                <FileText className="w-4 h-4" /> Load sample
              </Button>
            </div>
          </div>
        </>
      )}

      {analysis && (
        <div className="space-y-4 animate-fade-up">
          {/* New Document button - centered and larger */}
          <div className="flex justify-center">
            <Button 
              variant="outline" 
              onClick={startNewScan} 
              className="gap-2 px-8 py-6 text-base h-auto"
            >
              <Upload className="w-5 h-5" /> New Document
            </Button>
          </div>

          {/* Document info */}
          <div className="flex items-center gap-2 flex-wrap justify-center">
            {docType && <Badge variant="secondary">{docType}</Badge>}
            {docTitle && <span className="text-sm font-medium text-muted-foreground">{docTitle}</span>}
          </div>

          <div className="surface p-5 bg-gradient-card">
            <h3 className="font-display font-bold text-lg">Simple explanation</h3>
            <p className="text-sm mt-2">{analysis.simpleExplanation}</p>
          </div>

          {analysis.keyDetails?.length > 0 && (
            <div className="surface p-5">
              <h3 className="font-display font-bold text-lg mb-3">Key details</h3>
              <div className="grid sm:grid-cols-2 gap-2">
                {analysis.keyDetails.map((k, i) => (
                  <div key={`${k.label}-${i}`} className="flex items-start justify-between gap-2 px-3 py-2 rounded-xl border border-border">
                    <span className="text-xs text-muted-foreground">{k.label}</span>
                    <span className="text-sm font-medium text-right">{k.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {analysis.riskFlags?.length > 0 && (
            <div className="surface p-5 border-warning/40 bg-warning-soft">
              <h3 className="font-display font-bold text-lg flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-warning" /> Risk flags
              </h3>
              <div className="mt-3 space-y-2">
                {analysis.riskFlags.map((r, i) => (
                  <details key={`${r.title}-${i}`} className="rounded-xl border border-warning/30 bg-card px-3 py-2">
                    <summary className="cursor-pointer text-sm font-semibold">{r.title}</summary>
                    <p className="text-sm text-muted-foreground mt-1.5">{r.detail}</p>
                  </details>
                ))}
              </div>
            </div>
          )}

          {analysis.questionsToAsk?.length > 0 && (
            <div className="surface p-5">
              <h3 className="font-display font-bold text-lg mb-3">Questions to ask</h3>
              <div className="space-y-2">
                {analysis.questionsToAsk.map((q, i) => (
                  <div key={i} className="flex items-start gap-2 px-3 py-2 rounded-xl border border-border">
                    <span className="text-sm flex-1">{q}</span>
                    <Button size="sm" variant="ghost" onClick={() => copy(q)} className="gap-1.5">
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {analysis.bgSummary && (
            <div className="surface p-5 bg-gradient-card">
              <h3 className="font-display font-bold text-lg flex items-center gap-2">
                <Languages className="w-4 h-4 text-accent" /> Translated summary (Bulgarian)
              </h3>
              <p className="text-sm mt-2">{analysis.bgSummary}</p>
              <Button size="sm" variant="outline" className="mt-3 gap-1.5" onClick={() => copy(analysis.bgSummary)}>
                <Copy className="w-3.5 h-3.5" /> Copy
              </Button>
            </div>
          )}

          {(analysis.enMessage || analysis.bgMessage) && (
            <div className="surface p-5">
              <h3 className="font-display font-bold text-lg flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-primary" /> Generate message
              </h3>
              <div className="grid md:grid-cols-2 gap-3 mt-3">
                {analysis.enMessage && (
                  <div className="rounded-xl border border-border p-3">
                    <div className="text-xs font-semibold text-muted-foreground mb-1">English</div>
                    <p className="text-sm">{analysis.enMessage}</p>
                    <Button size="sm" variant="outline" className="mt-2 gap-1.5" onClick={() => copy(analysis.enMessage)}>
                      <Copy className="w-3.5 h-3.5" /> Copy
                    </Button>
                  </div>
                )}
                {analysis.bgMessage && (
                  <div className="rounded-xl border border-border p-3">
                    <div className="text-xs font-semibold text-muted-foreground mb-1">Bulgarian</div>
                    <p className="text-sm">{analysis.bgMessage}</p>
                    <Button size="sm" variant="outline" className="mt-2 gap-1.5" onClick={() => copy(analysis.bgMessage)}>
                      <Copy className="w-3.5 h-3.5" /> Copy
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}

          <PhraseCard bg="Може ли да обясните този член?" en="Could you explain this clause?" />
        </div>
      )}
    </div>
  );
};

export default Documents;
