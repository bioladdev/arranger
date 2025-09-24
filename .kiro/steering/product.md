# Product Overview

Arranger is a versatile, data-agnostic GraphQL search API that leverages Elasticsearch v7.x, designed to simplify the process of creating powerful search interfaces for complex datasets. It's part of the Overture.bio ecosystem for genomics data platforms.

## Core Components

- **Arranger Server**: GraphQL API service that generates schemas from Elasticsearch mappings and acts as middleware between UI and Elasticsearch
- **Arranger Components**: React component library for building interactive search UIs with faceted search, data tables, and SQON (Serializable Query Object Notation) viewers

## Key Features

- Data-agnostic design that works with any properly structured Elasticsearch index
- Configurable search UI components based on Elasticsearch index mappings
- SQON integration for human-readable and machine-processable search queries
- Integration-ready for React-based front-end applications
- Part of the larger Overture.bio microservices ecosystem

## Target Use Cases

- Genomics data exploration platforms
- Complex dataset search interfaces
- Research data portals requiring faceted search capabilities
- Applications needing GraphQL APIs over Elasticsearch data