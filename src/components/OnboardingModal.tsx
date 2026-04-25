import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useProfile, type UserType, type Language } from "@/hooks/useProfile";
import { Logo } from "@/components/shell/Logo";
import { Sparkles, GraduationCap, Plane, MapPin, Building2 } from "lucide-react";

const types: { v: UserType; icon: typeof Sparkles; sub: string }[] = [
  { v: "Erasmus / International student", icon: GraduationCap, sub: "University, dorms, events, friends" },
  { v: "Tourist / Visitor", icon: Plane, sub: "Hidden gems, transport, phrases" },
  { v: "Local student", icon: MapPin, sub: "Events, campus, documents" },
  { v: "Local citizen", icon: Building2, sub: "Events, hidden gems, documents" },
];

const langs: Language[] = ["English", "Bulgarian", "Spanish", "Turkish", "French", "German"];

export function OnboardingModal() {
  const [profile, setProfile] = useProfile();
  const open = !profile.onboarded;
  const [step, setStep] = useState(0);
  const [draftType, setDraftType] = useState<UserType | null>(profile.userType);
  const [draftLang, setDraftLang] = useState<Language>(profile.language);

  const finish = () => {
    setProfile(p => ({
      ...p,
      onboarded: true,
      userType: draftType ?? "Other",
      language: draftLang,
    }));
  };

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden border-0 shadow-glow">
        <DialogTitle className="sr-only">Welcome to ERASMuse</DialogTitle>
        <div className="bg-gradient-hero p-6 text-primary-foreground">
          <Logo size="lg" />
          <p className="mt-2 text-sm opacity-90">
            Your AI companion for studying, living, travelling, and discovering Ruse.
          </p>
        </div>
        <div className="p-6 space-y-5">
          {step === 0 && (
            <>
              <div>
                <h3 className="text-xl font-display font-bold">Welcome to ERASMuse</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Your AI companion in Ruse. Let's set up your profile in 30 seconds.
                </p>
              </div>
              <div className="flex justify-end">
                <Button onClick={() => setStep(1)} className="bg-primary text-primary-foreground">
                  Get started
                </Button>
              </div>
            </>
          )}
          {step === 1 && (
            <>
              <div>
                <h3 className="text-xl font-display font-bold">Who are you?</h3>
                <p className="text-sm text-muted-foreground mt-1">We'll personalize what you see.</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {types.map(({ v, icon: Icon, sub }) => (
                  <button
                    key={v}
                    onClick={() => setDraftType(v)}
                    className={`text-left p-3 rounded-xl border transition-all ${
                      draftType === v
                        ? "border-primary bg-secondary shadow-soft"
                        : "border-border hover:border-primary/40"
                    }`}
                  >
                    <Icon className="w-5 h-5 text-primary mb-1.5" />
                    <div className="text-sm font-semibold leading-tight">{v}</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">{sub}</div>
                  </button>
                ))}
              </div>
              <div className="flex justify-between">
                <Button variant="ghost" onClick={() => setStep(0)}>Back</Button>
                <Button onClick={() => setStep(2)} disabled={!draftType}>Next</Button>
              </div>
            </>
          )}
          {step === 2 && (
            <>
              <div>
                <h3 className="text-xl font-display font-bold">What language do you prefer?</h3>
                <p className="text-sm text-muted-foreground mt-1">You can change it any time in the header.</p>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {langs.map(l => (
                  <button
                    key={l}
                    onClick={() => setDraftLang(l)}
                    className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                      draftLang === l
                        ? "border-accent bg-secondary"
                        : "border-border hover:border-accent/40"
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
              <div className="flex justify-between">
                <Button variant="ghost" onClick={() => setStep(1)}>Back</Button>
                <Button onClick={finish} className="bg-accent text-accent-foreground hover:bg-accent/90">
                  Let's explore Ruse →
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
