import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type AIMode = "live" | "demo";

interface AIModeContextType {
  mode: AIMode;
  setMode: (mode: AIMode) => void;
  isLive: boolean;
}

const AIModeContext = createContext<AIModeContextType | undefined>(undefined);

const STORAGE_KEY = "erasmuse-ai-mode";

export function AIModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<AIMode>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "demo" || stored === "live") return stored;
    }
    return "live"; // Default to live mode
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, mode);
  }, [mode]);

  const setMode = (newMode: AIMode) => {
    setModeState(newMode);
  };

  return (
    <AIModeContext.Provider value={{ mode, setMode, isLive: mode === "live" }}>
      {children}
    </AIModeContext.Provider>
  );
}

export function useAIMode() {
  const context = useContext(AIModeContext);
  if (!context) {
    throw new Error("useAIMode must be used within an AIModeProvider");
  }
  return context;
}
