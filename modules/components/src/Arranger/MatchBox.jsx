import cx from 'classnames';
import React, { Fragment } from 'react';
import { capitalize, difference, get, uniqBy } from 'lodash-es';

import Input from '#Input/index';
import { toggleSQON } from '#SQONViewer/utils';

import Tabs, { TabsTable } from '../Tabs';
import { MatchBoxState, MATCHBOX_CHILD } from '../MatchBox/index';
import saveSet from '../utils/saveSet';
import formatNumber from '../utils/formatNumber';
import parseInputFiles from '../utils/parseInputFiles';

import QuickSearchQuery from '../QuickSearch/QuickSearchQuery';

import styles from './MatchBox.module.css';

const compose = (...fns) => (Component) => fns.reduceRight((acc, fn) => fn(acc), Component);
const withState = (key, setKey, initial) => (Component) => (props) => {
	const [value, setValue] = React.useState(initial);
	return <Component {...props} {...{ [key]: value, [setKey]: setValue }} />;
};
const withHandlers = (handlerCreators) => (Component) => (props) => {
	const handlers = Object.keys(handlerCreators).reduce((acc, key) => {
		acc[key] = (...args) => handlerCreators[key](props)(...args);
		return acc;
	}, {});
	return <Component {...props} {...handlers} />;
};

const enhance = compose(
	withState('activeEntityField', 'setActiveEntityField', null),
	withState('searchTextLoading', 'setSearchTextLoading', false),
	withState('searchText', 'setSearchText', ''),
	withHandlers({
		onEntityChange:
			({ setActiveEntityField }) =>
			({ target: { value } }) => {
				return setActiveEntityField(value);
			},
		onTextChange:
			({ setSearchText }) =>
			({ target: { value } }) =>
				setSearchText(value),
		onFileUpload:
			({ setSearchText, setSearchTextLoading }) =>
			async ({ target: { files } }) => {
				setSearchTextLoading(true);
				const contents = await parseInputFiles({ files });
				setSearchText((contents || []).map((f) => f.content).reduce((str, c) => `${str}${c}\n`, ``));
				setSearchTextLoading(false);
			},
	}),
);

const EntitySelectionSection = ({
	entitySelectText,
	onEntityChange,
	entitySelectPlaceholder,
	activeFields,
	uploadableFieldNames,
}) => (
	<div className={styles.matchBoxSelectEntityForm}>
		<div>{entitySelectText}</div>
		<select onChange={onEntityChange}>
			<option value={null}>{entitySelectPlaceholder}</option>
			{activeFields
				.filter(({ keyField: { fieldName } }) =>
					uploadableFieldNames ? uploadableFieldNames.includes(fieldName) : true,
				)
				.map(({ fieldName, displayName }) => (
					<option key={fieldName} value={fieldName}>
						{capitalize(displayName)}
					</option>
				))}
		</select>
	</div>
);

const inputRef = React.createRef();
const MatchBox = ({
	sqon,
	setSQON,
	matchHeaderText,
	instructionText = `Type or copy-and-paste a list of comma delimited identifiers`,
	placeholderText = `e.g. Id\ne.g. Id`,
	entitySelectText = `Select the entity to upload`,
	entitySelectPlaceholder = `Select an Entity`,
	matchedTabTitle = `Matched`,
	unmatchedTabTitle = `Unmatched`,
	matchTableColumnHeaders = {
		inputId: `Input Id`,
		matchedEntity: `Matched Entity`,
		entityId: `Entity Id`,
	},
	browseButtonText = `Browse`,
	ButtonComponent = 'button',
	LoadingComponent = <div>...</div>,
	children,
	searchText,
	searchTextParts,
	searchTextLoading,
	uploadInstructionText = 'Or choose file to upload',
	onTextChange,
	onFileUpload,
	onEntityChange,
	activeEntityField,
	uploadableFieldNames = null,
	setActiveEntityField,
	className,
	...props
}) => {
	const selectableEntityType = !(uploadableFieldNames && (uploadableFieldNames || []).length === 1);
	return (
		<div className={cx(styles.matchBox, className)}>
			<MatchBoxState
				{...props}
				onInitialLoaded={({ activeFields }) => {
					if (!selectableEntityType) {
						const activeFieldToSet = activeFields.find(
							({ keyField: { fieldName } }) => uploadableFieldNames[0] === fieldName,
						);
						if (activeFieldToSet) {
							setActiveEntityField(activeFieldToSet.field);
						} else {
							throw new Error(`no active field found by the path ${uploadableFieldNames[0]}`);
						}
					}
				}}
				render={({
					primaryKeyField,
					activeFields,
					activeField = activeFields.find((x) => x.field === activeEntityField),
				}) => (
					<Fragment>
						{!selectableEntityType ? null : (
							<EntitySelectionSection
								{...{
									entitySelectText,
									onEntityChange,
									entitySelectPlaceholder,
									activeFields,
									uploadableFieldNames,
								}}
							/>
						)}
						<div>
							<div className={styles.matchBoxSelectionText}>{instructionText}</div>
							<Input
								onChange={onTextChange}
								theme={{
									altText: `Match box`,
									Component: 'textarea',
									disabled: !activeField,
									margin: '0 0 1.5em 0',
									placeholder: placeholderText,
								}}
								value={searchText}
							/>
							<div className={styles.matchBoxUploadInstructionText}>{uploadInstructionText}</div>
							<div className={styles.matchBoxBrowseRow}>
								<input
									type="file"
									className={styles.matchBoxFileInput}
									aria-label={`File upload`}
									accept=".tsv,.csv,text/*"
									ref={inputRef}
									multiple
									onChange={onFileUpload}
								/>
								<ButtonComponent disabled={!activeField} type="submit" onClick={() => inputRef.current.click()}>
									{searchTextLoading ? LoadingComponent : browseButtonText}
								</ButtonComponent>
							</div>
						</div>
						<QuickSearchQuery
							exact
							instanceId={MATCHBOX_CHILD}
							size={9999999} // TODO: pagination - this will currently choke on large input
							{...props}
							searchText={searchText}
							primaryKeyField={activeField?.keyField}
							quickSearchFields={activeField?.searchFields}
							mapResults={({ results, searchTextParts }) => ({
								results: uniqBy(results, 'primaryKey'), // TODO: primaryKey removed from individual fields
								unmatchedKeys: difference(
									searchTextParts,
									results.map((x) => x.input),
								),
							})}
							render={({ results, unmatchedKeys, sqon: quickSearchSqon }) => (
								<div>
									{!!searchText.length && (
										<Fragment>
											{matchHeaderText}
											<Tabs
												tabs={[
													{
														key: 'matched',
														title: `${matchedTabTitle} (${formatNumber(results.length)})`,
														content: (
															<TabsTable
																columns={['inputId', 'matchedEntity', 'entityId'].map((x) => ({
																	Header: matchTableColumnHeaders[x],
																	accessor: x,
																}))}
																data={
																	results.length
																		? results.map(({ input, entityName, primaryKey }) => ({
																				inputId: input,
																				matchedEntity: entityName,
																				entityId: primaryKey,
																			}))
																		: [
																				{
																					inputId: '',
																					matchedEntity: '',
																					entityId: '',
																				},
																			]
																}
															/>
														),
													},
													{
														key: 'unmatched',
														title: `${unmatchedTabTitle} (${formatNumber(unmatchedKeys.length)})`,
														content: (
															<TabsTable
																columns={[
																	{
																		Header: matchTableColumnHeaders.inputId,
																		accessor: 'inputId',
																	},
																]}
																data={
																	unmatchedKeys?.length ? unmatchedKeys.map((x) => ({ inputId: x })) : [{ inputId: '' }]
																}
															/>
														),
													},
												]}
											/>
										</Fragment>
									)}
									{children({
										hasResults: results?.length,
										saveSet: async ({ userId, apiFetcher, dataPath = 'data.data.saveSet' }) => {
											const data = get(
												await saveSet({
													sqon: quickSearchSqon,
													type: props.documentType,
													userId,
													path: primaryKeyField.field,
													apiFetcher,
												}),
												dataPath,
											);
											const nextSQON = toggleSQON(
												{
													op: 'and',
													content: [
														{
															op: 'in',
															content: {
																field: primaryKeyField?.field,
																value: [`set_id:${data.setId}`],
															},
														},
													],
												},
												sqon,
											);
											setSQON?.(nextSQON);
											return { ...data, nextSQON };
										},
									})}
								</div>
							)}
							searchTextParts={searchTextParts}
						/>
					</Fragment>
				)}
			/>
		</div>
	);
};

export default enhance(MatchBox);
