# ⚠️ DEPRECATED: Arranger Component

## This component is deprecated and will be removed in v4.0.0

The `<Arranger>` component has been deprecated in favor of the new `<DataProvider>` component with React hooks.

### Quick Migration

**Replace this:**
```jsx
<Arranger documentType="files">
  {({ sqon, setSQON }) => <MyComponent sqon={sqon} setSQON={setSQON} />}
</Arranger>
```

**With this:**
```jsx
<DataProvider documentType="files">
  <MyComponent />
</DataProvider>

// Inside MyComponent:
const { sqon, setSQON } = useDataContext();
```

### Full Migration Guide

See [MIGRATION.md](../MIGRATION.md) for complete migration instructions.

### Why migrate?

- ✅ Better TypeScript support
- ✅ Modern React patterns
- ✅ Improved performance
- ✅ Future-proof compatibility
- ✅ Cleaner API design

**This component will be removed in v4.0.0. Please migrate as soon as possible.**