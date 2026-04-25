import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { buddies, type Buddy } from "@/data/buddies";
import { events } from "@/data/events";
import { usePlan } from "@/hooks/usePlan";
import { 
  Send, 
  Bookmark, 
  Flag, 
  Ban, 
  Users, 
  Sparkles, 
  Calendar,
  MapPin,
  Bus,
  Bell,
  BookmarkCheck,
  Trash2,
  Plus
} from "lucide-react";
import { toast } from "sonner";

const ICONS = { event: Calendar, gem: MapPin, route: Bus, reminder: Bell, buddy: Users, doc: BookmarkCheck };

const TYPE_LABELS = {
  event: "Saved events",
  gem: "Saved places",
  route: "Travel plans",
  reminder: "Important reminders",
  buddy: "Buddies",
  doc: "Documents",
} as const;

const Buddies = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { items, add, remove } = usePlan();
  
  // Get tab from URL, default to "find-buddies"
  const tabParam = searchParams.get("tab") || "find-buddies";
  const [tab, setTab] = useState(tabParam);

  // Sync tab with URL
  useEffect(() => {
    const urlTab = searchParams.get("tab") || "find-buddies";
    if (urlTab !== tab) {
      setTab(urlTab);
    }
  }, [searchParams]);

  const handleTabChange = (newTab: string) => {
    setTab(newTab);
    setSearchParams({ tab: newTab });
  };

  const eventBuddies = buddies.filter(b => b.type === "event");
  const travelBuddies = buddies.filter(b => b.type === "travel");

  // Group saved items by type
  const grouped = (Object.keys(TYPE_LABELS) as (keyof typeof TYPE_LABELS)[]).map(k => ({
    key: k,
    label: TYPE_LABELS[k],
    items: items.filter(i => i.type === k),
  })).filter(g => g.items.length > 0);

  return (
    <div className="px-4 lg:px-8 py-6 max-w-6xl mx-auto space-y-6">
      <PageHeader
        title={t("buddies.title")}
        subtitle={t("buddies.subtitle")}
      />

      {/* Tabs */}
      <Tabs value={tab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="w-full justify-start flex-wrap h-auto gap-1 bg-transparent p-0">
          <TabsTrigger 
            value="find-buddies" 
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full px-4"
          >
            <Users className="w-4 h-4 mr-2" />
            {t("buddies.tabs.findBuddies")}
          </TabsTrigger>
          <TabsTrigger 
            value="my-plan" 
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full px-4"
          >
            <Calendar className="w-4 h-4 mr-2" />
            {t("buddies.tabs.myPlan")}
            {items.length > 0 && (
              <Badge variant="secondary" className="ml-2 text-[10px]">{items.length}</Badge>
            )}
          </TabsTrigger>

        </TabsList>

        {/* Find Buddies Tab */}
        <TabsContent value="find-buddies" className="mt-6">
          <div className="space-y-6">
            <div>
              <h3 className="font-display font-semibold mb-3">{t("buddies.eventBuddies")}</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {eventBuddies.map(b => {
                  const ev = events.find(e => e.id === b.relatedEventId);
                  return (
                    <BuddyCard 
                      key={b.id} 
                      b={b} 
                      subtitle={ev ? `${ev.title} - ${ev.date}` : "Event buddy"} 
                      onAdd={() =>
                        ev && add({ refId: b.id, type: "buddy", title: `Buddy: ${b.firstName}`, meta: ev.title, href: "/buddies" })
                      } 
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* My Plan Tab */}
        <TabsContent value="my-plan" className="mt-6">
          {items.length === 0 ? (
            <div className="surface p-10 text-center bg-gradient-card">
              <BookmarkCheck className="w-12 h-12 mx-auto text-muted-foreground" />
              <p className="font-display font-semibold mt-3">{t("plan.empty")}</p>
              <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
                {t("plan.emptyDesc")}
              </p>
              <div className="flex gap-2 justify-center mt-5">
                <Button onClick={() => navigate("/explore")}>{t("plan.exploreEvents")}</Button>
                <Button variant="outline" onClick={() => navigate("/move")}>{t("plan.planTrip")}</Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {grouped.map(g => {
                const Icon = ICONS[g.key];
                return (
                  <section key={g.key}>
                    <h3 className="font-display text-lg font-bold mb-2 flex items-center gap-2">
                      <Icon className="w-4 h-4 text-primary" /> {t(`plan.categories.${g.key === "gem" ? "places" : g.key === "doc" ? "docs" : g.key + "s"}`)} 
                      <Badge variant="secondary" className="ml-1">{g.items.length}</Badge>
                    </h3>
                    <div className="space-y-2">
                      {g.items.map(i => (
                        <div key={i.id} className="surface p-4 flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <div className="font-semibold truncate">{i.title}</div>
                            {i.meta && <div className="text-xs text-muted-foreground">{i.meta}</div>}
                          </div>
                          <div className="flex gap-2 shrink-0">
                            {i.href && (
                              <Button size="sm" variant="outline" onClick={() => navigate(i.href!)}>
                                {t("plan.open")}
                              </Button>
                            )}
                            <Button size="icon" variant="ghost" onClick={() => remove(i.id)}>
                              <Trash2 className="w-4 h-4 text-muted-foreground" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* Travel Buddy Tab - removed, now just shows Find Buddies content */}
        <TabsContent value="travel-buddy" className="mt-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {travelBuddies.map(b => (
              <BuddyCard
                key={b.id}
                b={b}
                subtitle={`${b.from} - ${b.to} - ${b.date}`}
                extra={b.meetingPoint ? `${t("buddies.meetAt")} ${b.meetingPoint}` : undefined}
                onAdd={() => add({ refId: b.id, type: "buddy", title: `${b.from} - ${b.to}`, meta: b.date ?? "", href: "/buddies?tab=travel-buddy" })}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Safety Notice - moved to bottom */}
      <div className="rounded-2xl border border-accent/30 bg-secondary p-4 text-sm text-secondary-foreground mt-8">
        {t("buddies.safetyNotice")}
      </div>
    </div>
  );
};

function BuddyCard({ 
  b, 
  subtitle, 
  extra, 
  onAdd 
}: { 
  b: Buddy; 
  subtitle: string; 
  extra?: string; 
  onAdd: () => void 
}) {
  const { t } = useTranslation();
  
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
        <Badge className="bg-success text-success-foreground gap-1">
          <Sparkles className="w-3 h-3" /> {b.matchScore}%
        </Badge>
      </div>
      <div className="text-xs text-muted-foreground mt-3">{subtitle}</div>
      {extra && <div className="text-[11px] text-muted-foreground">{extra}</div>}
      <div className="flex flex-wrap gap-1 mt-2">
        {b.languages.map(l => (
          <Badge key={l} variant="secondary" className="text-[10px]">{l}</Badge>
        ))}
      </div>
      <div className="flex gap-2 mt-3">
        <Button 
          size="sm" 
          className="gap-1.5" 
          onClick={() => toast.success(t("buddies.inviteSent"))}
        >
          <Send className="w-3.5 h-3.5" /> {t("buddies.sendInvite")}
        </Button>
        <Button size="sm" variant="outline" onClick={onAdd}>
          <Bookmark className="w-3.5 h-3.5" />
        </Button>
        <Button size="sm" variant="ghost" onClick={() => toast(`${t("buddies.report")} (demo)`)}>
          <Flag className="w-3.5 h-3.5" />
        </Button>
        <Button size="sm" variant="ghost" onClick={() => toast(`${t("buddies.block")} (demo)`)}>
          <Ban className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
}

export default Buddies;