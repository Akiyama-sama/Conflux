```
# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
AI+暴雨防涝的智能化平台 (AI + Flood Prevention Intelligent Platform) - a frontend-only implementation focused on flood monitoring and prevention.

## Tech Stack
- **Framework**: React 19 + Vite + TypeScript
- **Routing**: TanStack Router (file-based routing)
- **State Management**: Zustand
- **Map**: MapBox GL (requires API token)
- **UI**: Tailwind CSS + Shadcn UI components
- **AI**: AI SDK (OpenAI), use-chat hook for chat functionality

## Common Commands
```bash
# Install dependencies
pnpm install

# Start development server
pnpm run dev

# Start production server (port 3000)
pnpm run start

# Build for production
pnpm run build

# Preview production build
pnpm run serve

# Run tests
pnpm run test

# Lint
pnpm run lint

# Format
pnpm run format

# Check (format + lint)
pnpm run check
```

## Project Structure
```
src/
├── assets/          # Static assets (icons, images)
│   ├── brand-icons/ # Brand icon components
│   └── custom/      # Custom application icons
├── components/      # Shared components
│   └── ui/          # Shadcn UI components
├── data/            # Global data
├── feature/         # Feature-based architecture
│   └── index/       # Main map feature
│       ├── component/ # Feature-specific components
│       ├── data/      # Feature-specific data
│       └── store/     # Feature-specific stores
├── hooks/           # Shared hooks (zustand stores, custom hooks)
├── lib/             # Utility functions
├── routes/          # TanStack Router routes
└── styles.css       # Global styles
```

## Key Configuration
- **MapBox Token**: Required for map functionality. Create `.env` file from `.env.example` and add `VITE_MAPBOX_ACCESS_TOKEN`.
- **Environment**: Uses Vite for environment variables (prefix with `VITE_`).

## Core Features
1. **Map System**: MapBox GL integration with custom markers and layers
2. **Sensor Monitoring**: Sensor data visualization on map
3. **AI Chatbot**: Integrated AI assistant for flood-related queries
4. **Timeline**: Time-based data visualization
5. **Sidebar**: Feature navigation and settings
6. **Notification System**: Toast notifications for alerts

## Important Files
- `src/feature/index/index.tsx`: Main map component and application entry point
- `src/hooks/*.tsx`: Zustand stores for global state
- `src/components/map.tsx`: Map-related utilities
- `src/feature/index/component/chatbot/`: AI chatbot implementation

## Development Tips
- Follow feature-based architecture for new components and functionality
- Use Zustand for global state management
- All environment variables must be prefixed with `VITE_`
- MapBox API token is required for local development
- always response in chinese