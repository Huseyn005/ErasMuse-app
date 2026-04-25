import { NavLink } from "react-router-dom";
import {
  Home, Sparkles, Compass, Bus, FileText, GraduationCap,
  HeartPulse, Users, BookmarkCheck, UserCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";

const items = [
  { to: "/", label: "Home", icon: Home },
  { to: "/ask", label: "Ask AI", icon: Sparkles },
  { to: "/explore", label: "Explore", icon: Compass },
  { to: "/move", label: "Move", icon: Bus },
  { to: "/documents", label: "Documents", icon: FileText },
  { to: "/campus", label: "Campus", icon: GraduationCap },
  { to: "/life-admin", label: "Life Admin", icon: HeartPulse },
  { to: "/buddies", label: "Buddy Finder", icon: Users },
  { to: "/plan", label: "My Plan", icon: BookmarkCheck },
  { to: "/profile", label: "Profile", icon: UserCircle2 },
];

export function Sidebar() {
  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 border-r border-border bg-sidebar h-screen sticky top-0">
      <div className="px-5 py-5 border-b border-border">
        <Logo />
        <p className="text-xs text-muted-foreground mt-1.5 leading-snug">
          Your AI companion for studying, living, travelling, and discovering Ruse.
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
          <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60" /> Demo data
        </span>
      </div>
    </aside>
  );
}
