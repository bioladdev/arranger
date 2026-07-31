import type { AggregationsThemeProps } from '#aggregations/types';
import type { ButtonThemeProps } from '#Button/types';
import type { ArrowIconThemeProps } from '#Icons/ArrowIcon/types';
import type { InputThemeProps } from '#Input/types';
import type { LoaderContainerThemeProps, LoaderOverlayThemeProps, LoaderThemeProps } from '#Loader/types';
import type { QuickSearchThemeProps } from '#QuickSearch/types';
import type { SQONViewerThemeProps } from '#SQONViewer/types';
import type { TableThemeProps } from '#Table/types';
import type { TextHighlightThemeProps } from '#TextHighlight/types';

export interface Components {
	Aggregations: AggregationsThemeProps;
	ArrowIcon: ArrowIconThemeProps;
	Button: ButtonThemeProps;
	Input: InputThemeProps;
	Loader: LoaderThemeProps;
	LoaderContainer: LoaderContainerThemeProps;
	LoaderOverlay: LoaderOverlayThemeProps;
	QuickSearch: QuickSearchThemeProps;
	SQONViewer: SQONViewerThemeProps;
	Table: TableThemeProps;
	TextHighlight: TextHighlightThemeProps;
}
