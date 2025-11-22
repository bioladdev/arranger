# Arranger Components - Claude Development Guide

## Project Overview

`@overture-stack/arranger-components` is a React component library that provides interactive, configurable UI components for building data portal search interfaces. It's part of the larger Arranger ecosystem, which provides a GraphQL search API powered by Elasticsearch.

## Technology Stack

- **Language**: TypeScript
- **Framework**: React (17.0+ or 18.0+)
- **Styling**: Emotion (CSS-in-JS)
- **Build Tool**: Vite
- **Testing**: Jest
- **Package Manager**: npm

## Key Components

The library exports several main component categories:

1. **Table Components**: Advanced data table with sorting, pagination, filtering
   - `Table`, `Toolbar`, `Pagination`, `DownloadButton`, `ColumnsSelectButton`, etc.
   - Uses TanStack React Table v8

2. **Aggregations**: Faceted search components
   - `Aggregations`, `AggregationsList`, `TermAggs`, `BooleanAggs`

3. **Search**: Quick search functionality
   - `QuickSearch`

4. **SQON Viewer**: Display and manage search queries
   - `SQONViewer`, `CurrentSQON`

5. **Theme System**: Customizable theming
   - `ArrangerThemeProvider`, `useArrangerTheme`

6. **Data Context**: Data fetching and state management
   - `ArrangerDataProvider`, `useArrangerData`

## Directory Structure

```
modules/components/
├── src/
│   ├── Table/              # Table components and helpers
│   ├── aggregations/       # Faceted search components
│   ├── ThemeContext/       # Theme system and base theme
│   ├── DataContext/        # Data fetching context
│   ├── Icons/              # Icon components
│   ├── QuickSearch/        # Quick search component
│   ├── SQONViewer/         # SQON display component
│   ├── utils/              # Shared utilities
│   └── index.ts            # Main exports
├── stories/                # Storybook stories
├── __mocks__/              # Jest mocks
├── public/                 # Static assets
└── package.json
```

## Development Commands

```bash
# Build the library
npm run build

# Build in watch mode (for development)
npm run dev

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Type checking
npm run typecheck

# Clean build artifacts
npm run clean
```

## Build System

- **Vite** handles building and bundling
- Outputs to `dist/` directory
- Generates TypeScript declaration files (.d.ts)
- ESM format (type: "module")

## Testing

- Jest configured with TypeScript support (ts-jest)
- Uses experimental VM modules for ESM
- Test files typically colocated with source files or in `__tests__` directories

## Development Notes

### Local Development

When developing locally using `npm link`, ensure client-side projects use:
```json
{
  "compilerOptions": {
    "preserveSymlinks": true
  }
}
```
This prevents duplicate imports of deep dependencies like `@types/react`.

### Peer Dependencies

This package requires the following peer dependencies:
- React 17.0+ or 18.0+
- React DOM 17.0+ or 18.0+
- @emotion/react 11.0+
- @emotion/styled 11.0+
- @types/react 17.0+ or 18.0+
- @types/react-dom 17.0+ or 18.0+

### Code Style

- TypeScript strict mode enabled
- ESLint configured with React, JSX a11y, and React Hooks plugins
- Prettier for code formatting

## Common Tasks

### Adding a New Component

1. Create component directory in `src/`
2. Create component file (`.tsx`)
3. Create types file (`types.ts`)
4. Create index file (`index.ts`) for exports
5. Export from main `src/index.ts`
6. Add tests
7. Consider adding Storybook story

### Updating Dependencies

Be mindful of peer dependencies and ensure compatibility with React 17 and 18.

### TypeScript Migration

This package was recently migrated from JavaScript to TypeScript. Some legacy patterns may exist.

## Integration

This component library is designed to work with:
- `@overture-stack/arranger-server` (GraphQL API)
- Data sources indexed in Elasticsearch
- Custom data portals built with the Overture stack

## Resources

- [Main Arranger Repo](https://github.com/overture-stack/arranger)
- [Overture Documentation](https://docs.overture.bio/docs/core-software/Arranger/overview)
- [TanStack Table Docs](https://tanstack.com/table/v8)
- [Emotion Docs](https://emotion.sh/docs/introduction)
