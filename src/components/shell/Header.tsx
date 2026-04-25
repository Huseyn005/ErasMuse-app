import { useNavigate } from "react-router-dom";
import { Search, Sun, Moon, BookmarkCheck, Languages, Menu, Sparkles, FlaskConical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/useTheme";
import { useProfile, type Language } from "@/hooks/useProfile";
import { useAIMode } from "@/contexts/AIModeContext";
import { Logo } from "./Logo";
import { GlobalSearch } from "./GlobalSearch";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "./Sidebar";

const LANGS: Language[] = ["English", "Bulgarian", "Spanish", "Turkish", "French", "German"];

export function Header() {
  const navigate = useNavigate();
  const { mode, setMode } = useTheme();
  const [profile, setProfile] = useProfile();
  const { mode: aiMode, setMode: setAIMode, isLive } = useAIMode();
  const isDark = mode === "dark";

  return (
    <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="flex items-center gap-3 px-4 lg:px-6 h-14">
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

        <div className="lg:hidden"><Logo size="sm" /></div>

        <div className="flex-1 max-w-xl hidden md:block">
          <GlobalSearch />
        </div>

        <Button
          variant={isLive ? "default" : "outline"}
          size="sm"
          className={`hidden sm:inline-flex gap-1.5 text-xs ${isLive ? "bg-primary hover:bg-primary/90" : ""}`}
          onClick={() => setAIMode(isLive ? "demo" : "live")}
        >
          {isLive ? (
            <>
              <Sparkles className="w-3.5 h-3.5" />
              <span>Live AI</span>
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            </>
          ) : (
            <>
              <FlaskConical className="w-3.5 h-3.5" />
              <span>Demo</span>
            </>
          )}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-1.5 hidden sm:inline-flex">
              <Languages className="w-4 h-4" />
              <span className="text-xs font-medium">{profile.language.slice(0, 2).toUpperCase()}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Language</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {LANGS.map(l => (
              <DropdownMenuItem key={l} onClick={() => setProfile(p => ({ ...p, language: l }))}>
                {l}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="ghost" size="icon"
          aria-label="Toggle theme"
          onClick={() => setMode(isDark ? "light" : "dark")}
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </Button>

        <Button
          variant="outline" size="sm"
          className="hidden sm:inline-flex gap-1.5"
          onClick={() => navigate("/plan")}
        >
          <BookmarkCheck className="w-4 h-4" /> My Plan
        </Button>

        <Button size="icon" variant="ghost" className="md:hidden" onClick={() => navigate("/explore")}>
          <Search className="w-4 h-4" />
        </Button>
      </div>
    </header>
  );
}
