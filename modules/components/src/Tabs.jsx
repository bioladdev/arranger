import cx from 'classnames';
import ReactTable from 'react-table-old';
import { useState } from 'react';

import Pagination from './Table/index';
import styles from './Tabs.module.css';

const compose = (...fns) => (Component) => fns.reduceRight((acc, fn) => fn(acc), Component);
const withState = (key, setKey, initial) => (Component) => (props) => {
	const [value, setValue] = useState(initial);
	return <Component {...props} {...{ [key]: value, [setKey]: setValue }} />;
};
const withPropsOnChange = (dependencies, propsMapper) => (Component) => (props) => {
	const mappedProps = propsMapper(props);
	return <Component {...props} {...mappedProps} />;
};

const enhance = compose(
	withState('activeTab', 'setActiveTab', null),
	withPropsOnChange(['tabs'], ({ tabs, activeTab, setActiveTab }) => {
		const tabsWithKey = tabs.map((x) => ({ ...x, key: x.key || x.title }));
		!activeTab && tabs?.length && setActiveTab(tabsWithKey[0].key);
		return { tabs: tabsWithKey };
	}),
);

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

const Tabs = ({ tabs, activeTab, setActiveTab, className }) =>
	tabs?.length ? (
		<div className={cx(styles.tabs, className)}>
			<div className={styles.tabsTitles}>
				{tabs.map(({ key, title }) => (
					<div
						key={key}
						className={styles.tabsTitle}
						data-active={key === activeTab}
						onClick={() => setActiveTab(key)}
					>
						{title}
					</div>
				))}
			</div>

			<div>{tabs.find(({ key }) => key === activeTab)?.content}</div>
		</div>
	) : null;

export default enhance(Tabs);
