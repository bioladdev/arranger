import { isEqual } from 'lodash-es';
import React, { forwardRef, memo, useCallback, useEffect, useRef, useState } from 'react';

import aggComponentsMap from '#aggregations/aggComponentsMap.js';
import TextHighlight from '#TextHighlight/index.js';

const serializeToDomId = (path) => path.split('.').join('__');

const flattenDisplayTreeData = (displayTreeData) => {
	return displayTreeData.reduce(
		(acc, node) => [...acc, ...(node.children ? flattenDisplayTreeData(node.children) : [node])],
		[],
	);
};

interface FacetViewProps {
	aggregations: Record<string, any>;
	displayTreeData: any[];
	onValueChange: (args: { sqon: any; value: any }) => void;
	sqon?: any;
	extendedMapping: any[];
	searchString?: string;
	onTermSelected?: (value: any) => void;
}

const FacetView = memo(
	forwardRef<{ scrollToPath: (args: { path: string; behavior?: ScrollBehavior; block?: ScrollLogicalPosition }) => void }, FacetViewProps>(
		({ aggregations, displayTreeData, onValueChange, sqon = null, extendedMapping, searchString, onTermSelected }, ref) => {
			const [focusedPath, setFocusedPath] = useState<string | null>(null);
			const rootRef = useRef<HTMLDivElement>(null);
			const prevSqonRef = useRef(sqon);

			const scrollToPath = useCallback(({ path, behavior = 'smooth', block = 'start' }: { path: string; behavior?: ScrollBehavior; block?: ScrollLogicalPosition }) => {
				const targetElementId = serializeToDomId(path);
				const targetElement = rootRef.current?.querySelector(`#${targetElementId}`);
				if (targetElement) {
					targetElement.scrollIntoView({ behavior, block });
				}
			}, []);

			// Expose scrollToPath method via ref
			React.useImperativeHandle(ref, () => ({
				scrollToPath,
			}), [scrollToPath]);

			useEffect(() => {
				const lastSqon = prevSqonRef.current;
				if (!isEqual(lastSqon, sqon) && focusedPath) {
					scrollToPath({
						path: focusedPath,
						block: 'start',
						behavior: 'smooth',
					});
					setFocusedPath(null);
				}
				prevSqonRef.current = sqon;
			}, [sqon, focusedPath, scrollToPath]);
			return (
				<div className="facetView" ref={rootRef}>
				{flattenDisplayTreeData(displayTreeData).map(({ path }) => {
					const metaData = extendedMapping.find(({ field }) => field === path);
					const { type } = metaData || {};
					const paths = path
						.split('.')
						.reduce((acc, node, i, paths) => [...acc, [...paths.slice(0, i), node].join('.')], []);
					const pathDisplayNames = paths.map(
						(path) => extendedMapping.find(({ field }) => field === path)?.displayName,
					);
					const agg = aggregations[path];
					return aggComponentsMap[type]?.({
						...metaData,
						...agg,
						...(type === 'keyword'
							? (() => {
								const columns = 4;
								const maxTerms = columns * 2;
								return {
									maxTerms,
									constructBucketItemClassName: ({ bucket, showingBuckets, i, showingMore }) =>
										`row_${Math.floor(i / columns)} col_${i % columns} ${Math.floor(i / columns) === Math.floor((showingBuckets.length - 1) / columns) ? 'last_row' : ''
										} ${showingBuckets.length <= columns ? 'only_row' : ''}`,
								};
							})()
							: {}),
						key: path,
						field: path,
						getRangeAggProps: () => {
							return {
								step: metaData.rangeStep,
							};
						},
						onValueChange: ({ sqon, value }) => {
							setFocusedPath(path);
							onValueChange({ sqon, value });
							onTermSelected?.(value);
						},
						highlightText: searchString,
						sqon,
						facetView: true,
						WrapperComponent: ({ displayName, collapsible, children }) => (
							<div id={serializeToDomId(path)} className={`facetContainer`}>
								<div className={`header`}>
									<div className={`title`}>
										<TextHighlight content={displayName} highlightText={searchString} />
									</div>
									<div className={`breadscrumbs`}>
										{pathDisplayNames.slice(0, -1).map((pathName, index, arr) => (
											<span key={index} className={`breadscrumb-item`}>
												{pathName}
											</span>
										))}
									</div>
								</div>
								<div className={`content`}>{children}</div>
							</div>
						),
					});
				})}
				</div>
			);
		},
	),
);

FacetView.displayName = 'FacetView';

export default FacetView;
