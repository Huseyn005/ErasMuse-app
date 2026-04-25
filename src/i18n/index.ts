import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./locales/en.json";
import bg from "./locales/bg.json";
import es from "./locales/es.json";
import tr from "./locales/tr.json";
import fr from "./locales/fr.json";
import de from "./locales/de.json";
import az from "./locales/az.json";
import ka from "./locales/ka.json";
import ru from "./locales/ru.json";

export const resources = {
  en: { translation: en },
  bg: { translation: bg },
  es: { translation: es },
  tr: { translation: tr },
  fr: { translation: fr },
  de: { translation: de },
  az: { translation: az },
  ka: { translation: ka },
  ru: { translation: ru },
} as const;

export const languageNames: Record<string, string> = {
  en: "English",
  bg: "Български",
  es: "Español",
  tr: "Türkçe",
  fr: "Français",
  de: "Deutsch",
  az: "Azərbaycan",
  ka: "ქართული",
  ru: "Русский",
};

export const supportedLanguages = Object.keys(resources);

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: "erasmuse:language",
    },
  });

// Update HTML lang attribute when language changes
i18n.on("languageChanged", (lng) => {
  document.documentElement.setAttribute("lang", lng);
});

// Set initial lang attribute
if (typeof document !== "undefined") {
  document.documentElement.setAttribute("lang", i18n.language);
}

export default i18n;
