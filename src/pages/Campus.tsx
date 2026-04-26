import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { usePlan } from "@/hooks/usePlan";
import { Check, Sparkles, MapPin, Book, Home, UtensilsCrossed, Dumbbell, Users } from "lucide-react";

const FACILITY_CARDS = [
  {
    id: "campus-map",
    image: "/images/campus-map.jpg",
    icon: MapPin,
    titleKey: "campus.campusMap",
    descKey: "campus.campusMapDesc",
  },
  {
    id: "library",
    image: "/images/library.jpg",
    icon: Book,
    titleKey: "campus.library",
    descKey: "campus.libraryDesc",
  },
  {
    id: "dormitories",
    image: "/images/dormitories.jpg",
    icon: Home,
    titleKey: "campus.dormitories",
    descKey: "campus.dormitoriesDesc",
  },
  {
    id: "cafeteria",
    image: "/images/cafeteria.jpg",
    icon: UtensilsCrossed,
    titleKey: "campus.cafeteria",
    descKey: "campus.cafeteriaDesc",
  },
  {
    id: "sports-center",
    image: "/images/sports-center.jpg",
    icon: Dumbbell,
    titleKey: "campus.sportsCenter",
    descKey: "campus.sportsCenterDesc",
  },
  {
    id: "student-services",
    image: "/images/student-services.jpg",
    icon: Users,
    titleKey: "campus.studentServices",
    descKey: "campus.studentServicesDesc",
  },
];

const ANNOUNCEMENTS = [
  { id: "an1", title: "Hackathon kickoff weekend", when: "Sat 10:00", where: "Main building", who: "All students", why: "Build, network, win prizes" },
  { id: "an2", title: "Erasmus welcome meeting", when: "Mon 18:00", where: "International office", who: "New Erasmus students", why: "Meet your buddies & coordinator" },
  { id: "an3", title: "Cultural night", when: "Fri 19:00", where: "Cafeteria", who: "Everyone", why: "Food, music & friendships" },
  { id: "an4", title: "University sports day", when: "Sun 11:00", where: "Sports hall", who: "All students", why: "Casual games + prizes" },
  { id: "an5", title: "Student club fair", when: "Tue 12:00", where: "Main entrance", who: "Everyone", why: "Find your community" },
];

const Campus = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { add } = usePlan();
  const [done, setDone] = useLocalStorage<string[]>("erasmuse:checklist", []);
  const [open, setOpen] = useState<string | null>(null);
  const [added, setAdded] = useState<string[]>([]);

  const checklistItems = [
    t("campus.checklistItems.accommodation"),
    t("campus.checklistItems.office"),
    t("campus.checklistItems.schedule"),
    t("campus.checklistItems.transport"),
    t("campus.checklistItems.channels"),
    t("campus.checklistItems.emergency"),
    t("campus.checklistItems.healthcare"),
    t("campus.checklistItems.explore"),
    t("campus.checklistItems.contacts"),
  ];

  const toggle = (item: string) =>
    setDone(d => d.includes(item) ? d.filter(x => x !== item) : [...d, item]);

  return (
    <div className="px-4 lg:px-8 py-6 max-w-6xl mx-auto space-y-10">


      {/* Facility Image Cards Grid */}
      <section>
        <h2 className="font-display text-3xl font-bold mb-6 text-center">{t("campus.facilities")}</h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FACILITY_CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                className="group relative overflow-hidden rounded-2xl cursor-pointer"
                onClick={() => navigate("/ask")}
              >
                {/* Image */}
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={card.image}
                    alt={t(card.titleKey)}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="font-display font-bold text-white text-lg">{t(card.titleKey)}</h3>
                  </div>
                  <p className="text-white/80 text-sm">{t(card.descKey)}</p>
                </div>

                {/* Hover Button */}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button size="sm" variant="secondary" className="gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> {t("campus.askAI")}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* First-week Checklist */}
      <section className="surface p-5 bg-gradient-card">
        <div className="mb-4">
          <h2 className="font-display text-2xl font-bold">{t("campus.checklist")}</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-2">
          {checklistItems.map(item => {
            const isDone = done.includes(item);
            return (
              <label
                key={item}
                className="flex items-center gap-3 p-3 rounded-xl border border-border bg-background cursor-pointer hover:border-primary/40 transition-colors"
              >
                <span className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${isDone ? "bg-success border-success text-success-foreground" : "border-border"
                  }`}>
                  {isDone && <Check className="w-3.5 h-3.5" />}
                </span>
                <span className={`text-sm ${isDone ? "line-through text-muted-foreground" : ""}`}>{item}</span>
                <input
                  type="checkbox"
                  checked={isDone}
                  onChange={() => toggle(item)}
                  className="sr-only"
                />
              </label>
            );
          })}
        </div>
        <div className="text-xs text-muted-foreground mt-3">
          {t("campus.checklistSaved")}
        </div>
      </section>

      {/* Announcements */}
      <section>
        <h2 className="font-display text-3xl font-bold mb-3">{t("campus.announcements")}</h2>
        <div className="space-y-3">
          {ANNOUNCEMENTS.map(a => (
            <div key={a.id} className="surface p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-semibold">{a.title}</div>
                  <div className="text-xs text-muted-foreground">{a.when} - {a.where}</div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setOpen(open === a.id ? null : a.id)}
                  >
                    {open === a.id ? t("campus.hideSummary") : t("campus.summarize")}
                  </Button>
                  <Button
                    size="sm"
                    variant={added.includes(a.id) ? "outline" : "default"}
                    onClick={() => {
                        add({ refId: a.id, type: "reminder", title: a.title, meta: `${a.when} - ${a.where}`, href: "/campus" });
                        setAdded(prev => [...prev, a.id]);
                    }}
                  >
                      {added.includes(a.id) ? "Added ✔" : t("campus.addToPlan")}
                  </Button>
                </div>
              </div>
              {open === a.id && (
                <div className="mt-3 grid sm:grid-cols-2 gap-2 text-sm animate-fade-up">
                  <Bullet label={t("campus.what")} value={a.title} />
                  <Bullet label={t("campus.when")} value={a.when} />
                  <Bullet label={t("campus.where")} value={a.where} />
                  <Bullet label={t("campus.who")} value={a.who} />
                  <Bullet label={t("campus.why")} value={a.why} />
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