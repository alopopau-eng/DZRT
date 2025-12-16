# DZRT - Premium Nicotine Pouches E-Commerce

## Overview

DZRT is an Arabic-first e-commerce platform for premium nicotine pouches. The application features a modern dark-themed design with RTL (right-to-left) support, product catalog, shopping cart functionality, and checkout flow. Built as a full-stack TypeScript application with React frontend and Express backend.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack React Query for server state, React Context for cart state
- **Styling**: Tailwind CSS with custom CSS variables for theming, dark mode by default
- **UI Components**: shadcn/ui component library (New York style) with Radix UI primitives
- **Animations**: Framer Motion for page transitions and micro-interactions
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Framework**: Express.js running on Node.js
- **Language**: TypeScript with ESM modules
- **API Design**: RESTful JSON API with `/api` prefix
- **Database**: PostgreSQL with Drizzle ORM
- **Schema Validation**: Zod schemas generated from Drizzle schema using drizzle-zod

### Data Storage
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Location**: `shared/schema.ts` contains all database table definitions
- **Migrations**: Managed via `drizzle-kit push` command
- **Tables**: users, products, orders, orderItems

### Project Structure
```
├── client/           # React frontend
│   ├── src/
│   │   ├── components/   # UI components (layout, home, ui)
│   │   ├── pages/        # Route pages (Home, Products, Checkout)
│   │   ├── lib/          # Utilities, cart context, query client
│   │   └── hooks/        # Custom React hooks
├── server/           # Express backend
│   ├── index.ts      # Server entry point
│   ├── routes.ts     # API route definitions
│   ├── storage.ts    # Database access layer
│   ├── db.ts         # Database connection
│   └── seed.ts       # Sample data seeding
├── shared/           # Shared code between client/server
│   └── schema.ts     # Drizzle database schema and Zod types
```

### Build System
- **Development**: Vite dev server for frontend with HMR, tsx for backend
- **Production**: Custom build script using esbuild for server bundling, Vite for client
- **Output**: Combined into `dist/` directory with static files in `dist/public`

### Key Design Decisions

1. **Monorepo Structure**: Client and server share types via `shared/` directory, eliminating type duplication
2. **RTL-First Design**: HTML set to `dir="rtl"` with Arabic as primary language, using Cairo and Tajawal fonts
3. **Dark Theme Default**: Application uses dark mode by default with green primary accent color
4. **Cart Persistence**: Shopping cart stored in localStorage for session persistence
5. **Type Safety**: End-to-end TypeScript with Zod validation ensuring runtime type safety

## External Dependencies

### Database
- **PostgreSQL**: Primary database, connection via `DATABASE_URL` environment variable
- **Drizzle ORM**: Type-safe database queries and schema management

### UI/Styling
- **Tailwind CSS v4**: Utility-first CSS framework with `@tailwindcss/vite` plugin
- **Radix UI**: Accessible component primitives (dialog, dropdown, toast, etc.)
- **Lucide React**: Icon library

### Frontend Libraries
- **TanStack Query**: Server state management and caching
- **Framer Motion**: Animation library
- **React Hook Form**: Form state management
- **Wouter**: Lightweight React router

### Replit-Specific
- **@replit/vite-plugin-runtime-error-modal**: Error overlay for development
- **@replit/vite-plugin-cartographer**: Development tooling
- **@replit/vite-plugin-dev-banner**: Development environment indicator