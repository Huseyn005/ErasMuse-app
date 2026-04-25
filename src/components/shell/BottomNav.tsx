import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Home, Compass, GraduationCap, Bus, Users } from "lucide-react";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const { t } = useTranslation();

  const items = [
    { to: "/", label: t("nav.home"), icon: Home },
    { to: "/explore", label: t("nav.explore"), icon: Compass },
    { to: "/campus", label: t("nav.campus"), icon: GraduationCap },
    { to: "/move", label: t("nav.move"), icon: Bus },
    { to: "/buddies", label: t("nav.buddies"), icon: Users },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-card/95 backdrop-blur border-t border-border pb-safe">
      <ul className="grid grid-cols-5 h-16">
        {items.map(({ to, label, icon: Icon }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={to === "/"}
              className={({ isActive }) => cn(
                "h-full flex flex-col items-center justify-center gap-0.5 text-[11px] font-medium transition-colors",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="truncate max-w-[60px]">{label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
