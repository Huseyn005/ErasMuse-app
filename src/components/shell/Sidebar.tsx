import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Home, Compass, Bus, FileText, GraduationCap, Users, PanelLeftClose, PanelLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebarContext } from "@/contexts/SidebarContext";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

export function Sidebar() {
  const { t } = useTranslation();
  const { isCollapsed, toggleSidebar } = useSidebarContext();

  const items = [
    { to: "/", label: t("nav.home"), icon: Home },
    { to: "/explore", label: t("nav.explore"), icon: Compass },
    { to: "/campus", label: t("nav.campus"), icon: GraduationCap },
    { to: "/move", label: t("nav.move"), icon: Bus },
    { to: "/buddies", label: t("nav.buddies"), icon: Users },
    { to: "/documents", label: t("nav.documents"), icon: FileText },
  ];

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "hidden lg:flex flex-col shrink-0 border-r border-border bg-sidebar h-screen sticky top-0 transition-all duration-300 ease-in-out",
          isCollapsed ? "w-16" : "w-64"
        )}
      >

        {/* Header with Collapse Button and Label */}
        <div className={cn(
          "border-b border-border flex items-center h-14",
          isCollapsed ? "px-2 justify-center" : "px-4 gap-2"
        )}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
                className="h-8 w-8 shrink-0"
                aria-label={isCollapsed ? t("sidebar.expand") : t("sidebar.collapse")}
              >
                {isCollapsed ? <PanelLeft className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              {isCollapsed ? t("sidebar.expand") : t("sidebar.collapse")}
            </TooltipContent>
          </Tooltip>
          {!isCollapsed && (
            <span className="text-sm font-medium text-muted-foreground">
              {t("sidebar.collapse")}
            </span>
          )}
        </div>

        {/* Navigation */}
        <nav className={cn(
          "flex-1 overflow-y-auto py-4 space-y-0.5",
          isCollapsed ? "px-2" : "px-3"
        )}>
          {items.map(({ to, label, icon: Icon }) => (
            <Tooltip key={to}>
              <TooltipTrigger asChild>
                <NavLink
                  to={to}
                  end={to === "/"}
                >
                  {({ isActive }) => (
                    <span className={cn(
                      "flex items-center rounded-xl transition-colors",
                      isCollapsed
                        ? "justify-center w-12 h-12 mx-auto"
                        : "gap-3 px-4 py-3",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-soft font-semibold"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground font-medium"
                    )}>
                      <Icon className={cn("shrink-0", isCollapsed ? "w-6 h-6" : "w-5 h-5")} strokeWidth={isActive ? 2.5 : 2} />
                      {!isCollapsed && <span className="text-base font-medium">{label}</span>}
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
      </aside>
    </TooltipProvider>
  );
}
