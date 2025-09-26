import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'vitest';

/**
 * Wrapper component that provides consistent styling for visual tests
 */
export const VisualTestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
	<div
		style={{
			padding: '20px',
			fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
			fontSize: '14px',
			lineHeight: '1.4',
			backgroundColor: '#ffffff',
			color: '#000000',
		}}
	>
		{children}
	</div>
);

/**
 * Renders a component and takes a visual snapshot
 */
export const renderAndSnapshot = async (
	component: React.ReactElement,
	testName: string,
	options?: { wrapper?: React.ComponentType<{ children: React.ReactNode }> }
) => {
	const Wrapper = options?.wrapper || VisualTestWrapper;
	
	const { container } = render(
		<Wrapper>{component}</Wrapper>
	);
	
	// Wait for any animations or async rendering to complete
	await new Promise(resolve => setTimeout(resolve, 100));
	
	// For now, we'll use HTML snapshots instead of image snapshots
	// This provides a good foundation for visual regression testing
	expect(container.innerHTML).toMatchSnapshot(`${testName}.html`);
	
	return container;
};

/**
 * Creates mock data for components that need it
 */
export const createMockData = {
	tableData: () => [
		{ id: 1, name: 'John Doe', email: 'john@example.com', status: 'active' },
		{ id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'inactive' },
		{ id: 3, name: 'Bob Johnson', email: 'bob@example.com', status: 'active' },
	],
	
	aggregationData: () => ({
		buckets: [
			{ key: 'Category A', doc_count: 150 },
			{ key: 'Category B', doc_count: 89 },
			{ key: 'Category C', doc_count: 45 },
		],
	}),
	
	sqonData: () => ({
		op: 'and',
		content: [
			{
				op: 'in',
				content: {
					field: 'status',
					value: ['active'],
				},
			},
		],
	}),
};