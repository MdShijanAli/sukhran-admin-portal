import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Import language files
import en from "./locales/en/index.js";
import bn from "./locales/bn/index.js";

// Get stored language from localStorage
const getStoredLanguage = () => {
  try {
    const stored = localStorage.getItem("theme-storage");
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.state?.language || "en";
    }
  } catch (error) {
    console.error("Error reading language from localStorage:", error);
  }
  return "en";
};

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: en,
    },
    bn: {
      translation: bn,
    },
  },
  lng: getStoredLanguage(),
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
