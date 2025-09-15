import { memo, useCallback, useState } from 'react';

interface TreeViewProps {
	defaultCollapsed?: boolean;
	collapsed?: boolean;
	className?: string;
	itemClassName?: string;
	treeViewClassName?: string;
	childrenClassName?: string;
	nodeLabel: (args: { open: () => void }) => React.ReactNode;
	children?: React.ReactNode;
	onClick?: (...args: any[]) => void;
	renderArrow?: (args: {
		props: any;
		state: { collapsed: boolean };
		handleClick: (...args: any[]) => void;
	}) => React.ReactNode;
	[key: string]: any;
}

const TreeView = memo<TreeViewProps>(({
	defaultCollapsed = false,
	collapsed: controlledCollapsed,
	className = '',
	itemClassName = '',
	treeViewClassName = '',
	childrenClassName = '',
	nodeLabel,
	children,
	onClick,
	renderArrow = () => null,
	...rest
}) => {
	const [internalCollapsed, setInternalCollapsed] = useState(defaultCollapsed);
	
	const collapsed = controlledCollapsed !== undefined ? controlledCollapsed : internalCollapsed;

	const handleClick = useCallback((...args: any[]) => {
		if (controlledCollapsed === undefined) {
			setInternalCollapsed((prev) => !prev);
		}
		onClick?.(...args);
	}, [controlledCollapsed, onClick]);

	let arrowClassName = 'tree-view_arrow';
	let containerClassName = 'tree-view_children';
	if (collapsed) {
		arrowClassName += ' tree-view_arrow-collapsed';
		containerClassName += ' tree-view_children-collapsed';
	}

	const arrow = renderArrow({
		props: { ...rest, className: className + ' ' + arrowClassName },
		state: { collapsed },
		handleClick,
	}) || <div {...rest} className={className + ' ' + arrowClassName} onClick={handleClick} />;

	return (
		<div className={'tree-view ' + treeViewClassName}>
			<div className={'tree-view_item ' + itemClassName}>
				{arrow}
				{nodeLabel({ open: handleClick })}
			</div>
			<div className={containerClassName + ' ' + childrenClassName}>{collapsed ? null : children}</div>
		</div>
	);
});

TreeView.displayName = 'TreeView';

export default TreeView;
