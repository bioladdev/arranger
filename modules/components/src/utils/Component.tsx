import { ReactNode } from 'react';

interface ComponentProps {
	children: (props: any) => ReactNode;
	initialState?: any;
	[key: string]: any;
}

/**
 * Simple replacement for @reach/component-component
 * Provides render props pattern with state management
 */
const Component = ({ children, initialState = {}, ...props }: ComponentProps) => {
	return children({ ...initialState, ...props });
};

export default Component;
export { Component };