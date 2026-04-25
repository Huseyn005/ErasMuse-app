import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "sonner";

export function PhraseCard({ bg, en }: { bg: string; en: string }) {
  const copy = () => {
    navigator.clipboard.writeText(bg);
    toast.success("Copied to clipboard ✓");
  };
  return (
    <div className="surface p-4 flex items-start justify-between gap-3 bg-gradient-card">
      <div>
        <div className="text-sm font-semibold">{bg}</div>
        <div className="text-xs text-muted-foreground mt-0.5">{en}</div>
      </div>
      <Button variant="outline" size="sm" onClick={copy} className="shrink-0 gap-1.5">
        <Copy className="w-3.5 h-3.5" /> Copy
      </Button>
    </div>
  );
}
