import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, Compass, Bus, FileText, GraduationCap, Users, PanelLeftClose, PanelLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSidebarContext } from '@/contexts/SidebarContext';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { SidebarEmergencyButton } from '@/components/shell/EmergencyButton';
import { Logo } from '@/components/shell/Logo';

export function Sidebar() {
    const { t } = useTranslation();
    const { isCollapsed, toggleSidebar } = useSidebarContext();

    const items = [
        { to: '/', label: t('nav.home'), icon: Home },
        { to: '/explore', label: t('nav.explore'), icon: Compass },
        { to: '/campus', label: t('nav.campus'), icon: GraduationCap },
        { to: '/move', label: t('nav.move'), icon: Bus },
        { to: '/buddies', label: t('nav.buddies'), icon: Users },
        { to: '/documents', label: t('nav.documents'), icon: FileText },
    ];

    return (
        <TooltipProvider delayDuration={0}>
            <aside className={cn('hidden lg:flex flex-col shrink-0 border-r border-border bg-sidebar h-screen sticky top-0 transition-all duration-500 ease-in-out', isCollapsed ? 'w-16' : 'w-64')}>

                {/* Logo at top */}
                <div className={cn('flex items-center h-14 transition-all duration-500 shrink-0', isCollapsed ? 'justify-center px-2' : 'px-4')}>
                    {isCollapsed
                        ? <img src="/images/erasmuse-icon.jpg" alt="ERASMuse" className="h-10 w-10 rounded-lg object-cover" />
                        : <Logo size="lg" />
                    }
                </div>

                {/* Navigation */}
                <nav className={cn('flex-1 overflow-y-auto py-4', isCollapsed ? 'px-2 space-y-1' : 'px-3 space-y-2')}>
                    {items.map(({ to, label, icon: Icon }) => (
                        <Tooltip key={to}>
                            <TooltipTrigger asChild>
                                <NavLink to={to} end={to === '/'}>
                                    {({ isActive }) => (
                                        <span
                                            className={cn(
                                                'flex items-center rounded-xl transition-all duration-500 ease-in-out w-full',
                                                isCollapsed
                                                    ? cn('justify-center w-12 h-12 mx-auto', isActive ? 'bg-primary/10 text-primary border-l-2 border-primary' : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground')
                                                    : cn('gap-3 px-4 py-3.5', isActive ? 'bg-primary/10 text-primary font-bold' : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground font-medium'),
                                            )}
                                        >
                                            <Icon className={cn('shrink-0', isCollapsed ? 'w-6 h-6' : 'w-5 h-5')} strokeWidth={isActive ? 2.5 : 2} />
                                            {!isCollapsed && <span className="text-[15px] font-semibold truncate transition-opacity duration-500">{label}</span>}
                                        </span>
                                    )}
                                </NavLink>
                            </TooltipTrigger>
                            {isCollapsed && (
                                <TooltipContent side="right" className="font-medium">
                                    {label}
                                </TooltipContent>
                            )}
                        </Tooltip>
                    ))}
                </nav>

                {/* Footer — Emergency + Collapse */}
                <div className={cn('p-3 space-y-4')}>
                    <SidebarEmergencyButton isCollapsed={isCollapsed} />

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button
                                onClick={toggleSidebar}
                                className={cn('w-full flex items-center gap-3 h-12 rounded-xl transition-all duration-500 ease-in-out text-muted-foreground hover:text-primary hover:bg-sidebar-accent', isCollapsed ? 'justify-center' : 'px-3')}
                                aria-label={isCollapsed ? t('sidebar.expand') : t('sidebar.collapse')}
                            >
                                {isCollapsed ? <PanelLeft className="w-6 h-6" /> : <PanelLeftClose className="w-6 h-6" />}
                                {!isCollapsed && <span className="text-sm font-semibold transition-opacity duration-500">{t('sidebar.collapse')}</span>}
                            </button>
                        </TooltipTrigger>
                        <TooltipContent side="right">{isCollapsed ? t('sidebar.expand') : t('sidebar.collapse')}</TooltipContent>
                    </Tooltip>
                </div>
            </aside>
        </TooltipProvider>
    );
}