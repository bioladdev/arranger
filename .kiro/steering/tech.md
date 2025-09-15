# Technology Stack

## Core Technologies

- **Node.js**: v22+ (ES modules, TypeScript)
- **Elasticsearch**: v7.17.x (search engine backend)
- **GraphQL**: API layer with Apollo Server
- **React**: Component library with Emotion styling
- **TypeScript**: Primary language across all modules
- **Docker**: Containerization and local development

## Build System & Tools

- **Package Manager**: npm with workspaces
- **Build Tools**: 
  - TypeScript compiler (tsc)
  - Babel for React components
  - tsx for development execution
- **Code Quality**:
  - ESLint with TypeScript rules
  - Prettier with tabs (4 spaces), single quotes, trailing commas
  - Import organization and file extension enforcement
- **Testing**: Jest with TypeScript support

## Key Dependencies

### Server Module
- `@elastic/elasticsearch`: Elasticsearch client
- `apollo-server-express`: GraphQL server
- `graphql-tools`: Schema utilities
- `@overture-stack/sqon-builder`: Query notation
- `express`, `cors`: HTTP server utilities

### Components Module
- `@emotion/react`, `@emotion/styled`: CSS-in-JS styling
- `@tanstack/react-table`: Data tables
- `react-datepicker`, `react-input-range`: UI components
- `semantic-ui-react`: UI framework
- `axios`: HTTP client

## Common Commands

### Development
```bash
# Start all services (ES, Kibana, Server)
make start

# Start individual services
make start-es
make start-server

# Development with watch mode
npm run server:watch
npm run components:watch
npm run modules:watch

# Testing
npm test
npm run test:watch
make test
```

### Build & Release
```bash
# Build all modules
npm run modules:build

# Clean and rebuild
npm run reset
npm run modules:build

# Format code
make format
```

### Elasticsearch Management
```bash
# Seed with test data
make seed-es

# Clean indices
make clean-elastic

# View ES info
make get-es-info
```

## Development Environment

- **Docker Compose**: Local ES cluster, Kibana, and services
- **Environment Variables**: ES_HOST, ES_USER, ES_PASS
- **Ports**: 
  - Elasticsearch: 9200
  - Kibana: 5601
  - Arranger Server: 5050
  - UI (Stage): 3000