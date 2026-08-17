import cx from 'classnames';
import { useState } from 'react';

import { TransparentButton } from '#Button/index';
import { ArrowIcon } from '#Icons/index';
import { useThemeContext } from '#ThemeContext/index';
import noopFn, { emptyObj } from '#utils/noops';

import styles from './QuickSearchWrapper.module.css';

const BaseWrapper = ({ className, ...props }) => <section {...props} className={cx(styles.baseWrapper, className)} />;

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
		components: {
			QuickSearch: {
				QuickSearchWrapper: {
					className: themeClassName,
					style: themeQuickSearchWrapperCSS,
					collapsible: themeQuickSearchWrapperCollapsible = true,
					dividerColor: themeQuickSearchWrapperDividerColor,
					headerBackground: themeQuickSearchWrapperHeaderBackground,
					headerDividerColor: themeQuickSearchWrapperHeaderDividerColor,
					headerFontColor: themeQuickSearchWrapperHeaderFontColor,
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

	/** @type {import('react').CSSProperties & Record<`--arranger-qs-wrapper-${string}`, string | undefined>} */
	const wrapperThemeStyle = {
		'--arranger-qs-wrapper-divider-color': themeQuickSearchWrapperDividerColor,
		'--arranger-qs-wrapper-header-background': themeQuickSearchWrapperHeaderBackground,
		'--arranger-qs-wrapper-header-divider-color': themeQuickSearchWrapperHeaderDividerColor,
		'--arranger-qs-wrapper-header-font-color': themeQuickSearchWrapperHeaderFontColor,
		'--arranger-qs-wrapper-action-icon-padding': ActionIcon ? `calc(${themeActionIconSize}* 1.3px)` : undefined,
	};

	return (
		<BaseWrapper className={customClassName}>
			<article
				className={cx(styles.wrapper, customClassName || themeClassName)}
				data-collapsed={isCollapsed}
				style={{ ...wrapperThemeStyle, ...themeQuickSearchWrapperCSS }}
				ref={componentRef}
				{...quickSearchWrapperTheme}
				{...dataFields}
			>
				<header
					className={styles.header}
					data-sticky={Boolean(stickyHeader || themeQuickSearchWrapperHeaderSticky)}
					ref={headerRef}
				>
					<div
						className={styles.titleWrapper}
						data-collapsed={isCollapsed}
					>
						<TransparentButton
							className={styles.titleControl}
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
								className={styles.title}
								data-has-action={Boolean(ActionIcon)}
								style={wrapperThemeStyle}
							>
								{headerTitle}
							</span>
						</TransparentButton>

						{ActionIcon && (
							<TransparentButton
								className={styles.actionIcon}
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
								<div key={index} className={styles.filterRow}>
									{filter}
								</div>
							),
						)}
				</header>

				{!isCollapsed && <section className={styles.filter}>{children}</section>}
			</article>
		</BaseWrapper>
	);
};

export default QuickSearchWrapper;
