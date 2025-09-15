import { isEqual, debounce } from 'lodash-es';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import defaultApiFetcher from './utils/api.js';

interface QueryState {
	data: any;
	error: any;
	loading: boolean;
}

interface QueryProps {
	shouldFetch?: boolean;
	query?: string;
	variables?: Record<string, any>;
	callback?: (result: { data: any; errors?: any }) => void;
	apiFetcher?: typeof defaultApiFetcher;
	debounceTime?: number;
	render: (state: QueryState) => React.ReactNode;
	renderError?: boolean;
	[key: string]: any;
}

const Query = ({
	shouldFetch = true,
	query,
	variables,
	callback,
	apiFetcher = defaultApiFetcher,
	debounceTime = 0,
	render,
	renderError,
	...options
}: QueryProps) => {
	const [state, setState] = useState<QueryState>({
		data: null,
		error: null,
		loading: shouldFetch,
	});

	const prevPropsRef = useRef({ shouldFetch, query, variables });

	const fetch = useMemo(
		() =>
			debounce(async (fetchOptions: any) => {
				setState((prev) => ({ ...prev, loading: true }));
				try {
					const { data, errors } = await apiFetcher({
						...options,
						...fetchOptions,
						body: { query: fetchOptions.query, variables: fetchOptions.variables },
					});

					setState({
						data,
						error: errors ? { errors } : null,
						loading: false,
					});

					callback?.({ data, errors });
				} catch (error: any) {
					setState({ data: null, error: error.message, loading: false });
				}
			}, debounceTime),
		[apiFetcher, callback, debounceTime, options],
	);

	useEffect(() => {
		if (shouldFetch) {
			fetch({ query, variables, callback });
		}
	}, []);

	useEffect(() => {
		const prevProps = prevPropsRef.current;
		
		if (
			shouldFetch &&
			(!prevProps.shouldFetch ||
				!isEqual(prevProps.query, query) ||
				!isEqual(prevProps.variables, variables))
		) {
			fetch({ query, variables, callback });
		}

		prevPropsRef.current = { shouldFetch, query, variables };
	}, [shouldFetch, query, variables, fetch, callback]);

	const { loading, error, data } = state;
	return error && renderError ? <pre>{JSON.stringify(error, null, 2)}</pre> : render({ data, loading, error });
};

export const withQuery = (getOptions: (props: any) => any) => (Component: React.ComponentType<any>) => (props: any) => {
	const options = getOptions(props);

	return (
		<Query
			apiFetcher={props.apiFetcher}
			{...options}
			render={(data) => <Component {...props} {...{ [options.key || 'response']: data }} />}
		/>
	);
};

export default Query;
