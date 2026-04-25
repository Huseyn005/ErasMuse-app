import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ShieldAlert, Phone, X, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export function EmergencyButton() {
  const { t } = useTranslation();
  const [showPhrases, setShowPhrases] = useState(false);

  const emergencyPhrases = [
    { key: "needHelp", bg: "Имам нужда от помощ." },
    { key: "callAmbulance", bg: "Обадете се на линейка." },
    { key: "iAmLost", bg: "Изгубих се." },
    { key: "noSpeakBulgarian", bg: "Не говоря български." },
  ];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          className={cn(
            "fixed z-50 flex items-center gap-2 rounded-full shadow-lg",
            "bg-red-600 hover:bg-red-700 text-white",
            "transition-all duration-200 hover:scale-105",
            "focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2",
            // Desktop: bottom-right
            "right-4 bottom-4 lg:right-6 lg:bottom-6",
            // Mobile: above bottom nav
            "bottom-20 lg:bottom-6",
            // Size
            "px-4 py-3 lg:px-5 lg:py-3"
          )}
          aria-label={t("emergency.button")}
        >
          <ShieldAlert className="w-5 h-5" />
          <span className="font-semibold text-sm hidden sm:inline">{t("emergency.button")}</span>
          <span className="font-semibold text-sm sm:hidden">SOS</span>
        </button>
      </SheetTrigger>
      <SheetContent side="bottom" className="rounded-t-3xl max-h-[85vh] overflow-y-auto">
        <SheetHeader className="text-left pb-4">
          <SheetTitle className="flex items-center gap-2 text-red-600">
            <ShieldAlert className="w-6 h-6" />
            {t("emergency.title")}
          </SheetTitle>
          <SheetDescription>
            {t("emergency.description")}
          </SheetDescription>
        </SheetHeader>

        {/* Call 112 Button */}
        <a
          href="tel:112"
          className="flex items-center justify-center gap-3 w-full py-4 px-6 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-bold text-lg transition-colors mb-6"
        >
          <Phone className="w-6 h-6" />
          {t("emergency.call112")}
        </a>

        {/* Emergency Phrases */}
        <div className="space-y-4">
          <Button
            variant="outline"
            className="w-full justify-between"
            onClick={() => setShowPhrases(!showPhrases)}
          >
            {showPhrases ? t("emergency.hidePhrases") : t("emergency.showPhrases")}
            {showPhrases ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>

          {showPhrases && (
            <div className="space-y-3 animate-in slide-in-from-top-2">
              {emergencyPhrases.map(({ key, bg }) => (
                <div key={key} className="p-4 bg-muted rounded-xl">
                  <p className="font-medium text-foreground">{t(`emergency.${key}`)}</p>
                  <p className="text-sm text-muted-foreground mt-1">Bulgarian: {bg}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Disclaimer */}
        <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl">
          <p className="text-sm text-amber-800 dark:text-amber-200">
            {t("emergency.warning")}
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
