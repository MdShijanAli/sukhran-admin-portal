import { useEffect } from "react";
import { Toaster, toast } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { useThemeStore } from "@/stores/themeStore";
import { useAuthStore } from "@/stores/authStore";
import AppRoutes from "@/routes/index.tsx";
import "@/i18n/config";
import { loadLanguageResources } from "@/i18n/config";
import authService from "./services/authService";

const queryClient = new QueryClient();

const App = () => {
  const { theme, setTheme, language } = useThemeStore();
  const { isAuthenticated, access_token } = useAuthStore();

  useEffect(() => {
    // Initialize theme on mount
    setTheme(theme);
  }, [theme]);

  // Load language resources when authenticated and language changes
  useEffect(() => {
    const loadLanguage = async () => {
      if (isAuthenticated) {
        try {
          await loadLanguageResources(language || "en");
        } catch (error) {
          console.error("Failed to load language resources:", error);
        }
      }
    };
    loadLanguage();
  }, [isAuthenticated, language]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (isAuthenticated && access_token) {
        try {
          const response = await authService.fetchProfile();
          if (response.status !== 200) {
            toast.error(
              response?.response?.data?.message ||
              "Failed to fetch user profile"
            );
          }
        } catch (error) {
          console.error("Failed to fetch profile:", error);
          toast.error("Failed to fetch user profile");
        }
      }
    };
    fetchProfile();
  }, [isAuthenticated, access_token]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster position="bottom-right" richColors />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
