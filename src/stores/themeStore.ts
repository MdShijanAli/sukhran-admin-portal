import { createStore } from "./createStore";

interface ThemeState {
  theme: "light" | "dark";
  language: "en" | "bn";
  toggleTheme: () => void;
  setTheme: (theme: "light" | "dark") => void;
  setLanguage: (language: "en" | "bn") => void;
}

export const useThemeStore = createStore<ThemeState>(
  (set) => ({
    theme: "light",
    language: "en",
    toggleTheme: () =>
      set((state) => {
        const newTheme = state.theme === "light" ? "dark" : "light";
        document.documentElement.classList.toggle("dark", newTheme === "dark");
        return { theme: newTheme };
      }),
    setTheme: (theme) => {
      document.documentElement.classList.toggle("dark", theme === "dark");
      set({ theme });
    },
    setLanguage: (language) => {
      set({ language });
    },
  }),
  "theme-storage",
  true
);
