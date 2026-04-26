import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search, Sun, Moon, Languages, Menu, Sparkles, FlaskConical, UserCircle2, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/useTheme';
import { useAIMode } from '@/contexts/AIModeContext';
import { useSidebarContext } from '@/contexts/SidebarContext';
import { Logo } from './Logo';
import { GlobalSearch } from './GlobalSearch';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Sidebar } from './Sidebar';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

const LANGS = [
    { code: 'en', name: 'English', flag: 'EN' },
    { code: 'bg', name: 'Bulgarian', flag: 'BG' },
    { code: 'az', name: 'Azerbaijani', flag: 'AZ' },
    { code: 'ka', name: 'Georgian', flag: 'KA' },
    { code: 'ru', name: 'Russian', flag: 'RU' },
    { code: 'es', name: 'Spanish', flag: 'ES' },
    { code: 'tr', name: 'Turkish', flag: 'TR' },
    { code: 'fr', name: 'French', flag: 'FR' },
    { code: 'de', name: 'German', flag: 'DE' },
];

export function Header() {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const { mode, setMode } = useTheme();
    const { mode: aiMode, setMode: setAIMode, isLive } = useAIMode();
    const { isCollapsed } = useSidebarContext();
    const isDark = mode === 'dark';

    const currentLang = LANGS.find(l => l.code === i18n.language) || LANGS[0];

    const changeLanguage = (code: string) => {
        i18n.changeLanguage(code);
        document.documentElement.lang = code;
    };

    return (
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl pt-2">
            <div className="flex items-center gap-3 px-4 lg:px-6 h-14">
                {/* Mobile menu */}
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
                            <Menu className="w-5 h-5" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 w-72">
                        <Sidebar />
                    </SheetContent>
                </Sheet>

                {/* Logo - on mobile always full, on desktop only text when sidebar expanded, full when collapsed */}
                <div className="shrink-0 lg:hidden">
                    <Logo size="md" />
                </div>
                {/* Desktop collapsed: text only (icon is in sidebar) */}
                <div className={cn('shrink-0 hidden', isCollapsed && 'lg:block')}>
                    <Logo size="md" showIcon={false} />
                </div>

                {/* Spacer to center search */}
                <div className="flex-1" />

                {/* Search - centered */}
                <div className={cn('hidden md:block transition-all duration-300', isCollapsed ? 'w-full max-w-2xl' : 'w-full max-w-xl')}>
                    <GlobalSearch />
                </div>

                {/* Spacer to push icons to right */}
                <div className="flex-1" />

                {/* AI Mode Toggle */}
                <Button variant={isLive ? 'default' : 'outline'} size="sm" className={`hidden sm:inline-flex gap-1.5 text-xs ${isLive ? 'bg-primary hover:bg-primary/90' : ''}`} onClick={() => setAIMode(isLive ? 'demo' : 'live')}>
                    {isLive ? (
                        <>
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>{t('header.liveAI')}</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                        </>
                    ) : (
                        <>
                            <FlaskConical className="w-4 h-4\\" />
                            <span>{t('header.demo')}</span>
                        </>
                    )}
                </Button>

                {/* Language Selector */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="hidden sm:inline-flex items-center gap-1.5 px-3">
                            <Languages className="w-5 h-5" />
                            <span className="text-xs font-medium">{currentLang.flag}</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel>{t('header.language')}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {LANGS.map(l => (
                            <DropdownMenuItem key={l.code} onClick={() => changeLanguage(l.code)} className={i18n.language === l.code ? 'bg-accent' : ''}>
                                <span className="w-6 text-xs font-medium text-muted-foreground">{l.flag}</span>
                                {l.name}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Theme Toggle */}
                <Button variant="ghost" size="icon" aria-label="Toggle theme" onClick={() => setMode(isDark ? 'light' : 'dark')}>
                    {isDark ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
                </Button>

                {/* Profile Dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-full" aria-label="Profile menu">
                            <Avatar className="w-9 h-9">
                                <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                                    <UserCircle2 className="w-6 h-6" />
                                </AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>{t('nav.profile')}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => navigate('/profile')}>
                            <UserCircle2 className="w-4 h-4 mr-2" />
                            {t('nav.profile')}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setMode(isDark ? 'light' : 'dark')}>
                            {isDark ? <Sun className="w-4 h-4 mr-2" /> : <Moon className="w-4 h-4 mr-2" />}
                            {t('header.theme')}: {isDark ? t('profile.dark') : t('profile.light')}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {/* Language submenu in profile */}
                        <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">{t('header.language')}</DropdownMenuLabel>
                        <div className="max-h-32 overflow-y-auto">
                            {LANGS.slice(0, 5).map(l => (
                                <DropdownMenuItem key={l.code} onClick={() => changeLanguage(l.code)} className={`text-sm ${i18n.language === l.code ? 'bg-accent' : ''}`}>
                                    <span className="w-6 text-xs">{l.flag}</span>
                                    {l.name}
                                </DropdownMenuItem>
                            ))}
                        </div>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => navigate('/profile')}>
                            <Settings className="w-4 h-4 mr-2" />
                            {t('header.settings')}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Mobile search */}
                <Button size="icon" variant="ghost" className="md:hidden" onClick={() => navigate('/explore')}>
                    <Search className="w-4 h-4" />
                </Button>
            </div>
        </header>
    );
}
