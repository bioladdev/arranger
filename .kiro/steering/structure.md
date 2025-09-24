# Project Structure

## Repository Organization

Arranger follows a monorepo structure with npm workspaces for managing multiple related packages.

```
arranger/
├── modules/                    # Core application modules
│   ├── server/                # GraphQL API server
│   ├── components/            # React component library
│   └── admin-ui/              # (Inactive) Admin interface
├── docker/                    # Docker configurations
│   ├── elasticsearch/         # ES setup and test data
│   ├── server/               # Server configs
│   ├── test/                 # Test utilities
│   └── ui/                   # UI deployment configs
├── integration-tests/         # Cross-module integration tests
├── docs/                     # Documentation
└── scripts/                  # Utility scripts
```

## Module Structure

### Server Module (`modules/server/`)
- **Entry Point**: `index.ts` (executable binary)
- **Source**: `src/` with TypeScript path mapping (`#*` → `./src/*`)
- **Config**: `configTemplates/` for deployment configurations
- **Build**: Compiles to `dist/` for distribution

### Components Module (`modules/components/`)
- **Source**: `src/` with React components and utilities
- **Build**: Babel compilation to `dist/` with TypeScript declarations
- **Stories**: Storybook stories in `stories/`
- **Public**: Static assets in `public/`
- **Path Mapping**: `#*` → `./src/*`, `#public` → `./public`

## Key Conventions

### File Organization
- TypeScript source files in `src/` directories
- Build outputs in `dist/` directories (gitignored)
- Configuration files at module root
- Test files co-located with source or in `__tests__/` directories

### Import Patterns
- Use path mapping (`#*`) for internal imports
- File extensions required in imports (`.js` for compiled output)
- Organized import order: builtin → external → internal → relative
- Consistent type imports with `import type`

### Configuration Files
- `package.json` in each workspace with npm scripts
- `tsconfig.json` for TypeScript compilation
- `tsconfig.release.json` for production builds
- Module-specific ESLint configs extending root configuration

### Docker Structure
- `docker-compose.yml` at root for local development
- Service-specific Dockerfiles in `docker/` subdirectories
- Environment-specific configurations and templates
- Test data and utilities for Elasticsearch setup

## Workspace Management

The project uses npm workspaces defined in root `package.json`:
- `modules/server`
- `modules/components` 
- `integration-tests/import`
- `integration-tests/server`

Scripts can be run across workspaces using `--w` flag or `--ws` for all workspaces.