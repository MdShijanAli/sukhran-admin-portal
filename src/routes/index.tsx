import React, { lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import MainLayout from "@/components/layout/MainLayout";
import SuspenseWrapper from "@/components/custom/SuspenseWrapper";

// Auth
const Login = lazy(() => import("@/pages/auth/Login"));
const ForgotPassword = lazy(() => import("@/pages/auth/ForgotPassword"));

// Main Pages
const Dashboard = lazy(() => import("@/pages/dashboard/Dashboard"));
const Users = lazy(() => import("@/pages/users/Users"));
const Orders = lazy(() => import("@/pages/orders/Orders"));
const NotFound = lazy(() => import("@/pages/NotFound"));

// Products
const Products = lazy(() => import("@/pages/products/Products"));
const ProductForm = lazy(() => import("@/pages/products/form/ProductForm"));
const ProductViewDetails = lazy(() => import("@/pages/products/ViewDetails"));

// Packages
const Packages = lazy(() => import("@/pages/package/Packages"));
const PackageForm = lazy(() => import("@/pages/package/PackageForm"));
const PackageDetails = lazy(() => import("@/pages/package/PackageDetails"));
const PackageSettings = lazy(
  () => import("@/pages/package/settings/PackageSettings")
);

// Other Pages
const Profile = lazy(() => import("@/pages/profile/Profile"));
const Reports = lazy(() => import("@/pages/reports/Reports"));
const Delivery = lazy(() => import("@/pages/delivery/Delivery"));
const Transactions = lazy(() => import("@/pages/transactions/Transactions"));
const Support = lazy(() => import("@/pages/supports/Support"));
const CreateSupport = lazy(() => import("@/pages/supports/CreateSupport"));
const Coupons = lazy(() => import("@/pages/coupon/Coupons"));
const Returns = lazy(() => import("@/pages/Returns"));
const RoleManagement = lazy(() => import("@/pages/roles/RoleManagement"));
const Notifications = lazy(() => import("@/pages/notifications/Notifications"));
const Settings = lazy(() => import("@/pages/settings/Settings"));
const CoinManagement = lazy(
  () => import("@/pages/coin-management/CoinManagement")
);
const Family = lazy(() => import("@/pages/Family"));
const Analytics = lazy(() => import("@/pages/Analytics"));
const Marketing = lazy(() => import("@/pages/Marketing"));
const Categories = lazy(() => import("@/pages/categories/Categories"));
const CoverageAreas = lazy(() => import("@/pages/coverage-area/CoverageAreas"));
const ContentManagement = lazy(() => import("@/pages/ContentManagement"));
const Donations = lazy(() => import("@/pages/donations"));
const Referrals = lazy(() => import("@/pages/referrals/Referrals"));
const Brands = lazy(() => import("@/pages/brands/Brands"));

// Reports
const TransactionReport = lazy(
  () => import("@/pages/reports/reports/TransactionReport")
);
const PackageSalesReport = lazy(
  () => import("@/pages/reports/reports/PackageSalesReport")
);
const PackageOrdersReport = lazy(
  () => import("@/pages/reports/reports/PackageOrdersReport")
);
const RegularSalesReport = lazy(
  () => import("@/pages/reports/reports/RegularSalesReport")
);
const RegularOrdersReport = lazy(
  () => import("@/pages/reports/reports/RegularOrdersReport")
);
const DonationReport = lazy(
  () => import("@/pages/reports/reports/DonationReport")
);
const CoinReport = lazy(() => import("@/pages/reports/reports/CoinReport"));
const ReferralReport = lazy(
  () => import("@/pages/reports/reports/ReferralsReport")
);

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <SuspenseWrapper>
              <Login />
            </SuspenseWrapper>
          </PublicRoute>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <PublicRoute>
            <SuspenseWrapper>
              <ForgotPassword />
            </SuspenseWrapper>
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
              <SuspenseWrapper>
                <Dashboard />
              </SuspenseWrapper>
            </PrivateRoute>
          }
        />
        <Route
          path="users"
          element={
            <PrivateRoute>
              <SuspenseWrapper>
                <Users />
              </SuspenseWrapper>
            </PrivateRoute>
          }
        />
        <Route
          path="orders"
          element={
            <PrivateRoute>
              <SuspenseWrapper>
                <Orders />
              </SuspenseWrapper>
            </PrivateRoute>
          }
        />
        <Route
          path="products"
          element={
            <PrivateRoute>
              <SuspenseWrapper>
                <Products />
              </SuspenseWrapper>
            </PrivateRoute>
          }
        />
        <Route
          path="brands"
          element={
            <PrivateRoute>
              <SuspenseWrapper>
                <Brands />
              </SuspenseWrapper>
            </PrivateRoute>
          }
        />
        <Route
          path="categories"
          element={
            <PrivateRoute>
              <SuspenseWrapper>
                <Categories />
              </SuspenseWrapper>
            </PrivateRoute>
          }
        />
        <Route
          path="products/create"
          element={
            <PrivateRoute>
              <SuspenseWrapper>
                <ProductForm />
              </SuspenseWrapper>
            </PrivateRoute>
          }
        />
        <Route
          path="products/edit/:id"
          element={
            <PrivateRoute>
              <SuspenseWrapper>
                <ProductForm />
              </SuspenseWrapper>
            </PrivateRoute>
          }
        />
        <Route
          path="products/view/:id"
          element={
            <PrivateRoute>
              <SuspenseWrapper>
                <ProductViewDetails />
              </SuspenseWrapper>
            </PrivateRoute>
          }
        />
        <Route
          path="packages"
          element={
            <PrivateRoute>
              <SuspenseWrapper>
                <Packages />
              </SuspenseWrapper>
            </PrivateRoute>
          }
        />
        <Route
          path="packages/create"
          element={
            <PrivateRoute>
              <SuspenseWrapper>
                <PackageForm />
              </SuspenseWrapper>
            </PrivateRoute>
          }
        />
        <Route
          path="packages/edit/:id"
          element={
            <PrivateRoute>
              <SuspenseWrapper>
                <PackageForm />
              </SuspenseWrapper>
            </PrivateRoute>
          }
        />
        <Route
          path="packages/view/:id"
          element={
            <PrivateRoute>
              <SuspenseWrapper>
                <PackageDetails />
              </SuspenseWrapper>
            </PrivateRoute>
          }
        />
        <Route
          path="package/settings"
          element={
            <PrivateRoute>
              <SuspenseWrapper>
                <PackageSettings />
              </SuspenseWrapper>
            </PrivateRoute>
          }
        />
        <Route
          path="coverage-areas"
          element={
            <PrivateRoute>
              <SuspenseWrapper>
                <CoverageAreas />
              </SuspenseWrapper>
            </PrivateRoute>
          }
        />

        <Route
          path="content-management"
          element={
            <PrivateRoute>
              <SuspenseWrapper>
                <ContentManagement />
              </SuspenseWrapper>
            </PrivateRoute>
          }
        />

        <Route
          path="profile"
          element={
            <PrivateRoute>
              <SuspenseWrapper>
                <Profile />
              </SuspenseWrapper>
            </PrivateRoute>
          }
        />
        <Route
          path="reports"
          element={
            <PrivateRoute>
              <SuspenseWrapper>
                <Reports />
              </SuspenseWrapper>
            </PrivateRoute>
          }
        />
        <Route
          path="delivery"
          element={
            <PrivateRoute>
              <SuspenseWrapper>
                <Delivery />
              </SuspenseWrapper>
            </PrivateRoute>
          }
        />
        <Route
          path="transactions"
          element={
            <PrivateRoute>
              <SuspenseWrapper>
                <Transactions />
              </SuspenseWrapper>
            </PrivateRoute>
          }
        />
        <Route
          path="support"
          element={
            <PrivateRoute>
              <SuspenseWrapper>
                <Support />
              </SuspenseWrapper>
            </PrivateRoute>
          }
        />
        <Route
          path="support/create-ticket"
          element={
            <PrivateRoute>
              <SuspenseWrapper>
                <CreateSupport />
              </SuspenseWrapper>
            </PrivateRoute>
          }
        />
        <Route
          path="coupons"
          element={
            <PrivateRoute>
              <SuspenseWrapper>
                <Coupons />
              </SuspenseWrapper>
            </PrivateRoute>
          }
        />
        <Route
          path="returns"
          element={
            <PrivateRoute>
              <SuspenseWrapper>
                <Returns />
              </SuspenseWrapper>
            </PrivateRoute>
          }
        />
        <Route
          path="coin-management"
          element={
            <PrivateRoute>
              <SuspenseWrapper>
                <CoinManagement />
              </SuspenseWrapper>
            </PrivateRoute>
          }
        />
        <Route
          path="family"
          element={
            <PrivateRoute>
              <SuspenseWrapper>
                <Family />
              </SuspenseWrapper>
            </PrivateRoute>
          }
        />
        <Route
          path="analytics"
          element={
            <PrivateRoute>
              <SuspenseWrapper>
                <Analytics />
              </SuspenseWrapper>
            </PrivateRoute>
          }
        />
        <Route
          path="marketing"
          element={
            <PrivateRoute>
              <SuspenseWrapper>
                <Marketing />
              </SuspenseWrapper>
            </PrivateRoute>
          }
        />
        <Route
          path="role-management"
          element={
            <PrivateRoute>
              <SuspenseWrapper>
                <RoleManagement />
              </SuspenseWrapper>
            </PrivateRoute>
          }
        />
        <Route
          path="donations"
          element={
            <PrivateRoute>
              <SuspenseWrapper>
                <Donations />
              </SuspenseWrapper>
            </PrivateRoute>
          }
        />
        <Route
          path="referrals"
          element={
            <PrivateRoute>
              <SuspenseWrapper>
                <Referrals />
              </SuspenseWrapper>
            </PrivateRoute>
          }
        />
        <Route
          path="notification-settings"
          element={
            <PrivateRoute>
              <SuspenseWrapper>
                <Notifications />
              </SuspenseWrapper>
            </PrivateRoute>
          }
        />
        <Route
          path="settings"
          element={
            <PrivateRoute>
              <SuspenseWrapper>
                <Settings />
              </SuspenseWrapper>
            </PrivateRoute>
          }
        />

        {/* Reports */}
        <Route
          path="reports/transactions"
          element={
            <PrivateRoute>
              <SuspenseWrapper>
                <TransactionReport />
              </SuspenseWrapper>
            </PrivateRoute>
          }
        />
        <Route
          path="reports/donations"
          element={
            <PrivateRoute>
              <SuspenseWrapper>
                <DonationReport />
              </SuspenseWrapper>
            </PrivateRoute>
          }
        />
        <Route
          path="reports/coins"
          element={
            <PrivateRoute>
              <SuspenseWrapper>
                <CoinReport />
              </SuspenseWrapper>
            </PrivateRoute>
          }
        />
        <Route
          path="reports/referrals"
          element={
            <PrivateRoute>
              <SuspenseWrapper>
                <ReferralReport />
              </SuspenseWrapper>
            </PrivateRoute>
          }
        />
        <Route
          path="reports/package-sales"
          element={
            <PrivateRoute>
              <SuspenseWrapper>
                <PackageSalesReport />
              </SuspenseWrapper>
            </PrivateRoute>
          }
        />
        <Route
          path="reports/package-orders"
          element={
            <PrivateRoute>
              <SuspenseWrapper>
                <PackageOrdersReport />
              </SuspenseWrapper>
            </PrivateRoute>
          }
        />
        <Route
          path="reports/regular-sales"
          element={
            <PrivateRoute>
              <SuspenseWrapper>
                <RegularSalesReport />
              </SuspenseWrapper>
            </PrivateRoute>
          }
        />
        <Route
          path="reports/regular-orders"
          element={
            <PrivateRoute>
              <SuspenseWrapper>
                <RegularOrdersReport />
              </SuspenseWrapper>
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
