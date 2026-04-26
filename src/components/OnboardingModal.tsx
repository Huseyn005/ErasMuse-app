import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useProfile, type UserType, type Language } from '@/hooks/useProfile';
import { Logo } from '@/components/shell/Logo';
import { Sparkles, GraduationCap, Plane, MapPin, Building2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const types: { v: UserType; icon: typeof Sparkles; sub: string }[] = [
    { v: 'Erasmus / International student', icon: GraduationCap, sub: 'University, dorms, events, friends' },
    { v: 'Tourist / Visitor', icon: Plane, sub: 'Hidden gems, transport, phrases' },
    { v: 'Local student', icon: MapPin, sub: 'Events, campus, documents' },
    { v: 'Local citizen', icon: Building2, sub: 'Events, hidden gems, documents' },
];

const LANGS: { code: string; flag: string; name: Language }[] = [
    { code: 'en', flag: '🇺🇸', name: 'English' },
    { code: 'bg', flag: '🇧🇬', name: 'Bulgarian' },
    { code: 'es', flag: '🇪🇸', name: 'Spanish' },
    { code: 'tr', flag: '🇹🇷', name: 'Turkish' },
    { code: 'fr', flag: '🇫🇷', name: 'French' },
    { code: 'de', flag: '🇩🇪', name: 'German' },
];

export function OnboardingModal() {
    const { i18n } = useTranslation();
    const [profile, setProfile] = useProfile();
    const open = !profile.onboarded;
    const [step, setStep] = useState(1);
    const [draftType, setDraftType] = useState<UserType | null>(profile.userType);
    const [draftLang, setDraftLang] = useState<Language>(profile.language);

    const handleLanguageSelect = (lang: { code: string; name: Language }) => {
        setDraftLang(lang.name);
        i18n.changeLanguage(lang.code);
    };

    const finish = () => {
        setProfile(p => ({
            ...p,
            onboarded: true,
            userType: draftType ?? 'Other',
            language: draftLang,
        }));
    };

    return (
        <Dialog open={open}>
            <DialogContent className="sm:max-w-lg p-0 overflow-hidden border-0 shadow-glow">
                <DialogTitle className="sr-only">Welcome to ERASMuse</DialogTitle>
                <div className="bg-gradient-hero p-6">
                    <div className="flex items-center gap-2">
                        <img src="/images/erasmuse-icon.jpg" alt="ERASMuse" className="h-12 w-12 rounded-lg object-cover" />
                        <span className="font-display font-extrabold tracking-tight text-3xl leading-none">
                            <span className="text-white">ERAS</span>
                            <span className="bg-gradient-to-br from-amber-400 to-orange-300 bg-clip-text text-transparent">M</span>
                            <span className="text-white">use</span>
                        </span>
                    </div>
                </div>
                <div className="p-6 space-y-5">
                    {step === 1 && (
                        <>
                            <div>
                                <h3 className="text-xl font-display font-bold">Welcome! Who are you?</h3>
                                <p className="text-sm text-muted-foreground mt-1">We'll personalize what you see.</p>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                {types.map(({ v, icon: Icon, sub }) => (
                                    <button key={v} onClick={() => setDraftType(v)} className={`text-left p-3 rounded-xl border transition-all ${draftType === v ? 'border-primary bg-secondary shadow-soft' : 'border-border hover:border-primary/40'}`}>
                                        <Icon className="w-5 h-5 text-primary mb-1.5" />
                                        <div className="text-sm font-semibold leading-tight">{v}</div>
                                        <div className="text-[11px] text-muted-foreground mt-0.5">{sub}</div>
                                    </button>
                                ))}
                            </div>
                            <div className="flex justify-between">
                                <div />
                                <Button onClick={() => setStep(2)} disabled={!draftType}>
                                    Next
                                </Button>
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
                                {LANGS.map(l => (
                                    <button
                                        key={l.code}
                                        onClick={() => handleLanguageSelect(l)}
                                        className={`p-3 rounded-xl border text-sm font-medium transition-all flex flex-col items-center gap-1 ${draftLang === l.name ? 'border-accent bg-secondary' : 'border-border hover:border-accent/40'}`}
                                    >
                                        <span className="text-lg">{l.flag}</span>
                                        <span>{l.name}</span>
                                    </button>
                                ))}
                            </div>
                            <div className="flex justify-between">
                                <Button variant="ghost" onClick={() => setStep(1)}>
                                    Back
                                </Button>
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