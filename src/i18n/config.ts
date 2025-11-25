import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Import language files
import en from "./locales/en/index.js";
import bn from "./locales/bn/index.js";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: en,
    },
    bn: {
      translation: bn,
    },
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
