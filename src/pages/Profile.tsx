import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useProfile, type UserType, type Language } from "@/hooks/useProfile";
import { useTheme } from "@/hooks/useTheme";
import { toast } from "sonner";

const TYPES: UserType[] = ["Erasmus / International student", "Tourist / Visitor", "Local student", "Local citizen", "Other"];
const LANGS: Language[] = ["English", "Bulgarian", "Spanish", "Turkish", "French", "German"];
const INTERESTS = ["Music", "Culture", "Food", "Sports", "Nightlife", "Nature", "Study", "Tech", "Volunteering", "Travel"];
const BUDGETS = ["Free", "Low", "Medium", "Flexible"] as const;
const SOCIAL = ["I like going alone", "I want to meet people", "I prefer small groups", "I am open to event buddies"];
const BUDDY = ["I prefer going alone", "I am open to event buddies", "I am open to travel buddies", "Small groups only"];
const STARTS = ["Use my location", "University of Ruse", "Student dorms", "City Center", "Railway Station", "Danube area"];
const TRANSPORT = ["Beginner", "Getting there", "Comfortable"] as const;

const Profile = () => {
  const { t } = useTranslation();
  const [profile, setProfile] = useProfile();
  const { mode, setMode } = useTheme();

  const toggleInterest = (i: string) =>
    setProfile(p => ({ ...p, interests: p.interests.includes(i) ? p.interests.filter(x => x !== i) : [...p.interests, i] }));

  return (
    <div className="px-4 lg:px-8 py-6 max-w-3xl mx-auto space-y-6">
      <PageHeader title={t('profile.title')} subtitle={t('profile.subtitle')} />

      <Section title={t('profile.userType')}>
        <Pills values={TYPES} active={profile.userType ?? ""} onPick={(v) => setProfile(p => ({ ...p, userType: v as UserType }))} />
      </Section>

      <Section title={t('profile.language')}>
        <Pills values={LANGS} active={profile.language} onPick={(v) => setProfile(p => ({ ...p, language: v as Language }))} />
      </Section>

      <Section title={t('profile.interests')}>
        <div className="flex flex-wrap gap-2">
          {INTERESTS.map(i => (
            <button key={i} onClick={() => toggleInterest(i)}
              className={`chip ${profile.interests.includes(i) ? "chip-active bg-accent text-accent-foreground border-accent" : ""}`}>
              {i}
            </button>
          ))}
        </div>
      </Section>

      <Section title={t('profile.budget')}>
        <Pills values={[...BUDGETS]} active={profile.budget} onPick={(v) => setProfile(p => ({ ...p, budget: v as typeof BUDGETS[number] }))} />
      </Section>

      <Section title={t('profile.socialPreference')}>
        <Pills values={SOCIAL} active={profile.social} onPick={(v) => setProfile(p => ({ ...p, social: v }))} />
      </Section>

      <Section title={t('profile.buddyPreference')}>
        <Pills values={BUDDY} active={profile.buddyPref} onPick={(v) => setProfile(p => ({ ...p, buddyPref: v }))} />
      </Section>

      <Section title={t('profile.mapStartingPoint')}>
        <Pills values={STARTS} active={profile.startPoint} onPick={(v) => setProfile(p => ({ ...p, startPoint: v }))} />
      </Section>

      <Section title={t('profile.transportConfidence')}>
        <Pills values={[...TRANSPORT]} active={profile.transportConfidence} onPick={(v) => setProfile(p => ({ ...p, transportConfidence: v as typeof TRANSPORT[number] }))} />
      </Section>

      <Section title={t('profile.theme')}>
        <Pills values={["light", "dark", "system"]} active={mode} onPick={(v) => setMode(v as "light" | "dark" | "system")} />
      </Section>

      <div className="sticky bottom-20 lg:bottom-4 flex justify-end">
        <Button size="lg" className="shadow-glow"
          onClick={() => toast.success(t('profile.saved'))}>
          {t('profile.savePreferences')}
        </Button>
      </div>

      {profile.interests.length > 0 && (
        <div className="text-xs text-muted-foreground">
          Selected interests: {profile.interests.map(i => <Badge key={i} variant="secondary" className="ml-1">{i}</Badge>)}
        </div>
      )}
    </div>
  );
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="surface p-5 bg-gradient-card">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">{title}</h3>
      {children}
    </div>
  );
}

function Pills({ values, active, onPick }: { values: string[]; active: string; onPick: (v: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {values.map(v => (
        <button key={v} onClick={() => onPick(v)}
          className={`chip capitalize ${active === v ? "chip-active bg-primary text-primary-foreground border-primary" : ""}`}>
          {v}
        </button>
      ))}
    </div>
  );
}

export default Profile;
