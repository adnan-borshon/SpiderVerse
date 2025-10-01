# NASA Farm Navigators - Educational Farming Simulation

## Overview

NASA Farm Navigators is a 3D educational farming simulation game designed for the NASA Space Apps Challenge. The application teaches players how to use real NASA satellite data tools (SMAP, MODIS, Flood Pathfinder) to make informed farming decisions. Players manage a wheat farm through multiple stages, learning to interpret satellite data and apply it to agricultural scenarios.

The game features an interactive 3D farm environment built with Three.js/React Three Fiber, integrating real NASA data visualization tools to demonstrate practical applications of space technology in agriculture.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Core Technology Stack:**
- React 18 with TypeScript for UI components and application logic
- React Three Fiber (@react-three/fiber) for 3D scene rendering
- Three.js as the underlying 3D graphics engine
- Vite as the build tool and development server
- TailwindCSS for styling with custom design tokens
- Radix UI for accessible component primitives

**3D Rendering Pipeline:**
- Canvas-based 3D rendering with React Three Fiber
- Custom shader support via vite-plugin-glsl for advanced visual effects
- Post-processing effects through @react-three/postprocessing
- Drei (@react-three/drei) for common 3D helpers (cameras, controls, loaders)
- OrbitControls for camera manipulation with constrained movement

**State Management:**
- Zustand stores for game state (useFarmGame)
- Separate audio management store (useAudio)
- Phase-based game progression (welcome → tutorial → stage1 → stage2 → stage3)
- Location-based data configuration supporting multiple global farming regions

**Component Architecture:**
- Game phase components: WelcomeScreen, NASATutorial, FarmScene
- 3D scene components: Terrain, WheatField, WeatherSystem, QuizMarker, IrrigationEffect
- UI overlay components: GameHUD, NASADataPanel, Stage1Panel, Quiz
- Sound management: SoundManager with Howler.js integration

### Backend Architecture

**Server Configuration:**
- Express.js HTTP server with TypeScript
- Development mode: Vite middleware for HMR and asset serving
- Production mode: Static file serving from dist/public
- API routes prefixed with /api (extensible route structure)

**Session & Storage:**
- In-memory storage implementation (MemStorage class)
- User management schema defined with Drizzle ORM
- PostgreSQL dialect configuration (Neon Database ready)
- Session storage prepared with connect-pg-simple

**Build Process:**
- Client: Vite builds to dist/public
- Server: esbuild bundles to dist/index.js with ESM format
- TypeScript compilation with path aliases (@/ for client, @shared for shared code)
- Asset handling for 3D models (.gltf, .glb) and audio files (.mp3, .ogg, .wav)

### External Dependencies

**NASA Data Integration:**
- NASA Worldview for satellite imagery visualization
- CropCASMA for crop condition monitoring
- Giovanni for data analysis and visualization
- Flood Pathfinder for flood risk assessment
- Embedded iframes and direct URL linking to NASA tools
- Location-specific data overlays (SMAP anomaly, MODIS LST, NDVI, flood risk)

**Database:**
- PostgreSQL via Neon serverless driver (@neondatabase/serverless)
- Drizzle ORM for schema definition and migrations
- Migration files stored in ./migrations directory
- Schema location: ./shared/schema.ts

**Audio System:**
- Howler.js for cross-browser audio playback
- Background music loop
- Event-driven sound effects (success, weather)
- Simulated rain audio through looped hit sounds at varied rates

**Third-Party UI Libraries:**
- Comprehensive Radix UI component set for dialogs, dropdowns, tooltips, etc.
- Lucide React for icons
- class-variance-authority for component variant styling
- TanStack Query for potential API data fetching

**Development Tools:**
- @replit/vite-plugin-runtime-error-modal for enhanced error visibility
- TypeScript with strict mode enabled
- Path aliases for clean imports
- Custom Vite logger with process exit on errors

**Key Game Constants:**
- Pre-configured farming locations (Iowa USA, Punjab India, São Paulo Brazil, Central Kenya)
- Each location includes coordinates, climate data, and NASA data parameters
- Quiz questions for educational assessment
- Tooltip definitions for UI guidance