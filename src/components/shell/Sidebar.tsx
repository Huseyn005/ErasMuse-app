import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Home, Compass, Bus, FileText, GraduationCap, Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";

export function Sidebar() {
  const { t } = useTranslation();

  const items = [
    { to: "/", label: t("nav.home"), icon: Home },
    { to: "/explore", label: t("nav.explore"), icon: Compass },
    { to: "/campus", label: t("nav.campus"), icon: GraduationCap },
    { to: "/move", label: t("nav.move"), icon: Bus },
    { to: "/buddies", label: t("nav.buddies"), icon: Users },
    { to: "/documents", label: t("nav.documents"), icon: FileText },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 border-r border-border bg-sidebar h-screen sticky top-0">
      <div className="px-5 py-5 border-b border-border">
        <Logo />
        <p className="text-xs text-muted-foreground mt-1.5 leading-snug">
          {t("home.subtitle")}
        </p>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
              isActive
                ? "bg-primary text-primary-foreground shadow-soft"
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            )}
          >
            <Icon className="w-4 h-4" />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="px-5 py-4 border-t border-border text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted">
          <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60" /> {t("nav.demoData")}
        </span>
      </div>
    </aside>
  );
}
