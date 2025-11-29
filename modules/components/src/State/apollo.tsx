import { ApolloClient, HttpLink, InMemoryCache, gql } from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react';

export const client = new ApolloClient({
	link: new HttpLink({ uri: 'http://localhost:5173/graphql' }),
	cache: new InMemoryCache(),
	devtools: {
		enabled: true,
		name: 'Arranger',
	},
});
