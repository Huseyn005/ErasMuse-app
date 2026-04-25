import { NavLink, useNavigate } from "react-router-dom";
import { Home, Compass, Bus, Sparkles, BookmarkCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { to: "/", label: "Home", icon: Home },
  { to: "/explore", label: "Explore", icon: Compass },
  { to: "/move", label: "Move", icon: Bus },
  { to: "/ask", label: "Ask", icon: Sparkles },
  { to: "/plan", label: "Plan", icon: BookmarkCheck },
];

export function BottomNav() {
  const navigate = useNavigate();
  return (
    <>
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-card/95 backdrop-blur border-t border-border">
        <ul className="grid grid-cols-5 h-16">
          {items.map(({ to, label, icon: Icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === "/"}
                className={({ isActive }) => cn(
                  "h-full flex flex-col items-center justify-center gap-0.5 text-[11px] font-medium",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                <Icon className="w-5 h-5" />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <button
        onClick={() => navigate("/ask")}
        className="lg:hidden fixed right-4 bottom-20 z-40 rounded-full px-4 h-12 bg-primary text-primary-foreground shadow-glow flex items-center gap-2 font-semibold text-sm"
        aria-label="Ask AI"
      >
        <Sparkles className="w-4 h-4" /> Ask AI
      </button>
    </>
  );
}
