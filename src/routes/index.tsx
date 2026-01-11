import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import MainLayout from "@/components/layout/MainLayout";

import Login from "@/pages/auth/Login";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import Dashboard from "@/pages/dashboard/Dashboard";
import Users from "@/pages/users/Users";
import Orders from "@/pages/orders/Orders";
import NotFound from "@/pages/NotFound";
import Products from "@/pages/products/Products";
import ProductForm from "@/pages/products/form/ProductForm";
import Packages from "@/pages/package/Packages";
import PackageForm from "@/pages/package/PackageForm";
import PackageDetails from "@/pages/package/PackageDetails";
import Profile from "@/pages/profile/Profile";
import Reports from "@/pages/reports/Reports";
import Delivery from "@/pages/delivery/Delivery";
import Transactions from "@/pages/transactions/Transactions";
import Support from "@/pages/supports/Support";
import Coupons from "@/pages/coupon/Coupons";
import Returns from "@/pages/Returns";
import RoleManagement from "@/pages/roles/RoleManagement";
import Notifications from "@/pages/notifications/Notifications";
import Settings from "@/pages/settings/Settings";
import CoinManagement from "@/pages/coin-management/CoinManagement";
import Family from "@/pages/Family";
import Analytics from "@/pages/Analytics";
import Marketing from "@/pages/Marketing";
import Categories from "@/pages/categories/Categories";
import ProductViewDetails from "@/pages/products/ViewDetails";
import CoverageAreas from "@/pages/coverage-area/CoverageAreas";
import ContentManagement from "@/pages/ContentManagement";
import PackageSettings from "@/pages/package/settings/PackageSettings";
import Donations from "@/pages/donations";
import CreateSupport from "@/pages/supports/CreateSupport";
import Referrals from "@/pages/referrals/Referrals";
import Brands from "@/pages/brands/Brands";
import TransactionReport from "@/pages/reports/reports/TransactionReport";
import PackageSalesReport from "@/pages/reports/reports/PackageSalesReport";
import PackageOrdersReport from "@/pages/reports/reports/PackageOrdersReport";
import RegularSalesReport from "@/pages/reports/reports/RegularSalesReport";
import RegularOrdersReport from "@/pages/reports/reports/RegularOrdersReport";
import DonationReport from "@/pages/reports/reports/DonationReport";
import CoinReport from "@/pages/reports/reports/CoinReport";

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
          path="brands"
          element={
            <PrivateRoute>
              <Brands />
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
          path="referrals"
          element={
            <PrivateRoute>
              <Referrals />
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

        {/* Reports */}
        <Route
          path="reports/transactions"
          element={
            <PrivateRoute>
              <TransactionReport />
            </PrivateRoute>
          }
        />
        <Route
          path="reports/donations"
          element={
            <PrivateRoute>
              <DonationReport />
            </PrivateRoute>
          }
        />
        <Route
          path="reports/coins"
          element={
            <PrivateRoute>
              <CoinReport />
            </PrivateRoute>
          }
        />
        <Route
          path="reports/package-sales"
          element={
            <PrivateRoute>
              <PackageSalesReport />
            </PrivateRoute>
          }
        />
        <Route
          path="reports/package-orders"
          element={
            <PrivateRoute>
              <PackageOrdersReport />
            </PrivateRoute>
          }
        />
        <Route
          path="reports/regular-sales"
          element={
            <PrivateRoute>
              <RegularSalesReport />
            </PrivateRoute>
          }
        />
        <Route
          path="reports/regular-orders"
          element={
            <PrivateRoute>
              <RegularOrdersReport />
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
