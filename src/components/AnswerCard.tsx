import type { AssistantAnswer } from "@/lib/mockAssistant";
import { PhraseCard } from "./PhraseCard";
import { AlertTriangle, ThumbsUp, ThumbsDown, Info } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";

export function AnswerCard({ answer, onAction }: { answer: AssistantAnswer; onAction?: (a: string) => void }) {
  return (
    <div className="space-y-3 animate-fade-up">
      <div className="surface p-5 bg-gradient-card">
        <h3 className="text-lg font-display font-bold">{answer.title}</h3>
        <p className="text-sm text-muted-foreground mt-1.5">{answer.summary}</p>
      </div>

      {answer.steps.length > 0 && (
        <div className="surface p-5">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Steps</div>
          <ol className="space-y-2">
            {answer.steps.map((s, i) => (
              <li key={i} className="flex gap-3 text-sm">
                <span className="shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                <span>{s}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {answer.phrases.length > 0 && (
        <div className="space-y-2">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-1">Bulgarian phrases</div>
          {answer.phrases.map((p, i) => <PhraseCard key={i} {...p} />)}
        </div>
      )}

      {answer.warnings.length > 0 && (
        <div className="rounded-2xl border border-warning/40 bg-warning-soft p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-warning-foreground">
            <AlertTriangle className="w-4 h-4" /> Heads up
          </div>
          <ul className="mt-2 space-y-1 text-sm text-warning-foreground/90 list-disc list-inside">
            {answer.warnings.map((w, i) => <li key={i}>{w}</li>)}
          </ul>
        </div>
      )}

      <div className="flex items-start gap-2 text-xs text-muted-foreground px-1">
        <Info className="w-3.5 h-3.5 mt-0.5" />
        <span>Based on local demo data · Check official sources for important decisions · For emergencies call 112.</span>
      </div>

      {answer.nextActions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {answer.nextActions.map((a, i) => (
            <button
              key={i}
              onClick={() => onAction?.(a)}
              className="chip hover:chip-active hover:bg-primary hover:text-primary-foreground hover:border-primary"
            >
              {a}
            </button>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2 pt-1">
        <span className="text-xs text-muted-foreground mr-1">Helpful?</span>
        <Button size="sm" variant="outline" className="h-8 gap-1.5"
          onClick={() => toast.success("Thanks for the feedback! ✓")}>
          <ThumbsUp className="w-3.5 h-3.5" />
        </Button>
        <Button size="sm" variant="outline" className="h-8 gap-1.5"
          onClick={() => toast.success("Thanks for the feedback! ✓")}>
          <ThumbsDown className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
}
