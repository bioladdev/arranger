import { css } from '@emotion/react';
import cx from 'classnames';
import { useEffect, useMemo, useState } from 'react';
import ReactTable from 'react-table-old';

import Pagination from './Table/index.js';

interface Tab {
	key?: string;
	title: string;
	content: React.ReactNode;
}

interface TabsProps {
	tabs: Tab[];
}

export const TabsTable = ({ className, columns, data, pageSize = 10, ...props }) => (
	<ReactTable
		{...{
			columns,
			data,
			className: `tabs-table ${className} -striped`,
			minRows: 0,
			sortable: false,
			resizable: false,
			pageSize,
			showPagination: data?.length > pageSize,
			PaginationComponent: (props) => (
				// TODO: this component relied on the old table. needs an update
				<Pagination {...props} showPageSizeOptions={false} paginationStyle={{ justifyContent: 'center' }} />
			),
			...props,
		}}
	/>
);

const Tabs = ({ tabs }: TabsProps) => {
	const [activeTab, setActiveTab] = useState<string | null>(null);

	const tabsWithKey = useMemo(
		() => tabs.map((x) => ({ ...x, key: x.key || x.title })),
		[tabs],
	);

	useEffect(() => {
		if (!activeTab && tabsWithKey.length > 0) {
			setActiveTab(tabsWithKey[0].key);
		}
	}, [activeTab, tabsWithKey]);

	return tabsWithKey.length ? (
		<div className="tabs">
			<div
				className="tabs-titles"
				css={css`
					display: flex;
				`}
			>
				{tabsWithKey.map(({ key, title }) => (
					<div
						key={key}
						className={cx('tabs-title', { 'active-tab': key === activeTab })}
						onClick={() => setActiveTab(key)}
					>
						{title}
					</div>
				))}
			</div>

			<div className="tabs-content">{tabsWithKey.find(({ key }) => key === activeTab)?.content}</div>
		</div>
	) : null;
};

export default Tabs;
