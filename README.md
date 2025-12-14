Project Overview

The project comprise of modern React + TypeScript designed for rapid prototyping, live reloading, and rich developer feedback.
It combines a Vite-based dev server, visual hot reload indicators, custom error overlays, and a Stripe integration layer to help you build and iterate quickly.
Features

    Vite-powered dev server with fast hot module replacement (HMR)

    React + TypeScript UI with strongly-typed components

    Visual hot reload toasts that reflect the current sandbox/codegen state

    Custom error overlay that surfaces runtime issues directly in the browser

    Stripe helper client for common checkout, billing, and subscription flows

    Small, focused utilities for fetch, auth, and sandbox state management

Tech Stack

    Language: TypeScript

    Framework: React

    Dev Server/Bundler: Vite

    State Management: Zustand (sandbox/HMR store)

    Notifications: Sonner (toast system)

    Payments: Stripe SDK with a custom wrapper

    Tooling: Custom dev error overlay and dev-server heartbeat hook

Getting Started

    Clone or download this repository.

    Ensure you have Node.js (LTS) and npm installed.

    Install dependencies:

bash
npm install

Start the development server:

    bash
    npm run dev

    Open the printed URL (usually http://localhost:5173) in your browser.

When you edit components, the app reloads automatically and shows a toast indicating update success or failure.
If an error occurs, the dev error overlay appears with details and quick actions.
Environment Variables

Create an .env file in the project root and configure values such as:

    CREATETEMP_API_KEY – API key for backend or Stripe helper.

    NEXT_PUBLIC_PROJECT_GROUP_ID – Project/group identifier used in API calls.

    NEXT_PUBLIC_CREATE_API_BASE_URL – Base URL for backend endpoints.

Do not commit real secrets to version control; use environment-specific files or your platform’s secret manager.
Project Structure (Suggested)

    src/HotReload.tsx – React component that listens to HMR events and shows status toasts.

    src/hmr-sandbox-store.ts – Zustand store modeling sandbox/codegen states.

    src/dev-error-overlay.js – In-browser error overlay for development.

    src/useDevServerHeartbeat.ts – Hook to track dev-server health.

    src/PolymorphicComponent.tsx – Utility for building polymorphic, typed components.

    src/stripe.ts – Stripe helper client wrapping common Stripe API operations.

    src/fetch.ts – Shared fetch helper for backend communication.

    create.js, client.d.ts, global.d.ts – Auth wiring and global TypeScript declarations.

You can adjust the structure as the project grows, but this layout keeps responsibilities clear and discoverable.
Available Scripts

    npm run dev – Start the Vite dev server in development mode.

    npm run build – Create a production build.

    npm run preview – Preview the production build locally.

    Additional scripts (tests, linting, type checking) can be added as needed.

Development Workflow

    Implement or update components and utilities in src.

    Use hot reload to get instant feedback while coding.

    Monitor the toast notifications and error overlay to quickly spot issues.

    Use the Stripe helper functions to interact with payments without duplicating boilerplate.

Contributing

    Fork this repository.

    Create a feature branch.

    Commit your changes with clear messages.

    Open a pull request describing what you changed and how to test it.
