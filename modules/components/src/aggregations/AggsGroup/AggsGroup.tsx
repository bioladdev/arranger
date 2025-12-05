import type { ComponentType, ReactNode } from 'react';

import { css } from '@emotion/react';
import cx from 'classnames';
import { useState } from 'react';

import { TransparentButton } from '#Button/index.js';
import { ArrowIcon, SearchIcon, SortAlphaIcon } from '#Icons/index.js';
import { useThemeContext } from '#ThemeContext/index.js';
import { emptyObj } from '#utils/noops.js';
import styles from './AggsGroup.module.css';

interface CollapsableButtonProps {
	displayName: string;
	disabled: boolean;
	isCollapsed: boolean;
	onClick: () => void;
}

const CollapsableButton = (props: CollapsableButtonProps) => {
	const { displayName, disabled, isCollapsed, onClick } = props;
	const hoverText = `${displayName} (${
		disabled
			? `${isCollapsed ? 'Expanding' : 'Collapsing'} disabled`
			: `Click to ${isCollapsed ? 'expand' : 'collapse'} group`
	})`;

	return (
		<TransparentButton
			className="title-control"
			disabled={disabled}
			onClick={disabled ? undefined : onClick}
			title={hoverText}
		>
			<ArrowIcon
				isTreeJoint
				size={9}
				pointUp={!isCollapsed}
			/>
			<span className="title">{displayName}</span>
		</TransparentButton>
	);
};

interface FilterButtonProps {
	displayName: string;
	disabled: boolean;
	isActive: boolean;
	onClick: () => void;
}

const FilterButton = (props: FilterButtonProps) => {
	const { displayName, disabled, isActive, onClick } = props;
	const hoverText = `${displayName} (${
		disabled ? 'Filtering disabled' : `Click to ${isActive ? 'hide' : 'show'} filters box`
	})`;

	return (
		<TransparentButton
			className={cx('filter-icon', { active: isActive })}
			disabled={disabled}
			onClick={disabled ? undefined : onClick}
			title={hoverText}
		>
			<SearchIcon size="14" />
		</TransparentButton>
	);
};

interface SortButtonProps {
	displayName: string;
	disabled: boolean;
	isActive: boolean;
	onClick: () => void;
}

const SortButton = (props: SortButtonProps) => {
	const { displayName, disabled, isActive, onClick } = props;
	const hoverText = `${displayName} (${
		disabled ? 'Sorting disabled' : `Click to sort ${isActive ? 'by score' : 'alphabetically'}`
	})`;

	return (
		<TransparentButton
			className={cx('sorting-icon', { active: isActive })}
			disabled={disabled}
			onClick={disabled ? undefined : onClick}
			title={hoverText}
		>
			<SortAlphaIcon size="14" />
		</TransparentButton>
	);
};

interface AggsGroupProps {
	children?: ReactNode;
	className?: string;
	collapsible?: boolean;
	dataFields?: any;
	displayName?: string;
	filterable?: boolean;
	filters?: any[];
	isFiltered?: boolean;
	isSorted?: boolean;
	onFilterClick?: () => void;
	onSortClick?: () => void;
	sortable?: boolean;
	stickyHeader?: boolean;
	WrapperComponent?: ComponentType<any>;
}

const AggsGroup = ({
	children,
	className: customClassName,
	collapsible = true,
	dataFields = emptyObj,
	displayName = 'Unnamed Field',
	filterable = true,
	filters,
	isFiltered = false,
	isSorted = false,
	onFilterClick,
	onSortClick,
	sortable = true,
	stickyHeader = false,
	WrapperComponent,
}: AggsGroupProps) => {
	const [isCollapsed, setIsCollapsed] = useState(false);

	const {
		colors,
		components: {
			Aggregations: {
				AggsGroup: {
					className: themeAggsGroupClassName,
					css: themeAggsGroupCSS,
					collapsedBackground: themeCollapsedAggsGroupBackground = colors?.grey?.[200],
					groupDividerColor: themeAggsGroupDividerColor = colors?.grey?.[300],
					headerBackground: themeAggsHeaderBackground = colors?.common?.white,
					headerDividerColor: themeAggsHeaderDividerColor = colors?.grey?.[200],
					headerFontColor: themeAggsHeaderFontColor = colors?.grey?.[900],
					headerSticky: themeAggsHeaderSticky = false,
					...aggsGroupTheme
				} = emptyObj,
			} = emptyObj,
		} = emptyObj,
	} = useThemeContext({ callerName: 'AggsGroup' });

	const toggleCollapse = () => {
		setIsCollapsed(!isCollapsed);
	};

	const collapsingDisabled = !collapsible;
	const filteringDisabled = !filterable || isCollapsed;
	const sortingDisabled = !sortable || isCollapsed;

	return WrapperComponent ? (
		<WrapperComponent
			{...{ collapsible, displayName }}
			{...dataFields}
		>
			{children}
		</WrapperComponent>
	) : (
		<article
			className={cx(styles.aggregationGroup)}
			data-iscollapsed={isCollapsed}
			{...aggsGroupTheme}
			{...dataFields}
		>
			<header className={cx([styles.header, { [styles.sticky]: stickyHeader }])}>
				<div className={cx(styles.titleWrapper)}>
					<div className={styles.titleWrapperInner}>
						{collapsible ? (
							<CollapsableButton
								displayName={displayName}
								disabled={collapsingDisabled}
								isCollapsed={isCollapsed}
								onClick={toggleCollapse}
							/>
						) : (
							<span className={cx(styles.title, 'title')}>{displayName}</span>
						)}
					</div>

					{sortable && (
						<div className={styles.iconWrapper}>
							<SortButton
								displayName={displayName}
								disabled={sortingDisabled}
								isActive={isSorted}
								onClick={onSortClick || (() => {})}
							/>
						</div>
					)}

					{filterable && (
						<div className={styles.iconWrapper}>
							<FilterButton
								displayName={displayName}
								disabled={filteringDisabled}
								isActive={isFiltered}
								onClick={onFilterClick || (() => {})}
							/>
						</div>
					)}
				</div>

				{!isCollapsed &&
					filters?.map(
						(
							filter,
							index, // safe "key": expected to be consistent throughout the runtime lifetime of the app
						) => (
							<div
								key={index}
								className="filter"
							>
								{filter}
							</div>
						),
					)}
			</header>

			{!isCollapsed && (
				<section className={cx(styles.bucket, 'bucket', { collapsed: isCollapsed })}>{children}</section>
			)}
		</article>
	);
};

export default AggsGroup;
