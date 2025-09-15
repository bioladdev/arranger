# Arranger Components Migration Guide

## ⚠️ Arranger Component Deprecation

The `<Arranger>` component has been **deprecated** as of v3.0.0 and will be **removed in v4.0.0**.

### Why is it being deprecated?

The `<Arranger>` component was a legacy wrapper that served as a makeshift context provider in older versions. The new `<DataProvider>` component with React hooks provides:

- Better TypeScript support
- Cleaner API design
- Modern React patterns
- Improved performance
- Better testing capabilities

## Migration Steps

### 1. Replace `<Arranger>` with `<DataProvider>`

**OLD (Deprecated):**
```jsx
import { Arranger } from '@overture-stack/arranger-components';

<Arranger 
  documentType="files" 
  apiFetcher={myCustomFetcher}
  index="my-index"
>
  {({ sqon, setSQON, selectedTableRows, setSelectedTableRows }) => (
    <MyComponent 
      sqon={sqon}
      setSQON={setSQON}
      selectedTableRows={selectedTableRows}
      setSelectedTableRows={setSelectedTableRows}
    />
  )}
</Arranger>
```

**NEW (Recommended):**
```jsx
import { DataProvider } from '@overture-stack/arranger-components';

<DataProvider 
  documentType="files" 
  customFetcher={myCustomFetcher}
  apiUrl="http://localhost:5050"
>
  <MyComponent />
</DataProvider>
```

### 2. Use `useDataContext()` hook inside components

**Inside MyComponent:**
```jsx
import { useDataContext } from '@overture-stack/arranger-components';

function MyComponent() {
  const { 
    sqon, 
    setSQON, 
    // selectedTableRows and setSelectedTableRows are no longer provided
    // Use local state or separate context if needed
  } = useDataContext();

  return (
    <div>
      {/* Your component JSX */}
    </div>
  );
}
```

### 3. Handle selectedTableRows separately (if needed)

The new `DataProvider` doesn't manage table row selection. If you need this functionality:

```jsx
import { useState } from 'react';
import { DataProvider } from '@overture-stack/arranger-components';

function MyApp() {
  const [selectedTableRows, setSelectedTableRows] = useState([]);

  return (
    <DataProvider documentType="files">
      <MyComponent 
        selectedTableRows={selectedTableRows}
        setSelectedTableRows={setSelectedTableRows}
      />
    </DataProvider>
  );
}
```

## API Changes

### DataProvider Props

| Old Arranger Prop | New DataProvider Prop | Notes |
|-------------------|----------------------|-------|
| `apiFetcher` | `customFetcher` | Renamed for clarity |
| `documentType` | `documentType` | Same |
| `index` | ❌ Removed | No longer needed |
| `children` (render prop) | `children` (standard) | Use hooks instead of render props |
| `render` | ❌ Removed | Use hooks instead |
| `component` | ❌ Removed | Use hooks instead |

### Context Values

| Old Arranger Context | New DataContext | Notes |
|---------------------|-----------------|-------|
| `sqon` | `sqon` | Same |
| `setSQON` | `setSQON` | Same |
| `selectedTableRows` | ❌ Removed | Manage separately if needed |
| `setSelectedTableRows` | ❌ Removed | Manage separately if needed |
| `apiFetcher` | `apiFetcher` | Same |
| `documentType` | `documentType` | Same |
| `index` | ❌ Removed | No longer needed |

## Migration Timeline

- **v3.0.0**: `<Arranger>` deprecated with warnings
- **v3.x.x**: Migration period with both components available
- **v4.0.0**: `<Arranger>` component removed entirely

## Need Help?

If you encounter issues during migration:

1. Check the console for deprecation warnings with specific guidance
2. Review the [DataProvider documentation](./src/DataContext/README.md)
3. Look at the [example implementations](./stories/)
4. Open an issue on [GitHub](https://github.com/overture-stack/arranger/issues)

## Benefits of Migration

After migrating, you'll get:

- ✅ Better TypeScript support and IntelliSense
- ✅ Cleaner, more maintainable code
- ✅ Better performance with modern React patterns
- ✅ Future-proof compatibility
- ✅ Access to new features and improvements