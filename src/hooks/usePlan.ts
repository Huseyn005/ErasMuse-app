import { useLocalStorage } from "./useLocalStorage";
import { toast } from "sonner";

export type PlanItem = {
  id: string;        // stable saved id
  refId: string;     // original entity id
  type: "event" | "gem" | "route" | "reminder" | "buddy" | "doc";
  title: string;
  meta?: string;
  href?: string;
  addedAt: number;
};

export function usePlan() {
  const [items, setItems] = useLocalStorage<PlanItem[]>("erasmuse:plan", []);

  const add = (item: Omit<PlanItem, "addedAt" | "id">) => {
    setItems(prev => {
      if (prev.some(p => p.refId === item.refId && p.type === item.type)) {
        toast("Already in your plan");
        return prev;
      }
      toast.success("Added to plan ✓");
      return [...prev, { ...item, id: `${item.type}-${item.refId}-${Date.now()}`, addedAt: Date.now() }];
    });
  };

  const remove = (id: string) => {
    setItems(prev => prev.filter(p => p.id !== id));
    toast("Removed from plan");
  };

  const has = (type: PlanItem["type"], refId: string) =>
    items.some(p => p.type === type && p.refId === refId);

  return { items, add, remove, has };
}
