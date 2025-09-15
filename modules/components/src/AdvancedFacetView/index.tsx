import { css } from '@emotion/react';
import { debounce, keys, isEqual, pick } from 'lodash-es';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FaFilter, FaTimesCircle } from 'react-icons/fa';

import TextInput from '#Input/index.js';
import Spinner from '#Loader/index.js';
import NestedTreeView from '#NestedTreeView/index.js';
import SQONViewer from '#SQONViewer/index.js';
import Stats from '#Stats/index.js';
import noopFn from '#utils/noops.js';

import './AdvancedFacetView.css';
import FacetView from './FacetView.js';
import {
	filterOutNonValue,
	injectExtensionToElasticMapping,
	orderDisplayTreeData,
	filterDisplayTreeDataBySearchTerm,
} from './utils.js';

interface AdvancedFacetViewProps {
	elasticMapping?: Record<string, any>;
	extendedMapping?: any[];
	aggregations?: Record<string, any>;
	sqon?: any;
	statsConfig?: any;
	translateSQONValue?: (value: any) => any;
	onSqonFieldChange?: (args: { sqon: any }) => void;
	onFacetNavigation?: (path: string) => void;
	onTermSelected?: (args: any) => void;
	onClear?: () => void;
	onFilterChange?: (value: string) => void;
	InputComponent?: React.ComponentType<any>;
	rootTypeName?: string;
	[key: string]: any;
}

const AdvancedFacetView = ({
	elasticMapping = {},
	extendedMapping = [],
	aggregations = {},
	sqon,
	statsConfig,
	translateSQONValue,
	onSqonFieldChange = noopFn,
	onFacetNavigation = noopFn,
	onTermSelected,
	onClear,
	onFilterChange = noopFn,
	InputComponent = TextInput,
	rootTypeName,
	...props
}: AdvancedFacetViewProps) => {
	const [state, setState] = useState({
		selectedPath: null,
		withValueOnly: true,
		searchTerm: null,
		displayTreeData: null,
		isLoading: true,
	});
	
	const [filterInputValue, setFilterInputValue] = useState('');
	const facetViewRef = useRef<any>(null);
	const prevPropsRef = useRef({ elasticMapping, extendedMapping, aggregations, sqon });

	const fieldMappingFromPath = useCallback((path: string) => {
		return (
			path
				.split('.')
				.reduce(
					(parentNode, nextPath) =>
						parentNode[nextPath] ? parentNode[nextPath] : parentNode.properties ? parentNode.properties[nextPath] : {},
					elasticMapping,
				) || {}
		);
	}, [elasticMapping]);

	const constructFilterId = useCallback(({ fieldName, value }: { fieldName: string; value?: any }) => 
		value ? `${fieldName}---${value}` : fieldName, []);

	const handleSqonChange = useCallback(({ sqon }: { sqon: any }) => {
		setState((prev) => ({ ...prev, isLoading: true }));
		onSqonFieldChange({ sqon });
	}, [onSqonFieldChange]);

	// Handle display tree data computation
	useEffect(() => {
		const prevProps = prevPropsRef.current;
		const shouldRecomputeDisplayTree = !isEqual(
			pick({ elasticMapping, extendedMapping }, ['elasticMapping', 'extendedMapping']),
			pick(prevProps, ['elasticMapping', 'extendedMapping']),
		);
		
		if (shouldRecomputeDisplayTree) {
			setState((prev) => ({
				...prev,
				displayTreeData: orderDisplayTreeData(
					injectExtensionToElasticMapping({
						rootTypeName,
						elasticMapping,
						extendedMapping,
					}),
				),
			}));
		}
	}, [elasticMapping, extendedMapping, rootTypeName]);

	// Handle loading state
	useEffect(() => {
		const prevProps = prevPropsRef.current;
		const aggChanged = !isEqual(aggregations, prevProps.aggregations);
		const sqonChanged = !isEqual(sqon, prevProps.sqon);
		
		if (aggChanged || sqonChanged) {
			setState((prev) => ({ ...prev, isLoading: false }));
		}

		prevPropsRef.current = { elasticMapping, extendedMapping, aggregations, sqon };
	}, [aggregations, sqon, elasticMapping, extendedMapping]);

	const setSearchTerm = useMemo(
		() =>
			debounce((value: string) => {
				onFilterChange(value);
				setState((prev) => ({ ...prev, searchTerm: value }));
			}, 500),
		[onFilterChange],
	);

	const { selectedPath, withValueOnly, searchTerm, displayTreeData = {}, isLoading } = state;

	const scrollFacetViewToPath = useCallback((path: string) => {
		facetViewRef.current?.scrollToPath({ path });
		onFacetNavigation(path);
	}, [onFacetNavigation]);

	const visibleDisplayTreeData = useMemo(() => {
		return withValueOnly
			? filterOutNonValue({
					extendedMapping,
					displayTreeData,
					aggregations,
				}).displayTreeDataWithValue
			: displayTreeData;
	}, [withValueOnly, extendedMapping, displayTreeData, aggregations]);

	return (
		<div className="advancedFacetViewWrapper">
			{displayTreeData && (
				<>
					<div>
						<SQONViewer
							{...{ sqon, translateSQONValue, onClear }}
							setSQON={(sqon) => handleSqonChange({ sqon })}
						/>
					</div>
					<div className="facetViewWrapper">
						<div className="panel treeViewPanel">
							<div className="treeView">
								<div className="panelHeading">
									<span className="fieldsShown">
										{withValueOnly
											? keys(
													filterOutNonValue({
														aggregations,
													}).aggregationsWithValue,
												).length
											: Object.keys(aggregations).length}{' '}
										fields
									</span>
									<span
										className="valueOnlyCheck"
										style={{ cursor: 'pointer' }}
										onClick={() =>
											setState((prev) => ({
												...prev,
												selectedPath: displayTreeData[0]?.path,
												withValueOnly: !withValueOnly,
											}))
										}
									>
										<input type="checkBox" checked={withValueOnly} aria-label={`Show only fields with value`} />
										Show only fields with value
									</span>
								</div>
								<NestedTreeView
									searchString={searchTerm}
									defaultCollapsed={({ depth }) => depth !== 0}
									shouldCollapse={() => {
										// if there's a searchTerm, expand everything. Else, don't control
										return searchTerm && searchTerm.length ? false : undefined;
									}}
									dataSource={visibleDisplayTreeData}
									selectedPath={selectedPath}
									onLeafSelect={(path) => {
										scrollFacetViewToPath(path);
										setState((prev) => ({ ...prev, selectedPath: path }));
									}}
								/>
							</div>
						</div>
						<div className={`panel facetsPanel`}>
							<div className={`panelHeading`}>
								<InputComponent
									className="filterInput"
									onChange={({ target: { value } }) => {
										setFilterInputValue(value);
										setSearchTerm(value);
									}}
									theme={{
										altText: 'Data filter',
										leftIcon: { Icon: FaFilter },
										placeholder: 'Filter',
										rightIcon: {
											Icon: FaTimesCircle,
											onClick: () => {
												setFilterInputValue('');
												setState((prev) => ({ ...prev, searchTerm: null }));
											},
										},
									}}
									type="text"
									value={filterInputValue}
								/>
								{statsConfig && (
									<div
										css={css`
											display: flex;
											flex: 1;
											height: 100%;
										`}
									>
										<Stats
											small
											transparent
											{...props}
											{...{ sqon }}
											stats={statsConfig}
											className={css`
												flex-grow: 1;
											`}
										/>
									</div>
								)}
							</div>
							<div className={`facets`}>
								<FacetView
									extendedMapping={extendedMapping}
									constructEntryId={constructFilterId}
									ref={facetViewRef}
									sqon={sqon}
									onValueChange={handleSqonChange}
									aggregations={aggregations}
									searchString={searchTerm}
									displayTreeData={filterDisplayTreeDataBySearchTerm({
										displayTree: visibleDisplayTreeData,
										aggregations,
										searchTerm: searchTerm,
									})}
									onTermSelected={onTermSelected}
								/>
							</div>
						</div>
					</div>
				</>
			)}
			{isLoading && <Spinner />}
		</div>
	);
};

export default AdvancedFacetView;
