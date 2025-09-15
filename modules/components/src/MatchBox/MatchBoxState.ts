import { debounce } from 'lodash-es';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { decorateFieldWithColumnsState } from '#QuickSearch/QuickSearchQuery.js';
import api from '#utils/api.js';

let matchBoxFields = `
  state {
    displayName
    fieldName
    isActive
    keyFieldName
    searchFields
  }
`;

interface MatchBoxStateProps {
	documentType: string;
	onInitialLoaded?: (args: { activeFields: any[] }) => void;
	render: (args: {
		update: (args: { field: string; key: string; value: any }) => void;
		matchBoxState: any[];
		primaryKeyField: any;
		activeFields: any[];
		extended: any[];
	}) => React.ReactNode;
}

const MatchBoxState = ({ documentType, onInitialLoaded = () => {}, render }: MatchBoxStateProps) => {
	const [state, setState] = useState({
		extended: [],
		columnsState: {},
		matchBoxState: [],
		temp: [],
		err: null,
	});
	
	const prevDocumentTypeRef = useRef(documentType);

	const getActiveFields = useCallback(() => {
		return state.temp
			?.filter((x) => x.isActive)
			?.map((x) => {
				return {
					...x,
					keyFieldName: {
						fieldName: x.keyFieldName,
						...decorateFieldWithColumnsState({
							columnsState: state.columnsState,
							field: x.keyFieldName,
						}),
					},
					searchFields: x.searchFields.map((y) => ({
						field: y,
						entityName: x.displayName,
						...decorateFieldWithColumnsState({
							columnsState: state.columnsState,
							field: y,
						}),
					})),
				};
			});
	}, [state.temp, state.columnsState]);

	const fetchMatchBoxState = useMemo(
		() =>
			debounce(async (docType: string, onComplete = () => {}) => {
				try {
					const {
						data: {
							[docType]: {
								extended,
								matchBoxState: { state: matchBoxState },
								columnsState: { state: columnsState },
							},
						},
					} = await api({
						endpoint: `/graphql`,
						body: {
							query: `{
								${docType} {
									extended
										matchBoxState {
											${matchBoxFields}
										}
										columnsState {
											state {
												columns {
													fieldName
													query
													jsonPath
												}
											}
										}
									}
								}
							}`,
						},
					});

					setState({
						matchBoxState,
						temp: matchBoxState,
						extended,
						columnsState,
						err: null,
					});

					// Call onComplete after state is set
					setTimeout(() => {
						onComplete({
							activeFields: state.temp
								?.filter((x) => x.isActive)
								?.map((x) => ({
									...x,
									keyFieldName: {
										fieldName: x.keyFieldName,
										...decorateFieldWithColumnsState({
											columnsState,
											field: x.keyFieldName,
										}),
									},
									searchFields: x.searchFields.map((y) => ({
										field: y,
										entityName: x.displayName,
										...decorateFieldWithColumnsState({
											columnsState,
											field: y,
										}),
									})),
								})) || [],
						});
					}, 0);
				} catch (err) {
					setState((prev) => ({ ...prev, err }));
				}
			}, 300),
		[state.temp],
	);

	const save = useMemo(
		() =>
			debounce(async (stateToSave: any[]) => {
				const { data } = await api({
					endpoint: `/graphql`,
					body: {
						variables: { state: stateToSave },
						query: `mutation($state: JSON!) {
							saveMatchBoxState(
								state: $state
								documentType: "${documentType}"
							) {
								${matchBoxFields}
							}
						}`,
					},
				});

				setState((prev) => ({
					...prev,
					matchBoxState: data.saveMatchBoxState.state,
					temp: data.saveMatchBoxState.state,
				}));
			}, 300),
		[documentType],
	);

	const update = useCallback(
		({ field, key, value }: { field: string; key: string; value: any }) => {
			setState((prevState) => {
				const matchBoxField = prevState.temp.find((x) => x.field === field);
				const index = prevState.temp.findIndex((x) => x.field === field);
				const temp = Object.assign([], prevState.temp, {
					[index]: { ...matchBoxField, [key]: value },
				});
				
				// Call save after state update
				setTimeout(() => save(temp), 0);
				
				return { ...prevState, temp };
			});
		},
		[save],
	);

	useEffect(() => {
		fetchMatchBoxState(documentType, onInitialLoaded);
	}, []);

	useEffect(() => {
		if (prevDocumentTypeRef.current !== documentType) {
			fetchMatchBoxState(documentType);
			prevDocumentTypeRef.current = documentType;
		}
	}, [documentType, fetchMatchBoxState]);

	return render({
		update,
		matchBoxState: state.temp,
		primaryKeyField: state.extended?.find((x) => x.primaryKey),
		activeFields: getActiveFields(),
		extended: state.extended,
	});
};

export default MatchBoxState;
