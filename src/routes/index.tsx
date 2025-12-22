import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import MainLayout from "@/components/layout/MainLayout";

const Login = lazy(() => import("@/pages/auth/Login"));
const ForgotPassword = lazy(() => import("@/pages/auth/ForgotPassword"));
const Dashboard = lazy(() => import("@/pages/dashboard/Dashboard"));
const Users = lazy(() => import("@/pages/users/Users"));
const Orders = lazy(() => import("@/pages/orders/Orders"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const Products = lazy(() => import("@/pages/products/Products"));
const ProductForm = lazy(() => import("@/pages/products/form/ProductForm"));
const Packages = lazy(() => import("@/pages/package/Packages"));
const PackageForm = lazy(() => import("@/pages/package/PackageForm"));
const PackageDetails = lazy(() => import("@/pages/package/PackageDetails"));
const Profile = lazy(() => import("@/pages/profile/Profile"));
const Reports = lazy(() => import("@/pages/Reports"));
const Delivery = lazy(() => import("@/pages/delivery/Delivery"));
const Transactions = lazy(() => import("@/pages/transactions/Transactions"));
const Support = lazy(() => import("@/pages/supports/Support"));
const Coupons = lazy(() => import("@/pages/coupon/Coupons"));
const Returns = lazy(() => import("@/pages/Returns"));
const RoleManagement = lazy(() => import("@/pages/roles/RoleManagement"));
const Notifications = lazy(() => import("@/pages/Notifications"));
const Settings = lazy(() => import("@/pages/settings/Settings"));
const CoinManagement = lazy(
  () => import("@/pages/coin-management/CoinManagement")
);
const Family = lazy(() => import("@/pages/Family"));
const Analytics = lazy(() => import("@/pages/Analytics"));
const Marketing = lazy(() => import("@/pages/Marketing"));
const Categories = lazy(() => import("@/pages/categories/Categories"));
const ProductViewDetails = lazy(() => import("@/pages/products/ViewDetails"));
const CoverageAreas = lazy(() => import("@/pages/coverage-area/CoverageAreas"));
const ContentManagement = lazy(() => import("@/pages/ContentManagement"));
const PackageSettings = lazy(
  () => import("@/pages/package/settings/PackageSettings")
);
const Donations = lazy(() => import("@/pages/donations"));
const CreateSupport = lazy(() => import("@/pages/supports/CreateSupport"));

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
          path="categories"
          element={
            <PrivateRoute>
              <Categories />
            </PrivateRoute>
          }
        />
        <Route
          path="products/create"
          element={
            <PrivateRoute>
              <ProductForm />
            </PrivateRoute>
          }
        />
        <Route
          path="products/edit/:id"
          element={
            <PrivateRoute>
              <ProductForm />
            </PrivateRoute>
          }
        />
        <Route
          path="products/view/:id"
          element={
            <PrivateRoute>
              <ProductViewDetails />
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
              <PackageForm />
            </PrivateRoute>
          }
        />
        <Route
          path="packages/edit/:id"
          element={
            <PrivateRoute>
              <PackageForm />
            </PrivateRoute>
          }
        />
        <Route
          path="packages/view/:id"
          element={
            <PrivateRoute>
              <PackageDetails />
            </PrivateRoute>
          }
        />
        <Route
          path="package/settings"
          element={
            <PrivateRoute>
              <PackageSettings />
            </PrivateRoute>
          }
        />
        <Route
          path="coverage-areas"
          element={
            <PrivateRoute>
              <CoverageAreas />
            </PrivateRoute>
          }
        />

        <Route
          path="content-management"
          element={
            <PrivateRoute>
              <ContentManagement />
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
          path="transactions"
          element={
            <PrivateRoute>
              <Transactions />
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
          path="support/create-ticket"
          element={
            <PrivateRoute>
              <CreateSupport />
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
          path="coin-management"
          element={
            <PrivateRoute>
              <CoinManagement />
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
          path="donations"
          element={
            <PrivateRoute>
              <Donations />
            </PrivateRoute>
          }
        />
        <Route
          path="notification-settings"
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
        <Route path="*" element={<NotFound />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
