import { useState, useEffect } from 'react';
// import PropTypes from 'prop-types';

import defaultApiFetcher, { fetchExtendedMapping } from './api';

const memoHash = {};
const memoizedExtendedMapping = ({ documentType, apiFetcher }) => {
	if (!memoHash[documentType]) {
		memoHash[documentType] = fetchExtendedMapping({ documentType, apiFetcher });
	}
	return memoHash[documentType];
};

const memoizedExtendedMappingField = ({ contentField, documentType, apiFetcher }) => {
	const key = `${documentType}/${contentField}`;
	if (!memoHash[key]) {
		memoHash[key] = memoizedExtendedMapping({
			documentType,
			apiFetcher,
		}).then(({ extendedMapping }) => extendedMapping.filter(({ field }) => field === contentField));
	}
	return memoHash[key];
};

const ExtendedMappingProvider = ({
	documentType,
	apiFetcher = defaultApiFetcher,
	useCache = true,
	field: contentField,
	children,
}) => {
	const [loading, setLoading] = useState(true);
	const [extendedMapping, setExtendedMapping] = useState(undefined);

	useEffect(() => {
		let cancelled = false;
		const doFetch = async () => {
			if (contentField) {
				const result = !useCache
					? await fetchExtendedMapping({ documentType, apiFetcher }).then(({ extendedMapping }) =>
						extendedMapping.filter(({ field }) => field === contentField),
					)
					: await memoizedExtendedMappingField({ documentType, apiFetcher, contentField });
				if (!cancelled) {
					setLoading(false);
					setExtendedMapping(result);
				}
			} else {
				const { extendedMapping: result } = !useCache
					? await fetchExtendedMapping({ documentType, apiFetcher })
					: await memoizedExtendedMapping({ documentType, apiFetcher });
				if (!cancelled) {
					setLoading(false);
					setExtendedMapping(result);
				}
			}
		};
		doFetch();
		return () => {
			cancelled = true;
		};
	}, [documentType, apiFetcher, useCache, contentField]);

	return children({ loading, extendedMapping });
};

// ExtendedMappingProvider.prototype = {
// 	apiFetcher: PropTypes.func,
// 	useCache: PropTypes.bool,
// 	field: PropTypes.string,
// 	documentType: PropTypes.string.isRequired,
// 	children: PropTypes.func.isRequired,
// };

export default ExtendedMappingProvider;
