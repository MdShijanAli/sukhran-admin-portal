import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useThemeStore } from "@/stores/themeStore";
import { useAuthStore } from "@/stores/authStore";
import "@/i18n/config";

import Login from "./pages/auth/Login";
import Dashboard from "./pages/dashboard/Dashboard";
import Users from "./pages/users/Users";
import Orders from "./pages/orders/Orders";
import MainLayout from "./components/layout/MainLayout";
import NotFound from "./pages/NotFound";
import Products from "./pages/Products";
import ProductCreate from "./pages/ProductCreate";
import Packages from "./pages/Packages";
import Profile from "./pages/Profile";
import Reports from "./pages/Reports";
import Delivery from "./pages/delivery/Delivery";
import Financial from "./pages/financial/Financial";
import Support from "./pages/Support";
import Coupons from "./pages/Coupons";
import Returns from "./pages/Returns";
import Settings from "./pages/Settings";
import RoleManagement from "./pages/RoleManagement";
import Notifications from "./pages/Notifications";
import LoyaltyRewards from "./pages/LoyaltyRewards";
import Family from "./pages/Family";
import Analytics from "./pages/Analytics";
import Marketing from "./pages/Marketing";
import PackageCreate from "./pages/PackageCreate";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const App = () => {
  const { theme, setTheme } = useThemeStore();

  useEffect(() => {
    // Initialize theme on mount
    setTheme(theme);
  }, [theme, setTheme]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="users" element={<Users />} />
              <Route path="orders" element={<Orders />} />
              <Route path="products" element={<Products />} />
              <Route path="products/create" element={<ProductCreate />} />
              <Route path="packages" element={<Packages />} />
              <Route path="packages/create" element={<PackageCreate />} />
              <Route path="packages/edit/:id" element={<PackageCreate />} />
              <Route path="profile" element={<Profile />} />
              <Route path="reports" element={<Reports />} />
              <Route path="delivery" element={<Delivery />} />
              <Route path="financial" element={<Financial />} />
              <Route path="support" element={<Support />} />
              <Route path="coupons" element={<Coupons />} />
              <Route path="returns" element={<Returns />} />
              <Route path="loyalty-rewards" element={<LoyaltyRewards />} />
              <Route path="family" element={<Family />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="marketing" element={<Marketing />} />
              <Route path="role-management" element={<RoleManagement />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="settings" element={<Settings />} />
              <Route index element={<Navigate to="/dashboard" replace />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
