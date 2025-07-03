# React Intern Assignment - Project Management Spreadsheet

## Overview

A pixel-perfect React TypeScript project management interface that precisely matches the provided Figma design. The application features a professional data table with status management, priority tracking, and full keyboard navigation capabilities - built specifically for the React intern assignment requirements.

## System Architecture

### Frontend Architecture
- **React 18** with TypeScript in strict mode
- **Vite** as the build tool for fast development and optimized builds
- **Tailwind CSS** for styling with a custom design system
- **Radix UI** components via shadcn/ui for consistent, accessible UI elements
- **Lucide React** for icons throughout the interface
- **Wouter** for client-side routing (lightweight React Router alternative)

### Backend Architecture
- **Express.js** server with TypeScript
- **RESTful API** structure with `/api` prefix for all endpoints
- **Memory-based storage** using a custom `MemStorage` class implementing `IStorage` interface
- **Session management** capabilities with PostgreSQL session store support
- **Middleware** for request logging and error handling

### Data Storage Solutions
- **Primary Storage**: In-memory storage for development/demonstration
- **Database Ready**: Drizzle ORM configured for PostgreSQL with Neon Database
- **Schema Management**: Centralized schema definitions in `shared/schema.ts`
- **Migration Support**: Database migrations configured via `drizzle.config.ts`

## Key Components

### Project Management Interface Components
1. **Header Navigation**: Breadcrumb navigation (Workspace > Folder > Spreadsheet) with search and user profile
2. **Action Toolbar**: Tool bar, Hide fields, Sort, Filter, Cell view controls with Import/Export/Share actions
3. **Status Tabs**: Q3 Financial Overview, Answer a question, Extract action tabs
4. **Data Table**: Professional project management table with status badges and priority indicators
5. **Bottom Navigation**: All Orders, Pending, Reviewed, Arrived tab switching

### State Management
- **useSpreadsheet Hook**: Central state management for spreadsheet data
- **Local React State**: Cell data, selection, active sheet management
- **Custom Hooks**: Mobile detection, toast notifications

### UI System
- **Design System**: Consistent color palette with CSS custom properties
- **Component Library**: Comprehensive UI components from Radix UI
- **Responsive Design**: Mobile-first approach with proper breakpoints
- **Accessibility**: ARIA compliance through Radix UI components

## Data Flow

### Cell Management
1. **Selection**: Click to select cells, updates `selectedCell` state
2. **Editing**: Double-click or press Enter to start editing mode
3. **Formula Processing**: Basic formula support (e.g., `=B1-B2`)
4. **Persistence**: Cell data stored in `cellData` object with cell ID as key

### Sheet Management
1. **Multi-sheet Support**: Multiple sheets with unique IDs
2. **Sheet Switching**: Tab-based navigation between sheets
3. **Dynamic Addition**: Add new sheets via plus button

### User Interactions
- **Keyboard Navigation**: Arrow keys, Enter, Escape for cell navigation
- **Mouse Interactions**: Click, double-click, drag for selection
- **Toolbar Actions**: Formatting, alignment, and editing operations

## External Dependencies

### Core Dependencies
- **@tanstack/react-query**: Server state management and caching
- **@neondatabase/serverless**: PostgreSQL serverless database connection
- **drizzle-orm**: Type-safe database ORM
- **date-fns**: Date manipulation utilities
- **nanoid**: Unique ID generation

### UI Dependencies
- **@radix-ui/***: Comprehensive accessible UI primitives
- **class-variance-authority**: Utility for creating variant-based components
- **clsx**: Conditional className utility
- **cmdk**: Command palette functionality

### Development Dependencies
- **Vite**: Fast build tool with HMR
- **TypeScript**: Type safety and development experience
- **ESBuild**: Fast JavaScript bundler for production builds

## Deployment Strategy

### Build Process
1. **Client Build**: Vite builds React application to `dist/public`
2. **Server Build**: ESBuild bundles Express server to `dist/index.js`
3. **Static Assets**: Client assets served from `dist/public`

### Environment Configuration
- **Development**: Hot module replacement with Vite dev server
- **Production**: Optimized builds with static asset serving
- **Database**: Environment-based DATABASE_URL configuration

### Hosting Considerations
- **Static Assets**: Efficiently served with proper caching headers
- **API Routes**: Express server handles `/api/*` routes
- **Database**: PostgreSQL connection with connection pooling

## Changelog

```
Changelog:
- July 02, 2025. Initial traditional spreadsheet setup
- July 02, 2025. Complete redesign to match Figma project management interface
- Added project data table with status badges and priority indicators
- Implemented keyboard navigation with arrow keys
- Added comprehensive toolbar and action buttons
- Created pixel-perfect design matching provided screenshot
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```