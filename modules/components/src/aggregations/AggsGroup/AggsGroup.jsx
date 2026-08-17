import cx from 'classnames';
import { useState } from 'react';

import { TransparentButton } from '#Button/index';
import { ArrowIcon, SearchIcon, SortAlphaIcon } from '#Icons/index';
import { useThemeContext } from '#ThemeContext/index';
import noopFn, { emptyObj } from '#utils/noops';

import styles from './AggsGroup.module.css';


// TODO: redesign modifiers (filter, sort) to be off by default?
// TODO: temporarily quieting down TS errors to help migration
/**
 * @param {*} props
 */
const AggsGroup = ({
	children,
	className: aggTypeCustomClassName,
	componentRef,
	dataFields = emptyObj,
	filters,
	headerRef,
	stickyHeader,
	theme: {
		style: customAggsWrapperCSS,
		collapsing: customCollapsing,
		collapsing: {
			className: customCollapsingIconClassName,
			disabled: customCollapsingDisabled,
			hoverText: customCollapsingIconHoverText,
			Icon: customCollapsingIcon,
			onClick: customCollapsingIconHandler,
			size: customCollapsingIconSize,
			...customCollapsingIconProps
		} = emptyObj,
		displayName,
		filtering: customFiltering,
		filtering: {
			className: customFilteringIconClassName,
			disabled: customFilteringDisabled,
			hoverText: customFilteringIconHoverText,
			Icon: customFilteringIcon,
			onClick: customFilteringIconHandler,
			size: customFilteringIconSize,
			...customFilteringIconProps
		} = emptyObj,
		sorting: customSorting,
		sorting: {
			className: customSortingIconClassName,
			disabled: customSortingDisabled,
			hoverText: customSortingIconHoverText,
			Icon: customSortingIcon,
			onClick: customSortingIconHandler,
			size: customSortingIconSize,
			...customSortingIconProps
		} = emptyObj,
		WrapperComponent,
	} = emptyObj,
}) => {
	const [isCollapsed, setIsCollapsed] = useState(false);
	const {
		colors,
		components: {
			Aggregations: {
				AggsGroup: {
					className: themeAggsGroupClassName,
					style: themeAggsGroupCSS,
					collapsedBackground: themeCollapsedAggsGroupBackground = colors?.grey?.[200],
					collapsing: {
						className: themeCollapsingIconClassName,
						disabled: themeCollapsingDisabled,
						hoverText: themeCollapsingIconHoverText,
						Icon: themeCollapsingIcon = ArrowIcon,
						onClick: themeCollapsingIconHandler = noopFn,
						size: themeCollapsingIconSize = 9,
						...themeCollapsingIconProps
					} = emptyObj,
					filtering: {
						className: themeFilteringIconClassName,
						disabled: themeFilteringDisabled,
						hoverText: themeFilteringIconHoverText,
						Icon: themeFilteringIcon = SearchIcon,
						onClick: themeFilteringIconHandler = noopFn,
						size: themeFilteringIconSize = '14',
						...themeFilteringIconProps
					} = emptyObj,
					groupDividerColor: ThemeAggsGroupDividerColor,
					headerBackground: themeAggsHeaderBackground,
					headerDividerColor: themeAggsHeaderDividerColor,
					headerFontColor: themeAggsHeaderFontColor,
					headerSticky: themeAggsHeaderSticky = false,
					sorting: {
						className: themeSortingIconClassName,
						descending: themeSortingIconDescending,
						disabled: themeSortingDisabled,
						hoverText: themeSortingIconHoverText,
						Icon: themeSortingIcon = SortAlphaIcon,
						onClick: themeSortingIconHandler = noopFn,
						size: themeSortingIconSize = '14',
						...themeSortingIconProps
					} = emptyObj,
					...aggsGroupTheme
				} = emptyObj,
			} = emptyObj,
		} = emptyObj,
	} = useThemeContext({ callerName: 'AggsGroup' });


	// TODO: abstract all this noise into their own components/hooks/files

	const collapsible = customCollapsing !== false;
	const collapsingDisabled = customCollapsingDisabled || themeCollapsingDisabled || !collapsible;
	const collapsingHandler = (event) => {
		customCollapsingIconHandler?.(event);
		themeCollapsingIconHandler?.(event);
		setIsCollapsed(!isCollapsed);
	};
	const CollapsingIcon = customCollapsingIcon || themeCollapsingIcon;
	const collapsingIconClassName = cx(
		'collapsing-icon',
		customCollapsingIconClassName,
		themeCollapsingIconClassName
	);
	const collapsingIconHoverText = customCollapsingIconHoverText || themeCollapsingIconHoverText ||
		`${displayName}${collapsible
			? ` (${collapsingDisabled
				? `${isCollapsed ? 'Expanding' : 'Collapsing'} disabled`
				: `Click to ${isCollapsed ? 'expand' : 'collapse'} group`
			})`
			: ''
		}`;
	const collapsingIconSize = customCollapsingIconSize || themeCollapsingIconSize;
	const collapsingIconProps = {
		className: collapsingIconClassName,
		disabled: collapsingDisabled,
		isTreeJoint: true,
		pointUp: !isCollapsed,
		theme: {
			onClick: collapsingHandler,
			size: collapsingIconSize,
			...themeCollapsingIconProps,
			...customCollapsingIconProps,
		},
	};

	const filterable = customFiltering !== false;
	const filteringDisabled = customFilteringDisabled || themeFilteringDisabled || !filterable || isCollapsed;
	const filteringHandler = (event) => {
		customFilteringIconHandler?.(event);
		themeFilteringIconHandler?.(event);
	};

	const FilteringIcon = customFilteringIcon ?? themeFilteringIcon;
	const filteringIconClassName = cx(
		'filtering-icon',
		customFilteringIconClassName,
		themeFilteringIconClassName,
	);
	const isFiltered = filteringIconClassName
		.split(' ')
		.includes('active');
	const filteringIconHoverText = customFilteringIconHoverText || themeFilteringIconHoverText ||
		`${displayName}${filterable
			? ` (${filteringDisabled
				? 'Filtering disabled'
				: `Click to ${isFiltered ? 'hide' : 'show'} filters box`
			})`
			: ''
		}`;
	const filteringIconSize = customFilteringIconSize || themeFilteringIconSize;
	const filteringIconProps = {
		className: filteringIconClassName,
		disabled: filteringDisabled,
		theme: {
			size: filteringIconSize,
			...themeFilteringIconProps,
			...customFilteringIconProps,
		},
	};

	const sortable = customSorting !== false;
	const sortingDisabled = customSortingDisabled || themeSortingDisabled || !sortable || isCollapsed;
	const sortingHandler = (event) => {
		customSortingIconHandler?.(event);
		themeSortingIconHandler?.(event);
	};
	const SortingIcon = customSortingIcon ?? themeSortingIcon;
	const sortingIconClassName = cx(
		'sorting-icon',
		customSortingIconClassName,
		themeSortingIconClassName,
	);
	const isSorted = sortingIconClassName
		.split(' ')
		.includes('active');
	const sortingIconHoverText = customSortingIconHoverText || themeSortingIconHoverText ||
		`${displayName}${sortable
			? ` (${sortingDisabled
				? 'Sorting disabled'
				: `Click to sort ${isSorted ? 'by score' : 'alphabetically'}`
			})`
			: ''
		}`;
	const sortingIconSize = customSortingIconSize || themeSortingIconSize;
	const sortingIconProps = {
		className: sortingIconClassName,
		descending: themeSortingIconDescending,
		disabled: sortingDisabled,
		theme: {
			size: sortingIconSize,
			...themeSortingIconProps,
			...customSortingIconProps,
		},
	};


	const hasModifiers = filterable || sortable;

	const aggsGroupThemeStyle = {
		'--arranger-aggs-group-divider-color': ThemeAggsGroupDividerColor,
		'--arranger-aggs-header-background': themeAggsHeaderBackground,
		'--arranger-aggs-header-divider-color': themeAggsHeaderDividerColor,
		'--arranger-aggs-header-font-color': themeAggsHeaderFontColor,
	};

	return WrapperComponent ? (
		<WrapperComponent {...{ collapsible, displayName, componentRef, headerRef }} {...dataFields}>
			{children}
		</WrapperComponent>
	) : (
		<article
			className={cx(styles.aggregationGroup, themeAggsGroupClassName || aggTypeCustomClassName)}
			data-collapsed={isCollapsed}
			style={{ ...aggsGroupThemeStyle, ...themeAggsGroupCSS, ...customAggsWrapperCSS }}
			ref={componentRef}
			{...aggsGroupTheme}
			{...dataFields}
		>
			<header
				className={styles.header}
				data-sticky={Boolean(stickyHeader || themeAggsHeaderSticky)}
				ref={headerRef}
			>
				<div
					className={styles.titleWrapper}
					data-collapsed={isCollapsed}
				>
					<TransparentButton
						className={styles.titleControl}
						disabled={collapsingDisabled}
						onClick={collapsingDisabled ? undefined : collapsingHandler}
						title={collapsingIconHoverText}
					>
						{collapsible && (
							<CollapsingIcon
								{...collapsingIconProps}
							/>
						)}

						<span
							className={styles.title}
							data-has-modifiers={hasModifiers}
						>
							{displayName}
						</span>
					</TransparentButton>

					{sortable && (
						<TransparentButton
							className={styles.sortingIcon}
							disabled={sortingDisabled}
							onClick={sortingDisabled ? undefined : sortingHandler}
							title={sortingIconHoverText}
						>
							<SortingIcon
								{...sortingIconProps}
							/>
						</TransparentButton>
					)}

					{filterable && (
						<TransparentButton
							className={styles.filterIcon}
							disabled={filteringDisabled}
							onClick={filteringDisabled ? undefined : filteringHandler}
							title={filteringIconHoverText}
						>
							<FilteringIcon
								{...filteringIconProps}
							/>
						</TransparentButton>
					)}
				</div>

				{!isCollapsed &&
					filters?.map(
						(
							filter,
							index, // safe "key": expected to be consistent throughout the runtime lifetime of the app
						) => (
							<div key={index} className={styles.filter}>
								{filter}
							</div>
						),
					)}
			</header>

			{!isCollapsed && (
				<section className={styles.bucket}>{children}</section>
			)}
		</article>
	);
};

export default AggsGroup;
