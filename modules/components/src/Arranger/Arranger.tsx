import React, { Children, Component } from 'react';

import { DataProvider } from '#DataContext/index.js';
import type { APIFetcherFn } from '#DataContext/types.js';

import defaultApiFetcher from '../utils/api.js';

// TODO: This is a dummy object, exported for the DataContext's types, to ensure that a TS
// error comes up when this component is deprecated in a later version, after the rewrite
export let legacyProps: any;

interface ArrangerProps {
	index?: string;
	documentType: string;
	children?: React.ReactNode | ((props: any) => React.ReactNode);
	render?: (props: any) => React.ReactNode;
	component?: React.ComponentType<any>;
	apiFetcher?: APIFetcherFn;
}

interface ArrangerState {
	selectedTableRows: any[];
	sqon: any;
}

/** Arranger Root Component
 * @deprecated since v3.0.0 - Will be removed in v4.0.0
 * 
 * ⚠️  MIGRATION REQUIRED ⚠️
 * This component is deprecated and will be removed in the next major version.
 * 
 * Please migrate to the new DataProvider pattern:
 * 
 * OLD:
 * ```jsx
 * <Arranger documentType="files" apiFetcher={myFetcher}>
 *   {({ sqon, setSQON }) => <MyComponent sqon={sqon} setSQON={setSQON} />}
 * </Arranger>
 * ```
 * 
 * NEW:
 * ```jsx
 * <DataProvider documentType="files" customFetcher={myFetcher}>
 *   <MyComponent />
 * </DataProvider>
 * ```
 * 
 * Use `useDataContext()` hook inside MyComponent to access sqon, setSQON, etc.
 */

class Arranger extends Component<ArrangerProps, ArrangerState> {
	constructor(props: ArrangerProps) {
		super(props);

		this.state = {
			selectedTableRows: [],
			sqon: null,
		};
	}

	UNSAFE_componentWillMount() {
		// Deprecation warning
		console.warn(
			'⚠️  DEPRECATION WARNING: <Arranger> component is deprecated and will be removed in v4.0.0.\n' +
			'Please migrate to <DataProvider> and useDataContext() hook.\n' +
			'See migration guide: https://github.com/overture-stack/arranger#migration-guide'
		);

		const hasChildren = this.props.children && Children.count(this.props.children) !== 0;

		if (this.props.component && this.props.render) {
			console.warn(
				'You should not use <Arranger component> and <Arranger render> in the same arranger; <Arranger render> will be ignored',
			);
		}

		if (this.props.component && hasChildren) {
			console.warn(
				'You should not use <Arranger component> and <Arranger children> in the same arranger; <Arranger children> will be ignored',
			);
		}

		if (this.props.render && hasChildren) {
			console.warn(
				'You should not use <Arranger render> and <Arranger children> in the same arranger; <Arranger children> will be ignored',
			);
		}
	}

	setSelectedTableRows = (selectedTableRows: any[]) => this.setState({ selectedTableRows });
	setSQON = (sqon: any) => this.setState({ sqon });

	render() {
		const { index, documentType, children, render, component, apiFetcher = defaultApiFetcher } = this.props;
		const { sqon, selectedTableRows } = this.state;
		const { setSelectedTableRows, setSQON } = this;

		const childProps = {
			apiFetcher,
			documentType,
			index,
			selectedTableRows,
			setSelectedTableRows,
			setSQON,
			sqon,
		};

		legacyProps = { index, selectedTableRows, setSelectedTableRows, setSQON, sqon };

		return (
			<DataProvider 
				apiUrl="http://localhost:5050" 
				customFetcher={apiFetcher} 
				documentType={documentType} 
				legacyProps={legacyProps}
			>
				{component
					? React.createElement(component, childProps)
					: render
						? render(childProps)
						: children
							? typeof children === 'function'
								? children(childProps)
								: children
							: null}
			</DataProvider>
		);
	}
}

export default Arranger;
