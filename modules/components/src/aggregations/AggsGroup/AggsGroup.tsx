import type { ComponentType, ReactNode } from 'react';

import { css } from '@emotion/react';
import cx from 'classnames';
import { useState } from 'react';

import { TransparentButton } from '#Button/index.js';
import { ArrowIcon, SearchIcon, SortAlphaIcon } from '#Icons/index.js';
import { useThemeContext } from '#ThemeContext/index.js';
import { emptyObj } from '#utils/noops.js';

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
	componentRef?: any;
	dataFields?: any;
	displayName?: string;
	filterable?: boolean;
	filters?: any[];
	headerRef?: any;
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
	componentRef,
	dataFields = emptyObj,
	displayName = 'Unnamed Field',
	filterable = true,
	filters,
	headerRef,
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
		<WrapperComponent {...{ collapsible, displayName, componentRef, headerRef }} {...dataFields}>
			{children}
		</WrapperComponent>
	) : (
		<article
			className={cx('aggregation-group', themeAggsGroupClassName, customClassName)}
			css={[
				themeAggsGroupCSS,
				css`
					border-bottom: 0.05rem solid transparent;
					border-color: ${themeAggsGroupDividerColor};
					box-sizing: border-box;
					padding-bottom: ${isCollapsed ? 0 : '0.3rem'};
				`,
			]}
			ref={componentRef}
			{...aggsGroupTheme}
			{...dataFields}
		>
			<header
				className={cx('header', { collapsed: isCollapsed })}
				css={css`
					background: ${themeAggsHeaderBackground};
					box-sizing: border-box;
					padding: 0 6px;
					position: ${stickyHeader || themeAggsHeaderSticky ? `sticky` : `relative`};
					top: 0px;

					&.collapsed {
						background: ${themeCollapsedAggsGroupBackground};
					}
				`}
				ref={headerRef}
			>
				<div
					className={cx('title-wrapper', { collapsed: isCollapsed })}
					css={css`
						align-items: center;
						border-bottom: 0.1rem solid ${themeAggsHeaderDividerColor};
						box-sizing: border-box;
						display: flex;
						padding: 6px 0 4px;
					`}
				>
					<div
						css={css`
							padding: 2px 0;
							width: 100%;
						`}
					>
						{collapsible ? (
							<CollapsableButton
								displayName={displayName}
								disabled={collapsingDisabled}
								isCollapsed={isCollapsed}
								onClick={toggleCollapse}
							/>
						) : (
							<span
								className="title"
								css={css`
									color: ${themeAggsHeaderFontColor || 'inherit'};
									font-size: 0.9rem;
									margin-left: 0.5rem;
								`}
							>
								{displayName}
							</span>
						)}
					</div>

					{sortable && (
						<div
							css={css`
								cursor: pointer;
								margin-left: 0.4rem;
								margin-top: 0.1rem;
								padding: 0.2rem;
							`}
						>
							<SortButton
								displayName={displayName}
								disabled={sortingDisabled}
								isActive={isSorted}
								onClick={onSortClick || (() => {})}
							/>
						</div>
					)}

					{filterable && (
						<div
							css={css`
								cursor: pointer;
								margin-left: 0.4rem;
								margin-top: 0.1rem;
								padding: 0.2rem;
							`}
						>
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
							<div key={index} className="filter">
								{filter}
							</div>
						),
					)}
			</header>

			{!isCollapsed && (
				<section
					className={cx('bucket', { collapsed: isCollapsed })}
					css={css`
						align-items: flex-end;
						display: flex;
						flex-direction: column;
						padding: 0.1rem 0.3rem;
					`}
				>
					{children}
				</section>
			)}
		</article>
	);
};

export default AggsGroup;
