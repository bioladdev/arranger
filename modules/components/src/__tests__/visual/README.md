# Visual Regression Testing

This directory contains visual regression tests for Arranger components using Vitest. The tests capture HTML snapshots of rendered components to detect visual changes over time.

## Structure

```
visual/
├── individual/          # Tests for individual components
│   ├── Button.visual.test.tsx
│   ├── Input.visual.test.tsx
│   ├── Icons.visual.test.tsx
│   └── __snapshots__/   # Generated snapshots
├── compound/            # Tests for component combinations
│   ├── BasicComponents.visual.test.tsx
│   └── __snapshots__/   # Generated snapshots
├── utils/               # Test utilities and helpers
│   └── test-helpers.tsx
└── README.md           # This file
```

## Running Visual Tests

### Commands

```bash
# Run all visual tests
npm run test:visual

# Run visual tests in watch mode
npm run test:visual:watch

# Run visual tests across multiple browsers (when browser mode is enabled)
npm run test:visual:all
```

### Individual Test Files

```bash
# Run specific visual test file
npm run test:visual -- Button.visual.test.tsx

# Run tests matching a pattern
npm run test:visual -- --grep "button"
```

## Writing Visual Tests

### Basic Component Test

```tsx
import React from 'react';
import { describe, it } from 'vitest';
import MyComponent from '#MyComponent/index.js';
import { ThemeProvider } from '#ThemeContext/index.js';
import { renderAndSnapshot } from '../utils/test-helpers.js';

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ padding: '20px' }}>
    <ThemeProvider>{children}</ThemeProvider>
  </div>
);

describe('MyComponent Visual Tests', () => {
  it('renders default state', async () => {
    await renderAndSnapshot(
      <MyComponent />,
      'my-component-default',
      { wrapper: TestWrapper }
    );
  });

  it('renders with props', async () => {
    await renderAndSnapshot(
      <MyComponent disabled />,
      'my-component-disabled',
      { wrapper: TestWrapper }
    );
  });
});
```

### Compound Component Test

```tsx
import React from 'react';
import { describe, it } from 'vitest';
import Button from '#Button/index.js';
import Input from '#Input/Input.js';
import { renderAndSnapshot } from '../utils/test-helpers.js';

describe('Form Components', () => {
  it('renders search form', async () => {
    await renderAndSnapshot(
      <div style={{ display: 'flex', gap: '10px' }}>
        <Input theme={{ placeholder: 'Search...' }} />
        <Button>Search</Button>
      </div>,
      'search-form'
    );
  });
});
```

## Test Utilities

### `renderAndSnapshot(component, testName, options?)`

Main utility for rendering components and creating snapshots.

**Parameters:**
- `component`: React element to render
- `testName`: Unique name for the snapshot file
- `options.wrapper`: Optional wrapper component (defaults to `VisualTestWrapper`)

**Returns:** The rendered container element

### `VisualTestWrapper`

Default wrapper that provides consistent styling:
- 20px padding
- Standard font family
- White background
- Black text color

### `createMockData`

Utilities for generating consistent test data:
- `createMockData.tableData()`: Sample table rows
- `createMockData.aggregationData()`: Sample aggregation buckets
- `createMockData.sqonData()`: Sample SQON query object

## Best Practices

### 1. Consistent Naming

Use descriptive, kebab-case names for snapshots:
```tsx
// Good
'button-default'
'input-with-placeholder'
'table-with-sorting'

// Avoid
'test1'
'button'
'component'
```

### 2. Theme Provider

Always wrap components that use theming:
```tsx
const TestWrapper = ({ children }) => (
  <ThemeProvider>{children}</ThemeProvider>
);
```

### 3. Stable Test Data

Use consistent mock data to avoid snapshot changes:
```tsx
const mockData = createMockData.tableData();
await renderAndSnapshot(
  <Table data={mockData} />,
  'table-with-data'
);
```

### 4. Component Variants

Test different states and configurations:
```tsx
describe('Button Visual Tests', () => {
  it('renders all variants', async () => {
    await renderAndSnapshot(
      <div style={{ display: 'flex', gap: '10px' }}>
        <Button>Normal</Button>
        <Button disabled>Disabled</Button>
        <Button theme={{ background: '#007bff' }}>Primary</Button>
      </div>,
      'button-all-variants'
    );
  });
});
```

### 5. Responsive Layouts

Use consistent container sizes:
```tsx
const TestWrapper = ({ children }) => (
  <div style={{ width: '600px', padding: '20px' }}>
    {children}
  </div>
);
```

## Snapshot Management

### Updating Snapshots

When component changes are intentional:
```bash
# Update all snapshots
npm run test:visual -- --update-snapshots

# Update specific test snapshots
npm run test:visual -- Button.visual.test.tsx --update-snapshots
```

### Reviewing Changes

1. Run tests to see failures
2. Review the diff in the snapshot files
3. Verify changes are intentional
4. Update snapshots if correct

## Configuration

Visual tests use a separate Vitest configuration (`vitest.visual.config.ts`) that:
- Includes only `*.visual.test.{ts,tsx}` files
- Uses jsdom environment for consistent rendering
- Provides theme context and component aliases

## Future Enhancements

### Browser-Based Testing

When browser mode is stable, tests can be enhanced to:
- Capture actual screenshots instead of HTML snapshots
- Test across multiple browsers (Chrome, Firefox, Safari)
- Include interaction testing (hover, focus states)
- Test responsive behavior at different viewport sizes

### Integration with CI/CD

Visual tests can be integrated into CI pipelines to:
- Automatically detect visual regressions
- Generate visual diff reports
- Block deployments with visual changes
- Archive snapshots for historical comparison

## Troubleshooting

### Common Issues

1. **Snapshot mismatches**: Usually due to theme or styling changes
2. **Async rendering**: Add delays in test helpers if needed
3. **Font rendering**: Ensure consistent font loading in test environment
4. **Dynamic content**: Use stable mock data instead of random values

### Debug Tips

```tsx
// Add debug output
const { container } = render(<Component />);
console.log(container.innerHTML);

// Use screen queries for debugging
import { screen } from '@testing-library/react';
screen.debug();
```