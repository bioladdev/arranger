# CLAUDE.md - Arranger Components

> **Purpose**: This document helps Claude (AI) understand the `@overture-stack/arranger-components` codebase architecture, patterns, and conventions when working on this module.

## What This Is

A React component library for building data portal search UIs. Works with the Arranger GraphQL API to provide interactive tables, faceted search (aggregations), and query builders for exploring Elasticsearch-indexed data. Part of the Overture genomics data platform.

**Tech stack**: TypeScript, React, Emotion (CSS-in-JS), TanStack Table v8, Vite

## Architecture & Key Concepts

### Component Structure Pattern

Every component follows this structure:
```
ComponentName/
├── index.ts              # Exports only
├── ComponentName.tsx     # Implementation
├── types.ts             # TypeScript types/interfaces
└── helpers.ts           # Optional: pure functions, utilities
```

**Important**: The `index.ts` file should ONLY export. Never put implementation in index files.

### Context Providers

This library uses React Context heavily. Three main contexts:

1. **ThemeContext** (`src/ThemeContext/`)
   - Provides Emotion theme to all components
   - Base theme in `baseTheme/` with Material-UI-inspired color palette
   - Consumers use `useArrangerTheme()` hook

2. **DataContext** (`src/DataContext/`)
   - Handles GraphQL data fetching via Axios
   - Manages SQON (Search Query Object Notation) state
   - Consumers use `useArrangerData()` hook
   - Contains query builders in `dataQueries.ts`

3. **TableContext** (`src/Table/helpers/context.tsx`)
   - Manages table state (sorting, pagination, column visibility)
   - Wraps TanStack Table's state management
   - Consumers use `useTableContext()` hook

### SQON (Search Query Object Notation)

**Critical concept**: SQON is Arranger's query DSL for representing complex search filters. It's similar to Elasticsearch query DSL but simpler.

Example:
```javascript
{
  op: "and",
  content: [
    { op: "in", content: { field: "status", value: ["active", "pending"] } },
    { op: ">=", content: { field: "age", value: 18 } }
  ]
}
```

- Found throughout aggregations and table components
- Managed by `@overture-stack/sqon-builder` package
- When modifying filters/search, you're usually building/modifying SQON

### Table Implementation

The Table component (`src/Table/`) is the most complex part:

- **Uses TanStack Table v8** (recently migrated from react-table v6)
- **Composable architecture**: `Table` is a wrapper, actual functionality split into:
  - `Toolbar` - Actions bar (download, column selector, etc.)
  - `Pagination` - Page navigation
  - `DownloadButton` - TSV/CSV export
  - `HeaderRow` - Column headers with sorting
  - `Row` - Data rows
  - `Cell` - Individual cells

**Key files**:
- `Table.tsx` - Main component, minimal logic
- `Wrapper.tsx` - Handles TanStack Table setup
- `helpers/columns.tsx` - Column configuration logic
- `helpers/cells.tsx` - Cell rendering logic

### Aggregations

Located in `src/aggregations/`:

- **TermAggs**: Faceted filters for categorical data (e.g., "Status: Active (23), Pending (5)")
- **BooleanAggs**: True/false filters
- **BucketCount**: Displays count for a single bucket
- **AggsState.ts**: State management for aggregation interactions

Pattern: User clicks filter → SQON updated → DataContext refetches → UI updates

## TypeScript Migration Notes

**Recently migrated from JavaScript to TypeScript**. Some things to know:

1. **`.js` imports in code**: Many files still use `.js` extensions in import statements even though files are `.ts`/`.tsx`. This is intentional for ESM compatibility - leave them as-is.

   Example: `export { Aggregations } from './aggregations/index.js'`

2. **Type coverage is incomplete**: Some areas use `any` or loose types. When working on a component:
   - Add proper types if missing
   - Don't break existing type signatures without checking consumers

3. **Legacy patterns**: May see older React patterns:
   - `withData`, `withTheme` HOCs (being replaced by hooks)
   - Some class components (rare)

## Common Gotchas

### 1. Emotion Theming
- All styled components MUST be wrapped in `ArrangerThemeProvider`
- Use `useArrangerTheme()` to access theme, not Emotion's `useTheme()`
- Theme typing: `import type { ArrangerTheme } from './ThemeContext/types'`

### 2. Peer Dependencies
- React is a peer dependency - never import React types from this package's node_modules
- Must support both React 17 and 18
- Emotion is also a peer dependency

### 3. Build Output
- Outputs to `dist/` as ESM modules
- `package.json` has `"type": "module"`
- Vite handles bundling, generates `.d.ts` files via `vite-plugin-dts`

### 4. Testing
- Jest uses experimental VM modules for ESM support
- Run via `NODE_OPTIONS="--experimental-vm-modules" jest`
- Mocks in `__mocks__/` directory

### 5. File Extensions
- Source files: `.ts` or `.tsx`
- Imports in code often reference `.js` (correct, don't change)
- Build outputs `.js` files

## Where to Find Things

| What | Where |
|------|-------|
| Component exports | `src/index.ts` |
| Type definitions | `types.ts` files in each component dir, or `src/types.ts` |
| Theme colors | `src/ThemeContext/baseTheme/palette/colors/` |
| GraphQL queries | `src/DataContext/dataQueries.ts` |
| Table columns logic | `src/Table/helpers/columns.tsx` |
| Utility functions | `src/utils/` |
| Test helpers | `__mocks__/` |

## Making Changes Safely

### Adding a Component
1. Create directory in `src/ComponentName/`
2. Create `index.ts`, `ComponentName.tsx`, `types.ts`
3. If needs theme: wrap in `useArrangerTheme()` or style with Emotion
4. Export from `src/index.ts`
5. Add tests colocated or in component directory
6. Consider Storybook story in `stories/`

### Modifying Table Components
- Table is highly composable - changes to one part may affect others
- Check `TableContext` state if adding features
- Test with different data shapes (empty, single row, many rows)
- Sorting/filtering logic is in TanStack Table config in `Wrapper.tsx`

### Modifying Aggregations
- Changes to aggregation state → check `AggsState.ts`
- Changes to SQON generation → verify with `@overture-stack/sqon-builder`
- Test with real Elasticsearch-style aggregation responses

### Styling Changes
- Use `useArrangerTheme()` to access theme
- Define component-specific styles with Emotion's `styled` or `css`
- Don't hardcode colors - use theme.palette
- Check both light backgrounds and potential dark mode usage

## Testing Strategy

- **Unit tests**: Component rendering, prop handling
- **Integration tests**: Context provider interactions
- **No E2E tests in this package** (handled in consuming apps)

Run tests: `npm test`
Type check: `npm run typecheck`

## Build & Release

- Build: `npm run build` (outputs to `dist/`)
- Dev mode: `npm run dev` (watch mode)
- Published to npm as `@overture-stack/arranger-components`
- Version managed in `package.json` (currently `0.0.0-dev`)

## External Dependencies to Know

- `@overture-stack/sqon-builder` - SQON manipulation
- `@tanstack/react-table` v8 - Table logic
- `axios` - HTTP requests to Arranger API
- `@emotion/react` & `@emotion/styled` - Styling
- `react-icons` - Icon components
- `lodash-es` - Utilities (prefer tree-shakeable imports)

## When You're Unsure

1. **Check existing patterns**: Look at similar components
2. **Read types**: TypeScript types often explain expected data shapes
3. **Check exports**: `src/index.ts` shows public API
4. **Look at stories**: `stories/` directory has usage examples
5. **Context matters**: Many components depend on ThemeContext or DataContext being present
