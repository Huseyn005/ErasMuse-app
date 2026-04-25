import { useEffect } from "react";
import { useLocalStorage } from "./useLocalStorage";

export type ThemeMode = "light" | "dark" | "system";

export function useTheme() {
  const [mode, setMode] = useLocalStorage<ThemeMode>("erasmuse:theme", "light");

  useEffect(() => {
    const root = document.documentElement;
    const apply = (m: ThemeMode) => {
      const dark = m === "dark" || (m === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
      root.classList.toggle("dark", dark);
    };
    apply(mode);
    if (mode === "system") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      const onChange = () => apply("system");
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    }
  }, [mode]);

  return { mode, setMode };
}
