# Calculus OOM Frontend

A Next.js frontend application for the Calculus Out-of-Memory management system.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict mode)
- **Package Manager**: npm
- **UI**: React 18
- **HTTP Client**: Axios

## Architecture

This project follows a strict layered architecture:

```
front/
├── app/           # Routing and page composition (Next.js App Router)
├── components/    # UI components (presentation)
├── hooks/         # State management and client-side logic
├── services/      # API communication layer
├── types/         # TypeScript types and interfaces
├── config/        # Configuration constants
├── styles/        # Global styles
└── public/        # Static assets
```

### Layer Responsibilities

- **app/**: Route definitions, layout, server orchestration
- **components/**: Pure UI rendering, presentation mapping
- **hooks/**: Client state, UI interactions, data fetching coordination
- **services/**: API adapters, DTO normalization, workflows

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
cd front
npm install
```

### Environment Setup

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Configure environment variables in `.env`:
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v0.1/Calculus_oom/Calculus_metadata
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

### Build

```bash
npm run build
npm start
```

### Type Checking

```bash
npm run type-check
```

### Linting

```bash
npm run lint
```

## Project Structure Details

### Services Layer

All backend communication goes through the services layer:

- `services/clients/`: HTTP client configuration
- `services/api/`: Resource-specific API adapters
- `services/workflows/`: Multi-API orchestration

### Hooks Layer

Custom hooks for state management:

- `hooks/base/`: Reusable base hooks (useAsync, usePagination, etc.)
- `hooks/feature/`: Page/feature-specific hooks

### Components Layer

UI components organized by type:

- Base components: Button, Input, Modal, Table, etc.
- Feature components: StudentList, ScoreForm, TestPanel, etc.

## API Integration

This frontend integrates with the Django backend API. See `/prompt/FRONTEND_to_backend_API_RULES.md` for complete API documentation.

### Key API Endpoints

- **Students**: `/Student_MetadataWriter/`
- **Scores**: `/Score_MetadataWriter/`
- **Tests**: `/Test_MetadataWriter/`
- **Files**: `/test-filedata/`

## Development Guidelines

### Import Rules

- `app/` can import from: components, hooks, services, types, config
- `components/` can import from: hooks (feature only), types, config
- `hooks/` can import from: services, types, config
- `services/` can import from: types, config ONLY

### Naming Conventions

- **Services**: `getX`, `listX`, `createX`, `updateX`, `deleteX`
- **Hooks**: `useAsync*`, `usePagination*`, `useXxxPage`
- **Components**: `PascalCase` (Button, StudentList, etc.)

### Server vs Client Components

- Default: Server Components (better performance, SEO)
- Use `"use client"` for: state, effects, browser APIs, event handlers

## License

MIT
