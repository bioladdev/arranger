import cx from 'classnames';
import { useState } from 'react';

import { TransparentButton } from '#Button/index';
import { ArrowIcon } from '#Icons/index';
import { useThemeContext } from '#ThemeContext/index';
import noopFn, { emptyObj } from '#utils/noops';

const BaseWrapper = ({ className, ...props }) => <section {...props} className={cx('quicksearch', className)} />;

const QuickSearchWrapper = ({
	actionIcon: { Icon: CustomActionIcon = undefined, onClick: customActionIconHandler = undefined } = emptyObj,
	children,
	className: customClassName = '',
	collapsible: customCollapsible = true,
	componentRef = undefined,
	dataFields = emptyObj,
	displayName: customHeaderTitle = '',
	filters = undefined,
	headerRef = undefined,
	stickyHeader = true,
}) => {
	const [isCollapsed, setIsCollapsed] = useState(false);
	const {
		colors,
		components: {
			QuickSearch: {
				QuickSearchWrapper: {
					className: themeClassName,
					style: themeQuickSearchWrapperCSS,
					collapsedBackground: themeQuickSearchWrapperCollapsedBackground = colors?.grey?.[200],
					collapsible: themeQuickSearchWrapperCollapsible = true,
					dividerColor: themeQuickSearchWrapperDividerColor = colors?.grey?.[300],
					headerBackground: themeQuickSearchWrapperHeaderBackground = colors?.common?.white,
					headerDividerColor: themeQuickSearchWrapperHeaderDividerColor = colors?.grey?.[200],
					headerFontColor: themeQuickSearchWrapperHeaderFontColor = colors?.grey?.[900],
					headerSticky: themeQuickSearchWrapperHeaderSticky = false,
					headerTitle: themeWrapperHeaderTitle,
					...quickSearchWrapperTheme
				} = emptyObj,
				ActionIcon: {
					Icon: ThemeActionIcon,
					onClick: themeActionIconHandler = noopFn,
					size: themeActionIconSize = '14',
					...actionIconTheme
				} = emptyObj,
				TreeJointIcon: {
					className: themeTreeJointIconClassName,
					size: themeTreeJointIconSize = 9,
					Icon: ThemeTreeJointIcon = ArrowIcon,
					...treeJointIconTheme
				} = emptyObj,
			} = emptyObj,
		} = emptyObj,
	} = useThemeContext({ callerName: 'QuickSearch' });

	const ActionIcon = CustomActionIcon || ThemeActionIcon;
	const TreeJointIcon = ThemeTreeJointIcon;
	const collapsible = customCollapsible || themeQuickSearchWrapperCollapsible;
	const headerTitle = customHeaderTitle || themeWrapperHeaderTitle;

	return (
		<BaseWrapper className={customClassName}>
			<article
				className={cx('quicksearch-wrapper', customClassName || themeClassName)}
				style={{ borderBottom: '0.05rem solid transparent', borderColor: themeQuickSearchWrapperDividerColor, boxSizing: 'border-box', paddingBottom: isCollapsed ? 0 : '0.3rem', ...themeQuickSearchWrapperCSS }}
				ref={componentRef}
				{...quickSearchWrapperTheme}
				{...dataFields}
			>
				<header
					className={cx('header', { collapsed: isCollapsed })}
					style={{ background: themeQuickSearchWrapperHeaderBackground, boxSizing: 'border-box', padding: '0 6px', position: stickyHeader || themeQuickSearchWrapperHeaderSticky ? 'sticky' : 'relative', top: '0px' }} // TODO: restore pseudo-selector styles via CSS
					ref={headerRef}
				>
					<div
						className={cx('title-wrapper', { collapsed: isCollapsed })}
						style={{ alignItems: 'center', borderBottom: `0.1rem solid ${themeQuickSearchWrapperHeaderDividerColor}`, boxSizing: 'border-box', display: 'flex', padding: '6px 0 4px' }}
					>
						<TransparentButton
							className="title-control"
							style={{ padding: '2px 0', width: '100%' }}
							onClick={collapsible ? () => setIsCollapsed(!isCollapsed) : undefined}
						>
							{collapsible && (
								<TreeJointIcon
									className={cx('treejoint', themeTreeJointIconClassName)}
									height={themeTreeJointIconSize}
									isTreeJoint
									pointUp={!isCollapsed}
									size={themeTreeJointIconSize}
									width={themeTreeJointIconSize}
									{...treeJointIconTheme}
								/>
							)}

							<span
								className="title"
								style={{ color: themeQuickSearchWrapperHeaderFontColor || 'inherit', fontSize: '1rem', marginLeft: '0.5rem', ...(ActionIcon && { paddingRight: `calc(${themeActionIconSize}* 1.3px)` }) }}
							>
								{headerTitle}
							</span>
						</TransparentButton>

						{ActionIcon && (
							<TransparentButton
								className="action-icon"
								style={{ cursor: 'pointer', marginLeft: '0.4rem', marginTop: '0.1rem', padding: '0.2rem', position: 'absolute', right: '6px' }}
								hidden={isCollapsed}
							>
								<ActionIcon
									height={themeActionIconSize}
									onClick={customActionIconHandler || themeActionIconHandler}
									size={themeActionIconSize}
									width={themeActionIconSize}
									{...actionIconTheme}
								/>
							</TransparentButton>
						)}
					</div>

					{!isCollapsed &&
						filters?.map(
							(
								filter,
								index, // expected to be consistent throughout the runtime lifetime of the app
							) => (
								<div key={index} className="filter">
									{filter}
								</div>
							),
						)}
				</header>

				{!isCollapsed && (
					<section
						className={cx('filter', { collapsed: isCollapsed })}
						style={{ boxSizing: 'border-box', padding: '0 6px', top: '0px' }}
					>
						{children}
					</section>
				)}
			</article>
		</BaseWrapper>
	);
};

export default QuickSearchWrapper;
