import i18n from "i18next";
import { initReactI18next } from "react-i18next";

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

// Lazy load translation resources
const loadResources = async (language: string) => {
  try {
    const translations = await import(`./locales/${language}/index.js`);
    return translations.default;
  } catch (error) {
    console.error(`Error loading ${language} translations:`, error);
    // Fallback to English if language not found
    const enTranslations = await import(`./locales/en/index.js`);
    return enTranslations.default;
  }
};

i18n.use(initReactI18next).init({
  resources: {}, // Start with empty resources
  lng: getStoredLanguage(),
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false, // Disable suspense for lazy loading
  },
});

// Function to load language resources dynamically
export const loadLanguageResources = async (language: string) => {
  if (!i18n.hasResourceBundle(language, "translation")) {
    const resources = await loadResources(language);
    i18n.addResourceBundle(language, "translation", resources, true, true);
  }
  // Always change language to trigger re-render
  await i18n.changeLanguage(language);
};

export default i18n;
