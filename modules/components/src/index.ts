// Import global CSS variables for CSS Modules migration
import './styles/theme.css';

// Provider
export { DataProvider as ArrangerDataProvider, DataContext as ArrangerDataContext } from './DataContext/index.js';
//
export { Aggregations, AggregationsListDisplay, AggregationsList } from './aggregations/index.js';
export * from './Arranger/index.js';
export {
	LegacyDataContext as LegacyArrangerDataContext,
	LegacyDataProvider as LegacyArrangerDataProvider,
	useDataContext as useArrangerData,
	withData as withArrangerData,
} from './DataContext/index.js';
export { default as Query, withQuery } from './Query.js';
export { default as QuickSearch } from './QuickSearch/index.js';
// TODO: Deprecate "CurrentSQON" component name as unsemantical,
// remove SQONView (duplicate of CurrentSQON to produce the same log warning)
export { CurrentSQON, default as SQONViewer, SQONView } from './SQONViewer/index.js';
export {
	ColumnsSelectButton,
	CountDisplay,
	default as Table,
	DownloadButton,
	MaxRowsSelector,
	PageSelector,
	Pagination,
	TableContext,
	TableContextProvider,
	Toolbar,
	useTableContext,
	withTableContext,
} from './Table/index.js';
export {
	arrangerTheme,
	ThemeContext as ArrangerThemeContext,
	ThemeProvider as ArrangerThemeProvider,
	useThemeContext as useArrangerTheme,
	withTheme as withArrangerTheme,
} from './ThemeContext/index.js';
export * from './utils/index.js';
export type * from './types.js';
