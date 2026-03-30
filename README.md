# Sukhran Admin Portal

Admin dashboard application built with React, TypeScript, Vite, and Tailwind CSS.

## Overview

This project provides a modular admin portal architecture with:

- Feature-based pages under `src/pages`
- Reusable UI components under `src/components`
- API service layer under `src/services`
- Zustand stores under `src/stores`
- Route guards and app routing under `src/routes`
- Internationalization support under `src/i18n`

## Tech Stack

- React 18
- TypeScript
- Vite 5
- Tailwind CSS
- shadcn/ui + Radix UI
- Zustand
- TanStack Query
- React Router
- Axios

## Prerequisites

- Node.js 18+ (recommended)
- npm 9+ (or compatible package manager)

## Getting Started

1. Clone the repository.
2. Install dependencies.
3. Start the development server.

```bash
git clone <your-repository-url>
cd sukhran-admin-portal
npm install
npm run dev
```

The app will be available at the local URL printed by Vite (commonly `http://localhost:5173`).

## Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build production bundle
- `npm run build:dev`: Build in development mode
- `npm run preview`: Preview production build locally
- `npm run lint`: Run ESLint checks

## Project Structure

```text
src/
	api/          # API client and route constants
	components/   # Shared UI and feature components
	data/         # Mock or static data
	hoc/          # Higher-order components
	hooks/        # Reusable React hooks
	i18n/         # Translation config and locale files
	lib/          # Shared utilities, constants, and types
	pages/        # Feature pages and modules
	routes/       # Public/private route wrappers and routing
	services/     # API service modules by domain
	stores/       # Zustand stores
```

## Build and Deployment

To create a production-ready build:

```bash
npm run build
```

Build output is generated in the `dist/` directory and can be deployed to any static hosting provider.

## Documentation

Additional project docs are available at the repository root:

- `TECHNICAL_DOCUMENTATION.md`
- `DESIGN_SYSTEM.md`
- `USER_MANUAL.md`
- `PERMISSIONS_GUIDE.md`
- `STATUSVIEW_GUIDE.md`

## Contributing

1. Create a feature branch.
2. Make your changes.
3. Run linting and build checks.
4. Open a pull request.
