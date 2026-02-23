# 📚 Shukran Admin Portal - Technical Documentation

> **Last Updated:** January 26, 2026
> **Version:** 1.0.0
> **Document Type:** Comprehensive Technical Documentation

---

## 📋 Table of Contents

1. [Introduction](#1-introduction)
2. [Tech Stack](#2-tech-stack)
3. [System Architecture](#3-system-architecture)
4. [Project Structure](#4-project-structure)
5. [Setup & Installation](#5-setup--installation)
6. [Environment Configuration](#6-environment-configuration)
7. [Authentication & Authorization](#7-authentication--authorization)
8. [API Documentation](#8-api-documentation)
9. [State Management](#9-state-management)
10. [Key Features & Modules](#10-key-features--modules)
11. [Routing System](#11-routing-system)
12. [Permission System](#12-permission-system)
13. [Component Library](#13-component-library)
14. [Internationalization (i18n)](#14-internationalization-i18n)
15. [Build & Deployment](#15-build--deployment)
16. [Performance Optimization](#16-performance-optimization)
17. [Testing Guidelines](#17-testing-guidelines)
18. [Known Issues & Troubleshooting](#18-known-issues--troubleshooting)
19. [Best Practices](#19-best-practices)
20. [Contributing Guidelines](#20-contributing-guidelines)

---

## 1. Introduction

### 1.1 Project Overview

**Shukran Admin Portal** is a comprehensive e-commerce administration system designed to manage various aspects of an online store including:

- 👥 **User Management** - Handle customers, admins, and roles
- 📦 **Product Management** - Create, edit, and organize products
- 🎁 **Package Management** - Custom and pre-built product packages
- 🛒 **Order Management** - Track and process customer orders
- 💰 **Transaction & Payment** - Monitor financial transactions
- 📂 **Category Management** - Hierarchical product categories
- 🏷️ **Brand Management** - Brand creation and organization
- 🎨 **Banner Management** - Promotional banners and campaigns
- 🎫 **Coupon & Promotion** - Discount code management
- 🗺️ **Coverage Area Management** - Delivery zones and pricing
- 🚚 **Delivery Management** - Shipping and logistics
- 🪙 **Coin Management** - Loyalty points system
- 🎗️ **Donation Management** - Charity and donation tracking
- 🤝 **Referral Management** - Referral program and rewards
- 📊 **Analytics & Reporting** - Business insights and reports
- 💬 **Customer Support** - Ticket system and help desk
- 🔐 **Role & Permission Management** - Access control system
- 🔔 **Notification System** - Push notifications and alerts
- 🛠️ **System Settings** - Configure portal behavior

### 1.2 Target Audience

This documentation is intended for:

- **Software Developers** - Full-stack developers working on the portal
- **DevOps Engineers** - Infrastructure and deployment teams
- **System Administrators** - Portal configuration and maintenance
- **QA Engineers** - Testing and quality assurance teams
- **Project Managers** - Understanding technical capabilities

### 1.3 Key Objectives

1. Provide a scalable and maintainable admin interface
2. Ensure role-based access control for security
3. Offer real-time data management capabilities
4. Support multiple languages (English & Arabic)
5. Maintain responsive design for all devices

---

## 2. Tech Stack

### 2.1 Frontend Technologies

| Technology           | Version | Purpose                     |
| -------------------- | ------- | --------------------------- |
| **React**            | 18.3.1  | Core UI framework           |
| **TypeScript**       | 5.8.3   | Type-safe development       |
| **Vite**             | 5.4.19  | Build tool & dev server     |
| **React Router DOM** | 6.30.1  | Client-side routing         |
| **Tailwind CSS**     | 3.4.17  | Utility-first CSS framework |

### 2.2 UI Component Libraries

| Library          | Version | Purpose                     |
| ---------------- | ------- | --------------------------- |
| **Radix UI**     | Various | Headless UI components      |
| **shadcn/ui**    | Latest  | Pre-built styled components |
| **Lucide React** | 0.462.0 | Icon library                |
| **Sonner**       | 1.7.4   | Toast notifications         |

### 2.3 State Management & Data Fetching

| Library            | Version | Purpose                           |
| ------------------ | ------- | --------------------------------- |
| **Zustand**        | 5.0.8   | Lightweight state management      |
| **TanStack Query** | 5.83.0  | Server state management & caching |
| **Axios**          | 1.13.2  | HTTP client                       |

### 2.4 Form & Validation

| Library                 | Version | Purpose                     |
| ----------------------- | ------- | --------------------------- |
| **React Hook Form**     | 7.61.1  | Form state management       |
| **Zod**                 | 3.25.76 | Schema validation           |
| **@hookform/resolvers** | 3.10.0  | Form validation integration |

### 2.5 Additional Libraries

| Library                      | Version | Purpose              |
| ---------------------------- | ------- | -------------------- |
| **date-fns**                 | 3.6.0   | Date manipulation    |
| **recharts**                 | 2.15.4  | Data visualization   |
| **i18next**                  | 25.6.0  | Internationalization |
| **@dnd-kit/core**            | 6.3.1   | Drag and drop        |
| **class-variance-authority** | 0.7.1   | Component variants   |

### 2.6 Development Tools

| Tool             | Version | Purpose             |
| ---------------- | ------- | ------------------- |
| **ESLint**       | 9.32.0  | Code linting        |
| **PostCSS**      | 8.5.6   | CSS processing      |
| **Autoprefixer** | 10.4.21 | CSS vendor prefixes |

---

## 3. System Architecture

### 3.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENT BROWSER                          │
│                   (React SPA Application)                    │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ HTTPS/REST API
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                    API GATEWAY/SERVER                        │
│            (https://d2c.thevisitlondon.com/api)             │
└──────────────────────┬──────────────────────────────────────┘
                       │
            ┌──────────┴──────────┐
            │                     │
┌───────────▼────────┐  ┌────────▼──────────┐
│   DATABASE         │  │   FILE STORAGE     │
│   (Backend)        │  │   (Images/Files)   │
└────────────────────┘  └───────────────────┘
```

### 3.2 Frontend Architecture

```
src/
├── api/              # API client & route definitions
├── components/       # Reusable React components
│   ├── layout/      # Layout components
│   ├── ui/          # shadcn/ui components
│   ├── custom/      # Custom components
│   └── modals/      # Modal dialogs
├── hooks/           # Custom React hooks
├── stores/          # Zustand state stores
├── services/        # API service layer
├── pages/           # Page components (routes)
├── routes/          # Routing configuration
├── lib/             # Utility functions & types
├── i18n/            # Internationalization
└── assets/          # Static assets
```

### 3.3 Data Flow

```
┌──────────────┐
│ User Action  │
└──────┬───────┘
       │
       ▼
┌──────────────────┐
│ React Component  │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐      ┌──────────────────┐
│ Service Layer    │─────▶│ Zustand Store    │
└──────┬───────────┘      └──────────────────┘
       │
       ▼
┌──────────────────┐      ┌──────────────────┐
│ API Client       │─────▶│ TanStack Query   │
│ (Axios)          │      │ (Cache)          │
└──────┬───────────┘      └──────────────────┘
       │
       ▼
┌──────────────────┐
│ Backend API      │
└──────────────────┘
```

### 3.4 Authentication Flow

```
┌────────────┐
│   Login    │
└─────┬──────┘
      │
      ▼
┌─────────────────────────┐
│ POST /auth/login        │
│ {email, password}       │
└─────┬───────────────────┘
      │
      ▼
┌─────────────────────────────────┐
│ Response: {                     │
│   user: {...},                  │
│   access_token: "...",          │
│   refresh_token: "...",         │
│   permissions: [...]            │
│ }                               │
└─────┬───────────────────────────┘
      │
      ▼
┌─────────────────────────┐
│ Store in AuthStore      │
│ + LocalStorage          │
└─────┬───────────────────┘
      │
      ▼
┌─────────────────────────┐
│ Subsequent Requests     │
│ Header: Authorization   │
│ Bearer {access_token}   │
└─────────────────────────┘
```

---

## 4. Project Structure

### 4.1 Root Directory

```
sukhran-admin-portal/
├── src/                      # Source code
├── public/                   # Static assets
│   ├── fonts/               # Custom fonts
│   ├── images/              # Static images
│   ├── _redirects           # Netlify redirects
│   └── robots.txt           # SEO robots file
├── .env                      # Environment variables
├── .env.example             # Environment template
├── package.json             # Dependencies
├── vite.config.ts           # Vite configuration
├── tailwind.config.ts       # Tailwind CSS config
├── tsconfig.json            # TypeScript config
├── eslint.config.js         # ESLint configuration
├── postcss.config.js        # PostCSS config
├── components.json          # shadcn/ui config
├── DESIGN_SYSTEM.md         # Design guidelines
├── PERMISSIONS_GUIDE.md     # Permission system docs
└── README.md                # Project readme
```

### 4.2 Source Code Structure

```
src/
├── api/
│   ├── apiClient.ts         # Axios instance with interceptors
│   └── apiRoutes.ts         # API endpoint definitions
│
├── assets/
│   └── images/              # Image assets
│
├── components/
│   ├── layout/
│   │   ├── MainLayout.tsx   # Main app layout
│   │   ├── Sidebar.tsx      # Navigation sidebar
│   │   └── Header.tsx       # Top header bar
│   ├── ui/                  # shadcn/ui components
│   ├── custom/              # Custom reusable components
│   ├── modals/              # Modal dialogs
│   ├── table/               # Table components
│   └── content/             # Content components
│
├── data/
│   └── mockData.ts          # Mock data for development
│
├── hoc/
│   └── withPermission.tsx   # Permission HOC
│
├── hooks/
│   ├── use-api-controller.ts    # API request controller
│   ├── use-mobile.tsx           # Mobile detection
│   ├── use-permissions.ts       # Permission checker
│   ├── use-toast.ts             # Toast notifications
│   └── use-page-title.ts        # Dynamic page titles
│
├── i18n/
│   ├── config.ts            # i18n configuration
│   └── locales/             # Translation files
│       ├── en/              # English translations
│       └── ar/              # Arabic translations
│
├── lib/
│   ├── constData.ts         # Constant data
│   ├── getSerialNumber.ts   # Table serial number helper
│   ├── permissions.ts       # Permission definitions
│   ├── types.ts             # TypeScript type definitions
│   └── utils.ts             # Utility functions
│
├── pages/                   # Page components
│   ├── auth/               # Authentication pages
│   ├── dashboard/          # Dashboard page
│   ├── users/              # User management
│   ├── orders/             # Order management
│   ├── products/           # Product management
│   ├── package/            # Package management
│   ├── banners/            # Banner management
│   ├── brands/             # Brand management
│   ├── categories/         # Category management
│   ├── coverage-area/      # Coverage area management
│   ├── coupons/            # Coupon management
│   ├── delivery/           # Delivery management
│   ├── donations/          # Donation management
│   ├── coin-management/    # Coin system
│   ├── referrals/          # Referral program
│   ├── transactions/       # Transaction history
│   ├── reports/            # Reporting module
│   ├── notifications/      # Notification settings
│   ├── roles/              # Role management
│   ├── supports/           # Support tickets
│   ├── settings/           # System settings
│   └── profile/            # User profile
│
├── routes/
│   ├── index.tsx           # Route definitions
│   ├── PrivateRoute.tsx    # Protected route wrapper
│   └── PublicRoute.tsx     # Public route wrapper
│
├── services/               # API service layer
│   ├── authService.ts
│   ├── userService.ts
│   ├── productService.ts
│   ├── orderService.ts
│   ├── packageService.ts
│   ├── bannerService.ts
│   ├── brandService.ts
│   ├── categoryService.ts
│   ├── couponService.ts
│   ├── coverageAreaService.ts
│   ├── deliveryService.ts
│   ├── donationService.ts
│   ├── coinService.ts
│   ├── referralService.ts
│   ├── transactionService.ts
│   ├── reportService.ts
│   ├── notificationService.ts
│   ├── roleService.ts
│   ├── supportService.ts
│   ├── settingsService.ts
│   ├── dashboardService.ts
│   └── createApiService.ts  # Service factory
│
├── stores/                  # Zustand stores
│   ├── authStore.ts         # Authentication state
│   ├── sidebarStore.ts      # Sidebar state
│   ├── userStore.ts         # User management state
│   ├── productStore.ts      # Product state
│   ├── orderStore.ts        # Order state
│   ├── packageStore.ts      # Package state
│   ├── bannerStore.ts       # Banner state
│   ├── brandStore.ts        # Brand state
│   ├── categoryStore.ts     # Category state
│   ├── couponStore.ts       # Coupon state
│   ├── coinStore.ts         # Coin state
│   └── ... (other stores)
│
├── App.tsx                  # Root component
├── main.tsx                 # Entry point
├── index.css                # Global styles
└── vite-env.d.ts           # Vite type definitions
```

---

## 5. Setup & Installation

### 5.1 Prerequisites

Before starting, ensure you have the following installed:

| Software        | Minimum Version | Recommended | Download Link                                          |
| --------------- | --------------- | ----------- | ------------------------------------------------------ |
| **Node.js**     | 18.0.0          | 20.x LTS    | [nodejs.org](https://nodejs.org)                       |
| **npm**         | 9.0.0           | 10.x        | Included with Node.js                                  |
| **Git**         | 2.30.0          | Latest      | [git-scm.com](https://git-scm.com)                     |
| **Code Editor** | -               | VS Code     | [code.visualstudio.com](https://code.visualstudio.com) |

### 5.2 Installation Steps

#### Step 1: Clone the Repository

```bash
# Using HTTPS
git clone https://github.com/your-org/sukhran-admin-portal.git

# Or using SSH
git clone git@github.com:your-org/sukhran-admin-portal.git

# Navigate to project directory
cd sukhran-admin-portal
```

#### Step 2: Install Dependencies

```bash
# Using npm
npm install

# Or using bun (faster alternative)
bun install
```

#### Step 3: Environment Configuration

```bash
# Copy environment example file
cp .env.example .env

# Edit .env file with your configuration
# Use your preferred text editor
nano .env
# or
code .env
```

#### Step 4: Start Development Server

```bash
# Start Vite dev server
npm run dev

# Or with bun
bun run dev
```

The application will be available at:

- **Local:** `http://localhost:8080`
- **Network:** `http://[your-ip]:8080`

### 5.3 Available Scripts

```bash
# Development
npm run dev              # Start dev server on port 8080

# Production Build
npm run build            # Build for production
npm run build:dev        # Build with development mode

# Preview Production Build
npm run preview          # Preview production build locally

# Code Quality
npm run lint             # Run ESLint
```

### 5.4 Recommended VS Code Extensions

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "dsznajder.es7-react-js-snippets",
    "ms-vscode.vscode-typescript-next"
  ]
}
```

---

## 6. Environment Configuration

### 6.1 Environment Variables

Create a `.env` file in the root directory:

```bash
# API Configuration
VITE_API_BASE_URL=https://d2c.thevisitlondon.com/api
VITE_API_VERSION=/v1

# Application Configuration
VITE_APP_NAME=Shukran Admin Portal
VITE_APP_ENV=production

# Feature Flags (optional)
VITE_ENABLE_DEBUG=false
VITE_ENABLE_MOCK_DATA=false
```

### 6.2 Environment Files

| File               | Purpose                        | Usage                |
| ------------------ | ------------------------------ | -------------------- |
| `.env`             | Local development (gitignored) | Your personal config |
| `.env.example`     | Template for required vars     | Committed to repo    |
| `.env.production`  | Production environment         | Deployment specific  |
| `.env.development` | Development defaults           | Optional             |

### 6.3 Accessing Environment Variables

```typescript
// In TypeScript/JavaScript files
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
const apiVersion = import.meta.env.VITE_API_VERSION;

// Type-safe access (recommended)
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_API_VERSION: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

---

## 7. Authentication & Authorization

### 7.1 Authentication System

The portal uses **JWT (JSON Web Token)** based authentication with refresh token mechanism.

#### Login Flow

1. User submits credentials (email/password)
2. API validates and returns:
   - `access_token` (short-lived, ~15 minutes)
   - `refresh_token` (long-lived, ~7 days)
   - User data with permissions
3. Tokens stored in:
   - Zustand store (in-memory)
   - LocalStorage (persistent)

#### Token Refresh Flow

```typescript
// Automatic token refresh in apiClient.ts
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error?.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const newAccessToken = await refreshAccessToken();

      if (newAccessToken) {
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      }
    }

    return Promise.reject(error);
  },
);
```

### 7.2 Auth Store

```typescript
// src/stores/authStore.ts
interface AuthState {
  user: User | null;
  permissions: string[];
  isAuthenticated: boolean;
  access_token: string | null;
  refresh_token: string | null;
}

// Usage in components
const { user, isAuthenticated, permissions } = useAuthStore();
```

### 7.3 Protected Routes

```typescript
// PrivateRoute wrapper
<PrivateRoute>
  <Dashboard />
</PrivateRoute>

// Implementation
const PrivateRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
```

---

## 8. API Documentation

### 8.1 Base Configuration

```typescript
// Base URL
const API_BASE_URL = "https://d2c.thevisitlondon.com/api";
const API_VERSION = "/v1";

// Full URL construction
const fullUrl = `${API_BASE_URL}${API_VERSION}/admin/users`;
// Result: https://d2c.thevisitlondon.com/api/v1/admin/users
```

### 8.2 Request Headers

All authenticated requests include:

```http
Authorization: Bearer {access_token}
Content-Type: application/json
Accept: application/json
```

### 8.3 API Endpoints

#### Authentication Endpoints

| Method | Endpoint                | Description               |
| ------ | ----------------------- | ------------------------- |
| POST   | `/auth/login`           | User login                |
| POST   | `/auth/logout`          | User logout               |
| POST   | `/auth/refresh-token`   | Refresh access token      |
| POST   | `/auth/forgot-password` | Request password reset    |
| POST   | `/auth/reset-password`  | Reset password with token |
| POST   | `/auth/change-password` | Change current password   |
| GET    | `/auth/profile`         | Get current user profile  |
| PUT    | `/auth/profile`         | Update user profile       |

#### User Management

| Method | Endpoint                           | Description             |
| ------ | ---------------------------------- | ----------------------- |
| GET    | `/admin/users`                     | List all users          |
| GET    | `/admin/users/{id}`                | Get user by ID          |
| POST   | `/admin/users`                     | Create new user         |
| PUT    | `/admin/users/{id}`                | Update user             |
| DELETE | `/admin/users/{id}`                | Soft delete user        |
| DELETE | `/admin/users/{id}/force`          | Permanently delete user |
| POST   | `/admin/users/{id}/restore`        | Restore deleted user    |
| POST   | `/admin/users/{id}/toggle-status`  | Enable/disable user     |
| POST   | `/admin/users/{id}/reset-password` | Reset user password     |
| GET    | `/admin/users/statistics`          | Get user statistics     |

#### Product Management

| Method | Endpoint               | Description         |
| ------ | ---------------------- | ------------------- |
| GET    | `/admin/products`      | List all products   |
| GET    | `/admin/products/{id}` | Get product details |
| POST   | `/admin/products`      | Create new product  |
| PUT    | `/admin/products/{id}` | Update product      |
| DELETE | `/admin/products/{id}` | Delete product      |

#### Order Management

| Method | Endpoint                           | Description            |
| ------ | ---------------------------------- | ---------------------- |
| GET    | `/admin/orders`                    | List all orders        |
| GET    | `/admin/orders/{id}`               | Get order details      |
| PUT    | `/admin/orders/{id}/status`        | Update order status    |
| PUT    | `/admin/orders/{id}/assign-driver` | Assign delivery driver |
| PUT    | `/admin/orders/{id}/delivery-time` | Update delivery time   |
| POST   | `/admin/orders/{id}/cancel`        | Cancel order           |

#### Package Management

| Method | Endpoint                                            | Description                    |
| ------ | --------------------------------------------------- | ------------------------------ |
| GET    | `/admin/packages`                                   | List all packages              |
| GET    | `/admin/packages/{id}`                              | Get package details            |
| POST   | `/admin/packages`                                   | Create new package             |
| PUT    | `/admin/packages/{id}`                              | Update package                 |
| DELETE | `/admin/packages/{id}`                              | Delete package                 |
| GET    | `/admin/package-settings`                           | Get package settings           |
| PUT    | `/admin/package-settings/custom_package_min_amount` | Update min amount              |
| PUT    | `/admin/package-settings/custom_package_enabled`    | Enable/disable custom packages |

#### Category Management

| Method | Endpoint                                | Description         |
| ------ | --------------------------------------- | ------------------- |
| GET    | `/admin/categories`                     | List all categories |
| GET    | `/admin/categories/{id}`                | Get category by ID  |
| POST   | `/admin/categories`                     | Create category     |
| PUT    | `/admin/categories/{id}`                | Update category     |
| DELETE | `/admin/categories/{id}`                | Delete category     |
| POST   | `/admin/sub-categories`                 | Create subcategory  |
| GET    | `/admin/sub-categories?categoryId={id}` | Get subcategories   |
| PUT    | `/admin/sub-categories/{id}`            | Update subcategory  |
| DELETE | `/admin/sub-categories/{id}`            | Delete subcategory  |

#### Brand Management

| Method | Endpoint             | Description     |
| ------ | -------------------- | --------------- |
| GET    | `/admin/brands`      | List all brands |
| POST   | `/admin/brands`      | Create brand    |
| PUT    | `/admin/brands/{id}` | Update brand    |
| DELETE | `/admin/brands/{id}` | Delete brand    |

#### Coverage Area

| Method | Endpoint                                   | Description          |
| ------ | ------------------------------------------ | -------------------- |
| GET    | `/admin/coverage-areas`                    | List coverage areas  |
| POST   | `/admin/coverage-areas`                    | Create coverage area |
| PUT    | `/admin/coverage-areas/{id}`               | Update coverage area |
| DELETE | `/admin/coverage-areas/{id}`               | Delete coverage area |
| POST   | `/admin/coverage-areas/{id}/toggle-status` | Toggle area status   |
| POST   | `/admin/coverage-areas/bulk-action`        | Bulk operations      |

#### Coupon Management

| Method | Endpoint              | Description      |
| ------ | --------------------- | ---------------- |
| GET    | `/admin/coupons`      | List all coupons |
| POST   | `/admin/coupons`      | Create coupon    |
| PUT    | `/admin/coupons/{id}` | Update coupon    |
| DELETE | `/admin/coupons/{id}` | Delete coupon    |

#### Transaction Management

| Method | Endpoint                         | Description             |
| ------ | -------------------------------- | ----------------------- |
| GET    | `/admin/transactions`            | List transactions       |
| GET    | `/admin/transactions/{id}`       | Get transaction details |
| GET    | `/admin/transactions/statistics` | Transaction statistics  |

#### Coin Management

| Method | Endpoint                  | Description            |
| ------ | ------------------------- | ---------------------- |
| GET    | `/admin/coins`            | List coin transactions |
| POST   | `/admin/coins/send`       | Send coins to user     |
| GET    | `/admin/coins/statistics` | Coin statistics        |

#### Donation Management

| Method | Endpoint                        | Description             |
| ------ | ------------------------------- | ----------------------- |
| GET    | `/admin/donations`              | List donations          |
| GET    | `/admin/donation-channels`      | List donation channels  |
| POST   | `/admin/donation-channels`      | Create donation channel |
| PUT    | `/admin/donation-channels/{id}` | Update channel          |
| DELETE | `/admin/donation-channels/{id}` | Delete channel          |

#### Reports

| Method | Endpoint                        | Description           |
| ------ | ------------------------------- | --------------------- |
| GET    | `/admin/reports/transactions`   | Transaction report    |
| GET    | `/admin/reports/donations`      | Donation report       |
| GET    | `/admin/reports/coins`          | Coin report           |
| GET    | `/admin/reports/referrals`      | Referral report       |
| GET    | `/admin/reports/package-sales`  | Package sales report  |
| GET    | `/admin/reports/package-orders` | Package orders report |
| GET    | `/admin/reports/regular-sales`  | Regular sales report  |
| GET    | `/admin/reports/regular-orders` | Regular orders report |

### 8.4 API Request Examples

#### Login Request

```typescript
// Request
POST /auth/login
Content-Type: application/json

{
  "email": "admin@shukran.com",
  "password": "SecurePassword123"
}

// Response (Success - 200 OK)
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "name": "Admin User",
      "email": "admin@shukran.com",
      "role": {
        "id": 1,
        "name": "admin"
      },
      "permissions": [
        "users.view",
        "users.create",
        "products.view",
        // ... more permissions
      ]
    },
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}

// Response (Error - 401 Unauthorized)
{
  "success": false,
  "message": "Invalid credentials",
  "errors": []
}
```

#### Get Users with Pagination

```typescript
// Request
GET /admin/users?page=1&limit=20&search=john&status=active
Authorization: Bearer {access_token}

// Response
{
  "success": true,
  "data": {
    "users": [
      {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "+1234567890",
        "status": "active",
        "created_at": "2025-01-15T10:30:00Z"
      }
      // ... more users
    ],
    "pagination": {
      "current_page": 1,
      "per_page": 20,
      "total": 150,
      "total_pages": 8
    }
  }
}
```

#### Create Product

```typescript
// Request
POST /admin/products
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "name": "Premium Rice 5kg",
  "name_ar": "أرز فاخر 5 كجم",
  "description": "High quality basmati rice",
  "description_ar": "أرز بسمتي عالي الجودة",
  "price": 25.99,
  "stock": 100,
  "category_id": 5,
  "brand_id": 3,
  "images": ["image1.jpg", "image2.jpg"],
  "status": "active"
}

// Response
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "id": 123,
    "name": "Premium Rice 5kg",
    "slug": "premium-rice-5kg",
    // ... complete product data
  }
}
```

### 8.5 Error Handling

#### Standard Error Response

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": ["The email field is required"],
    "password": ["The password must be at least 8 characters"]
  }
}
```

#### HTTP Status Codes

| Code | Meaning               | Usage                    |
| ---- | --------------------- | ------------------------ |
| 200  | OK                    | Successful request       |
| 201  | Created               | Resource created         |
| 400  | Bad Request           | Invalid request data     |
| 401  | Unauthorized          | Authentication failed    |
| 403  | Forbidden             | Insufficient permissions |
| 404  | Not Found             | Resource not found       |
| 422  | Unprocessable Entity  | Validation errors        |
| 500  | Internal Server Error | Server error             |

---

## 9. State Management

### 9.1 Zustand Stores

The application uses Zustand for client-side state management.

#### Store Structure

```typescript
// Example: authStore.ts
interface AuthState {
  user: User | null;
  permissions: string[];
  isAuthenticated: boolean;
  access_token: string | null;
  refresh_token: string | null;
  setState: (state: Partial<AuthState>) => void;
}

export const useAuthStore = createStore<AuthState>(
  (set) => ({
    user: null,
    permissions: [],
    isAuthenticated: false,
    access_token: null,
    refresh_token: null,
    setState: (state: Partial<AuthState>) => {
      set({
        ...state,
        permissions: state.user?.permissions ?? [],
      });
    },
  }),
  "auth-storage", // LocalStorage key
  true, // Persist to localStorage
);
```

#### Available Stores

| Store              | File             | Purpose                     |
| ------------------ | ---------------- | --------------------------- |
| `useAuthStore`     | authStore.ts     | Authentication & user state |
| `useSidebarStore`  | sidebarStore.ts  | Sidebar collapse state      |
| `useUserStore`     | userStore.ts     | User management data        |
| `useProductStore`  | productStore.ts  | Product data cache          |
| `useOrderStore`    | orderStore.ts    | Order management            |
| `usePackageStore`  | packageStore.ts  | Package data                |
| `useBannerStore`   | bannerStore.ts   | Banner management           |
| `useBrandStore`    | brandStore.ts    | Brand data                  |
| `useCategoryStore` | categoryStore.ts | Category hierarchy          |
| `useCouponStore`   | couponStore.ts   | Coupon data                 |
| `useCoinStore`     | coinStore.ts     | Coin system state           |

### 9.2 TanStack Query (React Query)

Used for server state management, caching, and data fetching.

#### Query Example

```typescript
// Fetching users with caching
const { data, isLoading, error, refetch } = useQuery({
  queryKey: ["users", page, search],
  queryFn: () => userService.getAll({ page, search }),
  staleTime: 5 * 60 * 1000, // 5 minutes
  cacheTime: 10 * 60 * 1000, // 10 minutes
});
```

#### Mutation Example

```typescript
// Creating a new product
const createMutation = useMutation({
  mutationFn: (data: CreateProductDto) => productService.create(data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["products"] });
    toast.success("Product created successfully");
  },
  onError: (error) => {
    toast.error("Failed to create product");
  },
});
```

---

## 10. Key Features & Modules

### 10.1 Dashboard Module

**Location:** `src/pages/dashboard/`

**Features:**

- Real-time statistics (users, orders, revenue)
- Recent orders list
- Sales charts (daily, weekly, monthly)
- Quick actions panel

**Permissions Required:** `dashboard.view`

### 10.2 User Management

**Location:** `src/pages/users/`

**Features:**

- List all users with pagination
- Search and filter users
- Create/edit/delete users
- Toggle user status
- Reset user passwords
- View user details and order history

**Permissions:**

- `users.view` - View users
- `users.create` - Create users
- `users.update` - Edit users
- `users.delete` - Delete users

### 10.3 Product Management

**Location:** `src/pages/products/`

**Features:**

- Product listing with filters
- Create/edit products with variants
- Image upload and gallery
- Stock management
- Category and brand assignment
- SEO fields (meta title, description)
- Multi-language support

**Permissions:**

- `products.view`
- `products.create`
- `products.update`
- `products.delete`

### 10.4 Order Management

**Location:** `src/pages/orders/`

**Features:**

- Order listing with status filters
- Order details view
- Status updates (pending, processing, shipped, delivered)
- Assign delivery drivers
- Update delivery times
- Order cancellation
- Invoice generation

**Permissions:**

- `orders.view`
- `orders.update_status`
- `orders.update_delivery_time`
- `orders.assign_driver`
- `orders.cancel`

### 10.5 Package Management

**Location:** `src/pages/package/`

**Features:**

- Pre-built package creation
- Custom package settings
- Package product selection
- Pricing and discount management
- Package availability settings

**Permissions:**

- `packages.view`
- `packages.create`
- `packages.update`
- `packages.delete`

### 10.6 Category Management

**Location:** `src/pages/categories/`

**Features:**

- Hierarchical category structure
- Create main categories and subcategories
- Category reordering via drag-and-drop
- Category image uploads
- Multi-language support (English & Arabic names)
- Category status management (active/inactive)
- Bulk category operations
- Search and filter categories

**Permissions:**

- `categories.view` - View categories
- `categories.create` - Create categories
- `categories.update` - Edit categories
- `categories.delete` - Delete categories

**Key Functionality:**

- Parent-child category relationships
- Unlimited category depth
- Product count per category
- Category-based product filtering

### 10.7 Brand Management

**Location:** `src/pages/brands/`

**Features:**

- Brand listing with search
- Create and edit brands
- Brand logo uploads
- Brand reordering
- Brand status management
- Multi-language brand names
- Products count per brand
- Brand-based filtering

**Permissions:**

- `brands.view` - View brands
- `brands.create` - Create brands
- `brands.update` - Edit brands
- `brands.delete` - Delete brands
- `brands.reorder` - Reorder brands

**Key Functionality:**

- Brand logo management
- SEO-friendly brand slugs
- Integration with product catalog
- Brand performance analytics

### 10.8 Banner Management

**Location:** `src/pages/banners/`

**Features:**

- Banner listing and management
- Create promotional banners
- Image/video banner support
- Banner positioning control
- Click-through URL tracking
- Schedule banner display
- Banner reordering
- Device-specific banners (mobile/desktop)
- Multi-language banner content

**Permissions:**

- `banners.view` - View banners
- `banners.create` - Create banners
- `banners.update` - Edit banners
- `banners.delete` - Delete banners
- `banners.reorder` - Reorder banners

**Key Functionality:**

- Banner placement zones (home, category, product pages)
- Start/end date scheduling
- Click analytics
- A/B testing support
- Responsive image optimization

### 10.9 Coupon Management

**Location:** `src/pages/coupon/`

**Features:**

- Create discount coupons
- Coupon types (percentage, fixed amount, free shipping)
- Usage limits (per user, total uses)
- Expiration dates
- Minimum order amount requirements
- User/group restrictions
- Product/category specific coupons
- Auto-apply coupons
- Coupon code generation

**Permissions:**

- `coupons.view` - View coupons
- `coupons.create` - Create coupons
- `coupons.update` - Edit coupons
- `coupons.delete` - Delete coupons

**Key Functionality:**

- Bulk coupon generation
- Coupon usage analytics
- Stackable coupon rules
- First-time user discounts
- Referral-based coupons

### 10.10 Coverage Area Management

**Location:** `src/pages/coverage-area/`

**Features:**

- Define delivery/service areas
- Geographic zone mapping
- Set delivery charges per area
- Delivery time estimation per zone
- Toggle area availability
- Bulk area operations
- Area-based order restrictions
- Minimum order amount per area
- Multi-area support

**Permissions:**

- `coverage_areas.view` - View coverage areas
- `coverage_areas.create` - Create areas
- `coverage_areas.update` - Edit areas
- `coverage_areas.delete` - Delete areas
- `coverage_areas.toggle_status` - Enable/disable areas

**Key Functionality:**

- ZIP/postal code validation
- Area-based pricing rules
- Service availability calendar
- Delivery capacity management
- Coverage area analytics

### 10.11 Coin Management

**Location:** `src/pages/coin-management/`

**Features:**

- Loyalty coin system
- Send coins to users (rewards)
- View coin transactions history
- Coin usage statistics
- Coin balance management
- Coin expiration rules
- Coin-to-currency conversion rates
- Coin earning rules configuration
- Bulk coin distribution

**Permissions:**

- `coins.view` - View coin data
- `coins.manage` - Manage coin settings
- `coins.send` - Send coins to users
- `coins.view_transactions` - View coin transactions

**Key Functionality:**

- Automated coin rewards (order completion, referrals)
- Coin redemption in checkout
- Transaction history tracking
- Coin balance reports
- Loyalty tier system integration

### 10.12 Donation Management

**Location:** `src/pages/donations/`

**Features:**

- Track donations and contributions
- Donation channels management
- Multiple charity organization support
- Donation campaign creation
- Donation statistics and reporting
- Export donation reports
- Donor management
- Tax receipt generation
- Recurring donation setup

**Permissions:**

- `donations.view` - View donations
- `donations.create` - Create donation campaigns
- `donations.update` - Edit campaigns
- `donations.delete` - Delete campaigns
- `donations.manage_channels` - Manage donation channels

**Key Functionality:**

- Real-time donation tracking
- Donation goal progress
- Donor recognition system
- Integration with payment gateways
- Monthly/yearly donation summaries
- Charity partner management

### 10.13 Referral Management

**Location:** `src/pages/referrals/`

**Features:**

- Referral program management
- Referral code generation
- Track referral performance
- Referral rewards configuration
- Referrer and referee incentives
- Referral analytics and reports
- Social media sharing integration
- Multi-tier referral programs
- Referral link tracking

**Permissions:**

- `referrals.view` - View referral data
- `referrals.create` - Create referral programs
- `referrals.update` - Edit programs
- `referrals.manage_rewards` - Manage rewards

**Key Functionality:**

- Custom referral codes
- Automatic reward distribution
- Referral conversion tracking
- Top referrers leaderboard
- Referral campaign performance
- Social sharing widgets

### 10.14 Reports Module

**Location:** `src/pages/reports/`

**Available Reports:**

- **Transaction Report** - Financial transaction history
- **Package Sales Report** - Package-specific sales data
- **Package Orders Report** - Package order analytics
- **Regular Sales Report** - Non-package product sales
- **Regular Orders Report** - Standard order analytics
- **Donation Report** - Charity donation tracking
- **Coin Report** - Loyalty coin usage and distribution
- **Referral Report** - Referral program performance

**Features:**

- Date range filtering (daily, weekly, monthly, custom)
- Export to CSV/Excel/PDF
- Visual charts and graphs
- Summary statistics
- Comparison reports (period-over-period)
- Downloadable reports
- Scheduled report generation
- Email report delivery
- Real-time data updates

**Permissions:**

- `reports.view` - View all reports
- `reports.export` - Export reports
- `reports.schedule` - Schedule automated reports

**Key Functionality:**

- Revenue analytics
- Order fulfillment metrics
- Customer acquisition cost
- Product performance tracking
- Geographic sales distribution
- Payment method breakdown
- Return/refund analytics
- Customer lifetime value

### 10.15 Customer Support Management

**Location:** `src/pages/supports/`

**Features:**

- Support ticket system
- Create and manage tickets
- Ticket categorization (technical, billing, general)
- Priority levels (low, medium, high, urgent)
- Ticket status tracking (open, in-progress, resolved, closed)
- Internal notes and comments
- File attachments support
- Email notifications
- Support agent assignment
- Ticket search and filtering
- Response templates

**Permissions:**

- `support.view` - View support tickets
- `support.create` - Create tickets
- `support.update` - Update tickets
- `support.delete` - Delete tickets
- `support.assign` - Assign tickets to agents

**Key Functionality:**

- Automatic ticket numbering
- SLA (Service Level Agreement) tracking
- Customer communication history
- Ticket escalation workflow
- Support metrics dashboard
- Average response time tracking
- Customer satisfaction ratings

### 10.16 Delivery Management

**Location:** `src/pages/delivery/`

**Features:**

- Delivery personnel management
- Driver assignment to orders
- Delivery route optimization
- Real-time delivery tracking
- Delivery schedule management
- Driver performance metrics
- Delivery status updates
- Proof of delivery

**Permissions:**

- `delivery.view` - View delivery information
- `delivery.manage` - Manage deliveries
- `delivery.assign_driver` - Assign drivers to orders

**Key Functionality:**

- Driver availability tracking
- Delivery time slot management
- GPS tracking integration
- Delivery completion confirmation
- Failed delivery handling

### 10.17 Transaction Management

**Location:** `src/pages/transactions/`

**Features:**

- View all financial transactions
- Transaction history with filters
- Payment method breakdown
- Refund processing
- Transaction status tracking
- Payment gateway integration logs
- Failed transaction analysis
- Revenue reconciliation

**Permissions:**

- `transactions.view` - View transactions
- `transactions.manage` - Manage transactions
- `transactions.refund` - Process refunds

**Key Functionality:**

- Multi-currency support
- Payment gateway reconciliation
- Automated refund processing
- Transaction export functionality
- Financial reporting integration

### 10.18 Role & Permission Management

**Location:** `src/pages/roles/`

**Features:**

- Create custom roles
- Assign permissions to roles
- View role details
- Edit role permissions
- Role-based access control (RBAC)
- Permission grouping by modules
- Role duplication
- User assignment to roles

**Permissions:**

- `roles.view` - View roles
- `roles.create` - Create roles
- `roles.update` - Edit roles
- `roles.delete` - Delete roles
- `roles.assign_permissions` - Assign permissions

**Key Functionality:**

- Granular permission control
- Super admin role with full access
- Pre-defined role templates
- Permission inheritance
- Audit trail for permission changes

### 10.19 Notification System

**Location:** `src/pages/notifications/`

**Features:**

- Send push notifications
- Notification templates
- Scheduled notifications
- Target user segments
- Email notifications
- SMS notifications
- In-app notifications
- Notification history
- Delivery status tracking

**Permissions:**

- `notifications.view` - View notifications
- `notifications.create` - Create notifications
- `notifications.send` - Send notifications
- `notifications.schedule` - Schedule notifications

**Key Functionality:**

- User segmentation for targeted messaging
- Dynamic content personalization
- Multi-channel notification delivery
- A/B testing for notification content
- Notification analytics and open rates
- Template library management

### 10.20 Settings & Configuration

**Location:** `src/pages/settings/`

**Features:**

- System-wide settings management
- Application configuration
- Email server settings
- Payment gateway configuration
- Tax and shipping settings
- Currency management
- Language preferences
- Theme customization
- Maintenance mode
- API key management

**Permissions:**

- `settings.view` - View settings
- `settings.update` - Update settings
- `settings.manage` - Full settings access

**Key Functionality:**

- Global configuration management
- Integration settings (payment, shipping, email)
- Business rules configuration
- System health monitoring
- Backup and restore settings

---

## 11. Routing System

### 11.1 Route Configuration

All routes are defined in `src/routes/index.tsx`.

### 11.2 Route Types

#### Public Routes

- `/login` - Login page
- `/forgot-password` - Password reset request

#### Protected Routes (Require Authentication)

All routes under `/*` are protected and require authentication.

### 11.3 Dynamic Routes

```typescript
// Product routes
/products              // List products
/products/create       // Create product
/products/edit/:id     // Edit product (dynamic ID)
/products/view/:id     // View product details

// Package routes
/packages              // List packages
/packages/create       // Create package
/packages/edit/:id     // Edit package
/packages/view/:id     // View package details

// Report routes
/reports/transactions  // Transaction report
/reports/package-sales // Package sales report
// ... more report routes
```

### 11.4 Navigation Guards

```typescript
// PrivateRoute - Requires authentication
<PrivateRoute>
  <Dashboard />
</PrivateRoute>

// PublicRoute - Redirects to dashboard if authenticated
<PublicRoute>
  <Login />
</PublicRoute>
```

### 11.5 Dynamic Page Titles

Page titles automatically update based on the current route:

```typescript
// Example titles:
"Dashboard | Shukran Store";
"Orders | Shukran Store";
"Edit Product | Shukran Store";
```

Implementation: `src/hooks/use-page-title.ts`

---

## 12. Permission System

### 12.1 Permission Structure

Permissions follow the format: `{module}.{action}`

Examples:

- `users.view` - View users
- `users.create` - Create users
- `products.update` - Update products
- `orders.delete` - Delete orders

### 12.2 Permission Definitions

All permissions are centrally defined in `src/lib/permissions.ts`:

```typescript
const permissions = {
  users: {
    view: "users.view",
    create: "users.create",
    edit: "users.update",
    delete: "users.delete",
  },
  products: {
    view: "products.view",
    create: "products.create",
    edit: "products.update",
    delete: "products.delete",
  },
  // ... more modules
};
```

### 12.3 Checking Permissions

#### In Components

```typescript
import { usePermissions } from '@/hooks/use-permissions';
import { permissions } from '@/lib/permissions';

function UserList() {
  const { hasPermission } = usePermissions();

  return (
    <div>
      {hasPermission(permissions.users.view) && (
        <UserTable />
      )}

      {hasPermission(permissions.users.create) && (
        <Button>Create User</Button>
      )}
    </div>
  );
}
```

#### Using HOC

```typescript
import { withPermission } from '@/hoc/withPermission';
import { permissions } from '@/lib/permissions';

const UserManagement = () => {
  return <div>User Management Content</div>;
};

export default withPermission(
  UserManagement,
  permissions.users.view
);
```

### 12.4 Super Admin Bypass

Users with `super_admin` role automatically have all permissions:

```typescript
// In use-permissions.ts
export const usePermissions = () => {
  const user = useAuthStore((state) => state.user);

  const hasPermission = (permission: string): boolean => {
    // Super admin has all permissions
    if (user?.role?.name === "super_admin") {
      return true;
    }

    // Check specific permission
    return user?.permissions?.includes(permission) ?? false;
  };

  return { hasPermission };
};
```

### 12.5 Permission Best Practices

1. **Always check permissions** before rendering UI elements
2. **Backend validation** - Frontend checks are for UX; backend must validate
3. **Use permission constants** - Never hardcode permission strings
4. **Granular permissions** - Separate view, create, edit, delete permissions
5. **Document permissions** - Keep PERMISSIONS_GUIDE.md updated

---

## 13. Component Library

### 13.1 UI Components (shadcn/ui)

The project uses shadcn/ui components based on Radix UI primitives.

#### Available Components

| Component     | Location                          | Usage                 |
| ------------- | --------------------------------- | --------------------- |
| Button        | `components/ui/button.tsx`        | Buttons with variants |
| Input         | `components/ui/input.tsx`         | Form inputs           |
| Select        | `components/ui/select.tsx`        | Dropdown selects      |
| Dialog        | `components/ui/dialog.tsx`        | Modal dialogs         |
| Table         | `components/ui/table.tsx`         | Data tables           |
| Card          | `components/ui/card.tsx`          | Content cards         |
| Badge         | `components/ui/badge.tsx`         | Status badges         |
| Alert         | `components/ui/alert.tsx`         | Alert messages        |
| Toast         | `components/ui/sonner.tsx`        | Toast notifications   |
| Form          | `components/ui/form.tsx`          | Form wrapper          |
| Tabs          | `components/ui/tabs.tsx`          | Tab navigation        |
| Dropdown Menu | `components/ui/dropdown-menu.tsx` | Dropdown menus        |
| Popover       | `components/ui/popover.tsx`       | Popovers              |
| Switch        | `components/ui/switch.tsx`        | Toggle switches       |
| Checkbox      | `components/ui/checkbox.tsx`      | Checkboxes            |
| Radio Group   | `components/ui/radio-group.tsx`   | Radio buttons         |
| Calendar      | `components/ui/calendar.tsx`      | Date picker           |

### 13.2 Custom Components

#### Layout Components

```typescript
// MainLayout - Main application layout
<MainLayout>
  <Outlet />
</MainLayout>

// Sidebar - Navigation sidebar
<Sidebar />

// Header - Top header bar
<Header />
```

#### Utility Components

```typescript
// SuspenseWrapper - Lazy loading wrapper
<SuspenseWrapper>
  <LazyComponent />
</SuspenseWrapper>

// RouteChangeListener - Handles route changes
<RouteChangeListener />

// NoPermission - Permission denied message
<NoPermission />

// LoadingBar - Page loading indicator
<LoadingBar />
```

### 13.3 Component Patterns

#### Form Component Pattern

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
});

function UserForm() {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      email: '',
    },
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
```

#### Table Component Pattern

```typescript
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';

function UserTable({ users }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>
              <Button size="sm">Edit</Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
```

---

## 14. Internationalization (i18n)

### 14.1 Configuration

The application supports English and Arabic languages using i18next.

**Config file:** `src/i18n/config.ts`

### 14.2 Translation Files

```
src/i18n/locales/
├── en/
│   ├── common.json
│   ├── auth.json
│   ├── users.json
│   ├── products.json
│   └── ...
└── ar/
    ├── common.json
    ├── auth.json
    ├── users.json
    ├── products.json
    └── ...
```

### 14.3 Usage in Components

```typescript
import { useTranslation } from 'react-i18next';

function UserList() {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div>
      <h1>{t('users.title')}</h1>
      <p>{t('users.description')}</p>

      <button onClick={() => changeLanguage('ar')}>
        العربية
      </button>
      <button onClick={() => changeLanguage('en')}>
        English
      </button>
    </div>
  );
}
```

### 14.4 Translation File Example

```json
// en/users.json
{
  "title": "User Management",
  "description": "Manage system users",
  "createUser": "Create User",
  "editUser": "Edit User",
  "deleteUser": "Delete User",
  "fields": {
    "name": "Name",
    "email": "Email",
    "phone": "Phone",
    "status": "Status"
  }
}

// ar/users.json
{
  "title": "إدارة المستخدمين",
  "description": "إدارة مستخدمي النظام",
  "createUser": "إنشاء مستخدم",
  "editUser": "تعديل المستخدم",
  "deleteUser": "حذف المستخدم",
  "fields": {
    "name": "الاسم",
    "email": "البريد الإلكتروني",
    "phone": "الهاتف",
    "status": "الحالة"
  }
}
```

---

## 15. Build & Deployment

### 15.1 Production Build

```bash
# Build for production
npm run build

# Output directory
# dist/
```

### 15.2 Build Configuration

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    outDir: "dist",
    sourcemap: false,
    minify: "terser",
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          "ui-vendor": [
            "@radix-ui/react-dialog",
            "@radix-ui/react-dropdown-menu",
          ],
        },
      },
    },
  },
});
```

### 15.3 Deployment Options

#### Option 1: Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod
```

**netlify.toml:**

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### Option 2: Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

**vercel.json:**

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

#### Option 3: AWS S3 + CloudFront

```bash
# Build project
npm run build

# Upload to S3
aws s3 sync dist/ s3://your-bucket-name

# Invalidate CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id YOUR_DIST_ID \
  --paths "/*"
```

#### Option 4: Docker

```dockerfile
# Dockerfile
FROM node:20-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 15.4 Environment Variables for Deployment

```bash
# Production
VITE_API_BASE_URL=https://api.production.com
VITE_API_VERSION=/v1
VITE_APP_ENV=production

# Staging
VITE_API_BASE_URL=https://api.staging.com
VITE_API_VERSION=/v1
VITE_APP_ENV=staging
```

### 15.5 CI/CD Pipeline Example

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "20"

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build
        env:
          VITE_API_BASE_URL: ${{ secrets.API_BASE_URL }}

      - name: Deploy to Netlify
        uses: netlify/actions/cli@master
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
        with:
          args: deploy --prod
```

---

## 16. Performance Optimization

### 16.1 Code Splitting

```typescript
// Lazy load pages
const Dashboard = lazy(() => import('@/pages/dashboard/Dashboard'));
const Users = lazy(() => import('@/pages/users/Users'));

// Wrap with Suspense
<Suspense fallback={<LoadingBar />}>
  <Dashboard />
</Suspense>
```

### 16.2 Image Optimization

```typescript
// Use WebP format
<img src="image.webp" alt="Product" loading="lazy" />

// Responsive images
<picture>
  <source srcset="image-small.webp" media="(max-width: 600px)" />
  <source srcset="image-large.webp" media="(min-width: 601px)" />
  <img src="image.jpg" alt="Fallback" />
</picture>
```

### 16.3 React Query Optimization

```typescript
// Stale time & cache time
useQuery({
  queryKey: ["users"],
  queryFn: fetchUsers,
  staleTime: 5 * 60 * 1000, // 5 minutes
  cacheTime: 10 * 60 * 1000, // 10 minutes
});

// Prefetch data
queryClient.prefetchQuery({
  queryKey: ["products"],
  queryFn: fetchProducts,
});
```

### 16.4 Bundle Size Optimization

```bash
# Analyze bundle size
npm run build -- --analyze

# Check chunk sizes
du -sh dist/assets/*
```

### 16.5 Performance Best Practices

1. **Lazy load routes** - Use React.lazy for all pages
2. **Optimize images** - Use WebP, lazy loading
3. **Minimize bundle size** - Code splitting, tree shaking
4. **Cache API responses** - Use React Query effectively
5. **Debounce search inputs** - Reduce API calls
6. **Virtual scrolling** - For large lists
7. **Memoize expensive computations** - Use useMemo, useCallback

---

## 17. Testing Guidelines

### 17.1 Testing Strategy

```bash
# Install testing dependencies
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

### 17.2 Unit Testing

```typescript
// Example: userService.test.ts
import { describe, it, expect } from "vitest";
import { userService } from "@/services/userService";

describe("User Service", () => {
  it("should fetch users", async () => {
    const users = await userService.getAll();
    expect(users).toBeDefined();
    expect(Array.isArray(users.data)).toBe(true);
  });
});
```

### 17.3 Component Testing

```typescript
// Example: Button.test.tsx
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/ui/button';

describe('Button Component', () => {
  it('renders button with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
});
```

### 17.4 Testing Checklist

- [ ] All API services have unit tests
- [ ] Critical components have tests
- [ ] Form validation is tested
- [ ] Permission system is tested
- [ ] Error handling is tested
- [ ] Edge cases are covered

---

## 18. Known Issues & Troubleshooting

### 18.1 Common Issues

#### Issue 1: Token Refresh Loop

**Symptom:** Infinite API calls to refresh token endpoint

**Solution:**

```typescript
// Check apiClient.ts for proper retry handling
if (!originalRequest._retry) {
  originalRequest._retry = true;
  // ... refresh logic
}
```

#### Issue 2: Permission Check Fails

**Symptom:** User can't access page despite having permission

**Solution:**

1. Check if permissions are loaded in authStore
2. Verify permission string matches exactly
3. Check if super_admin bypass is working

```typescript
// Debug permissions
console.log(useAuthStore.getState().permissions);
```

#### Issue 3: Build Fails

**Symptom:** `npm run build` fails

**Common Causes:**

- TypeScript errors
- Missing environment variables
- Import errors

**Solution:**

```bash
# Check TypeScript errors
npx tsc --noEmit

# Check for missing deps
npm install

# Clear cache
rm -rf node_modules/.vite
npm run build
```

#### Issue 4: 401 Errors After Deployment

**Symptom:** Authentication fails in production

**Solution:**

1. Verify VITE_API_BASE_URL is correct
2. Check CORS settings on backend
3. Verify tokens are being stored
4. Check if cookies are set with correct domain

### 18.2 Debugging Tips

```typescript
// Enable debug mode
localStorage.setItem("debug", "true");

// Log all API requests
axiosInstance.interceptors.request.use((config) => {
  console.log("API Request:", config);
  return config;
});

// Monitor state changes
useAuthStore.subscribe((state) => {
  console.log("Auth State:", state);
});
```

### 18.3 Browser Compatibility

| Browser | Minimum Version  | Notes              |
| ------- | ---------------- | ------------------ |
| Chrome  | 90+              | Fully supported    |
| Firefox | 88+              | Fully supported    |
| Safari  | 14+              | Fully supported    |
| Edge    | 90+              | Fully supported    |
| IE      | ❌ Not supported | Use modern browser |

---

## 19. Best Practices

### 19.1 Code Style

```typescript
// Use TypeScript interfaces
interface User {
  id: number;
  name: string;
  email: string;
}

// Use arrow functions
const fetchUsers = async (): Promise<User[]> => {
  const response = await userService.getAll();
  return response.data;
};

// Use destructuring
const { data, isLoading, error } = useQuery(["users"], fetchUsers);

// Use optional chaining
const userName = user?.name ?? "Unknown";
```

### 19.2 Component Organization

```typescript
// 1. Imports
import React from 'react';
import { useQuery } from '@tanstack/react-query';

// 2. Types/Interfaces
interface Props {
  userId: number;
}

// 3. Component
export function UserDetail({ userId }: Props) {
  // 4. Hooks
  const { data } = useQuery(['user', userId], () => fetchUser(userId));

  // 5. Event handlers
  const handleDelete = () => {
    // ...
  };

  // 6. Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
}
```

### 19.3 Git Commit Messages

```bash
# Format: <type>: <subject>

# Types:
feat: Add new user management feature
fix: Fix login redirect issue
docs: Update API documentation
style: Format code with prettier
refactor: Refactor user service
test: Add user service tests
chore: Update dependencies
```

### 19.4 File Naming Conventions

```
# Components (PascalCase)
UserList.tsx
ProductCard.tsx

# Hooks (camelCase with use- prefix)
use-permissions.ts
use-api-controller.ts

# Services (camelCase with Service suffix)
userService.ts
productService.ts

# Stores (camelCase with Store suffix)
authStore.ts
userStore.ts

# Types (camelCase or PascalCase)
types.ts
UserTypes.ts
```

---

## 20. Contributing Guidelines

### 20.1 Development Workflow

1. **Create a branch**

   ```bash
   git checkout -b feature/user-export
   ```

2. **Make changes**
   - Write code
   - Add tests
   - Update documentation

3. **Commit changes**

   ```bash
   git add .
   git commit -m "feat: Add user export functionality"
   ```

4. **Push to remote**

   ```bash
   git push origin feature/user-export
   ```

5. **Create Pull Request**
   - Describe changes
   - Link related issues
   - Request reviews

### 20.2 Code Review Checklist

- [ ] Code follows style guide
- [ ] TypeScript types are correct
- [ ] No console.log statements
- [ ] Error handling is proper
- [ ] Permissions are checked
- [ ] Responsive design works
- [ ] i18n translations added
- [ ] Documentation updated

### 20.3 Pull Request Template

```markdown
## Description

Brief description of changes

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing

- [ ] Unit tests pass
- [ ] Manual testing done
- [ ] Tested in multiple browsers

## Screenshots

(If applicable)

## Related Issues

Fixes #123
```

---

## 📞 Support & Contact

For technical support or questions:

- **Email:** dev@shukran.com
- **Documentation:** [PERMISSIONS_GUIDE.md](./PERMISSIONS_GUIDE.md), [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)
- **Issue Tracker:** GitHub Issues

---

## 📄 License

© 2026 Shukran Store. All rights reserved.

---

**Document Version:** 1.0.0
**Last Updated:** January 26, 2026
**Maintained By:** Techtrioz Development Team
