import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import Login from "@/pages/auth/Login";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import Dashboard from "@/pages/dashboard/Dashboard";
import Users from "@/pages/users/Users";
import Orders from "@/pages/orders/Orders";
import MainLayout from "@/components/layout/MainLayout";
import NotFound from "@/pages/NotFound";
import Products from "@/pages/Products";
import ProductCreate from "@/pages/ProductCreate";
import Packages from "@/pages/Packages";
import PackageCreate from "@/pages/PackageCreate";
import Profile from "@/pages/Profile";
import Reports from "@/pages/Reports";
import Delivery from "@/pages/delivery/Delivery";
import Financial from "@/pages/financial/Financial";
import Support from "@/pages/Support";
import Coupons from "@/pages/Coupons";
import Returns from "@/pages/Returns";
import RoleManagement from "@/pages/RoleManagement";
import Notifications from "@/pages/Notifications";
import Settings from "@/pages/Settings";
import LoyaltyRewards from "@/pages/LoyaltyRewards";
import Family from "@/pages/Family";
import Analytics from "@/pages/Analytics";
import Marketing from "@/pages/Marketing";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <PublicRoute>
            <ForgotPassword />
          </PublicRoute>
        }
      />
      <Route
        path="/*"
        element={
          <PrivateRoute>
            <MainLayout />
          </PrivateRoute>
        }
      >
        <Route
          path="dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="users"
          element={
            <PrivateRoute>
              <Users />
            </PrivateRoute>
          }
        />
        <Route
          path="orders"
          element={
            <PrivateRoute>
              <Orders />
            </PrivateRoute>
          }
        />
        <Route
          path="products"
          element={
            <PrivateRoute>
              <Products />
            </PrivateRoute>
          }
        />
        <Route
          path="products/create"
          element={
            <PrivateRoute>
              <ProductCreate />
            </PrivateRoute>
          }
        />
        <Route
          path="packages"
          element={
            <PrivateRoute>
              <Packages />
            </PrivateRoute>
          }
        />
        <Route
          path="packages/create"
          element={
            <PrivateRoute>
              <PackageCreate />
            </PrivateRoute>
          }
        />
        <Route
          path="packages/edit/:id"
          element={
            <PrivateRoute>
              <PackageCreate />
            </PrivateRoute>
          }
        />
        <Route
          path="profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="reports"
          element={
            <PrivateRoute>
              <Reports />
            </PrivateRoute>
          }
        />
        <Route
          path="delivery"
          element={
            <PrivateRoute>
              <Delivery />
            </PrivateRoute>
          }
        />
        <Route
          path="financial"
          element={
            <PrivateRoute>
              <Financial />
            </PrivateRoute>
          }
        />
        <Route
          path="support"
          element={
            <PrivateRoute>
              <Support />
            </PrivateRoute>
          }
        />
        <Route
          path="coupons"
          element={
            <PrivateRoute>
              <Coupons />
            </PrivateRoute>
          }
        />
        <Route
          path="returns"
          element={
            <PrivateRoute>
              <Returns />
            </PrivateRoute>
          }
        />
        <Route
          path="loyalty-rewards"
          element={
            <PrivateRoute>
              <LoyaltyRewards />
            </PrivateRoute>
          }
        />
        <Route
          path="family"
          element={
            <PrivateRoute>
              <Family />
            </PrivateRoute>
          }
        />
        <Route
          path="analytics"
          element={
            <PrivateRoute>
              <Analytics />
            </PrivateRoute>
          }
        />
        <Route
          path="marketing"
          element={
            <PrivateRoute>
              <Marketing />
            </PrivateRoute>
          }
        />
        <Route
          path="role-management"
          element={
            <PrivateRoute>
              <RoleManagement />
            </PrivateRoute>
          }
        />
        <Route
          path="notifications"
          element={
            <PrivateRoute>
              <Notifications />
            </PrivateRoute>
          }
        />
        <Route
          path="settings"
          element={
            <PrivateRoute>
              <Settings />
            </PrivateRoute>
          }
        />
        <Route index element={<Navigate to="/dashboard" replace />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
