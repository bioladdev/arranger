import { useRef, useState } from 'react';
import { FaSearch } from 'react-icons/fa';

import { useDataContext } from '#DataContext/index';
import type { SQONType } from '#DataContext/types';
import { MATCHBOX_CHILD } from '#MatchBox/index';
import { Value as SQONBubble } from '#SQONViewer/index';
import { currentFieldValue, toggleSQON } from '#SQONViewer/utils';
import TextFilter from '#TextFilter/index';
import { useThemeContext } from '#ThemeContext/index';
import { emptyObj } from '#utils/noops';
import internalTranslateSQONValue from '#utils/translateSQONValue';

import { useSearchFields } from './helpers';
import styles from './QuickSearch.module.css';
import DropdownItem from './QuickSearchDropdown';
import QuickSearchQuery from './QuickSearchQuery';
import QuickSearchWrapper from './QuickSearchWrapper';
import type { QuickSearchProps, SearchResult } from './types';

const currentValues = ({
	displayField,
	sqon,
}: {
	displayField: Record<string, any>; ///////////
	sqon: SQONType;
}) => {
	return currentFieldValue({ sqon, dotFieldName: displayField?.fieldName, op: 'in' });
};

const toggleValue = ({
	primaryKey,
	displayField,
	sqon,
}: {
	primaryKey: string; /////////////
	displayField: Record<string, any>; /////////////
	sqon: SQONType;
}) =>
	toggleSQON(
		{
			op: 'and',
			content: [
				{
					op: 'in',
					content: {
						fieldName: displayField?.fieldName,
						value: ([] as string[]).concat(primaryKey || []), ///////////
					},
				},
			],
		},
		sqon,
	);

const QuickSearch = ({
	disabled: customDisabled,
	displayFieldName: customDisplayFieldName,
	fieldNames: customFieldNames,
	name: instanceId,
	theme: {
		headerTitle: customHeaderTitle,
		FilterInput: {
			// Icon: customIcon,
			// InputComponent: customInputComponent,
			// LoadingIcon: customLoadingIcon,
			margin: customFilterInputMargin,
			placeholder: customFilterInputPlaceholder,
			...customFilterInputProps
		} = emptyObj,
	} = emptyObj,
}: QuickSearchProps) => {
	const [isDropdownOpen, setDropdownOpen] = useState(false);
	const [isNewSearch, setNewSearch] = useState(false);
	const [value, setValue] = useState('');
	const inputRef = useRef();
	const { apiFetcher, documentType, sqon, setSQON } = useDataContext();
	const {
		components: {
			QuickSearch: {
				disabled: themeDisabled,
				displayFieldName: themeDisplayFieldName,
				fieldNames: themeFieldNames,
				headerTitle: themeHeaderTitle,
				placeholder: themePlaceholder = 'Quick Search',

				DropDownItems: { DropdownItemComponent = DropdownItem, style: themeDropDownItemsCSS = emptyObj } = emptyObj,
				FilterInput: {
					Icon = FaSearch,
					InputComponent = TextFilter,
					LoadingIcon = FaSearch,
					margin: themeFilterInputMargin = '0.5rem 0 0.3rem',
					placeholder: themeFilterInputPlaceholder,
					...themeFilterInputProps
				} = emptyObj,
				QuickSearchQuery: {
					searchLowercase: themeQuickSearchQuerySearchLowercase = false,
					searchTextDelimiters: themeQuickSearchQuerySearchTextDelimiters = ['\\s', ','],
				} = emptyObj,
				PinnedValues: {
					disabled: themePinnedValuesDisabled,
					PinnedValueComponent = SQONBubble,
					style: themePinnedValuesCSS,
					...themePinnedValuesTheme
				} = emptyObj,
			} = emptyObj,
		} = emptyObj,
	} = useThemeContext({ callerName: 'QuickSearch' });

	const {
		searchDisabled,
		displayField,
		headerTitle: headerTitleFromDisplayField,
		lookup,
		searchFields,
	} = useSearchFields({
		disabled: customDisabled || themeDisabled,
		displayFieldName: customDisplayFieldName || themeDisplayFieldName,
		fieldNames: customFieldNames || themeFieldNames,
		instanceId,
	});

	const dataFields = {
		...(instanceId && { 'data-instanceId': instanceId }),
	};
	const headerTitle = customHeaderTitle || themeHeaderTitle || headerTitleFromDisplayField;
	const inputMargin = customFilterInputMargin || themeFilterInputMargin;
	const inputPlaceholder = customFilterInputPlaceholder || themeFilterInputPlaceholder || themePlaceholder;

	const showPinnedValues = !(themePinnedValuesDisabled || instanceId === MATCHBOX_CHILD);

	const handleInputChange = ({ value = '' } = {}) => {
		setValue(value);
		setNewSearch(value.length > 1);
		setDropdownOpen(value.length > 1);
	};

	const queryCallback = () => {
		setNewSearch(false);
	};

	const toggleDropdown = (value: boolean) => () => setDropdownOpen(value);

	return (
		<QuickSearchWrapper dataFields={dataFields} displayName={headerTitle} stickyHeader>
			<QuickSearchQuery
				{...{
					queryCallback,
					apiFetcher,
					displayField,
					documentType,
					isNewSearch,
					searchFields,
				}}
				searchText={value}
				searchLowercase={themeQuickSearchQuerySearchLowercase}
				searchTextDelimiters={themeQuickSearchQuerySearchTextDelimiters}
				render={({ results: searchResults, loading }: { results: SearchResult[]; loading: boolean }) => (
					<>
						<InputComponent
							onBlur={toggleDropdown(false)}
							onChange={handleInputChange}
							theme={{
								altText: 'Quick search',
								disabled: searchDisabled,
								leftIcon: {
									Icon: loading ? LoadingIcon : Icon,
								},
								margin: inputMargin,
								placeholder: inputPlaceholder,
								ref: inputRef,
								showClear: true,
								...themeFilterInputProps,
								...customFilterInputProps,
							}}
							value={value}
						/>

						{isDropdownOpen && !searchDisabled && (
							<div
								className={styles.results}
								style={themeDropDownItemsCSS}
							>
								{searchResults.length ? (
									searchResults?.map(
										(
											{ entityName, result, primaryKey, input, index = (lookup?.[entityName] % 5) + 1 },
											resultIndex: number,
										) => {
											return (
												<DropdownItemComponent
													aria-label={`${result}-${resultIndex}`}
													entityName={entityName}
													inputValue={input}
													key={`${result}-${resultIndex}`}
													onMouseDown={() => {
														// onMouseDown because the input's onBlur would prevent onClick from triggering
														setValue('');

														if (
															!currentValues({
																displayField,
																sqon,
															})?.includes(primaryKey)
														) {
															setSQON(
																toggleValue({
																	primaryKey,
																	displayField,
																	sqon,
																}),
															);
														}
													}}
													optionIndex={index}
													primaryKey={primaryKey}
													result={result}
												/>
											);
										},
									)
								) : value.length > 1 && !loading ? (
									<DropdownItemComponent primaryKey="No results" />
								) : (
									<DropdownItemComponent primaryKey="Searching..." />
								)}
							</div>
						)}

						{showPinnedValues && (
							<div className={styles.pinnedValues}>
								{currentValues({
									displayField,
									sqon,
								})?.map(
									(
										primaryKey: string, ////////////
									) => (
										<div key={primaryKey}>
											<PinnedValueComponent
												style={themePinnedValuesCSS}
												theme={themePinnedValuesTheme}
												onClick={() =>
													setSQON(
														toggleValue({
															displayField,
															primaryKey,
															sqon,
														}),
													)
												}
											>
												{internalTranslateSQONValue(primaryKey)}
											</PinnedValueComponent>
										</div>
									),
								)}
							</div>
						)}
					</>
				)}
			/>
		</QuickSearchWrapper>
	);
};

export default QuickSearch;
