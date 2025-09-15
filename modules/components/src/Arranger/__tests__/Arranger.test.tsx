import React from 'react';
import { render } from '@testing-library/react';
import Arranger from '../Arranger.js';

// Mock console.warn to test deprecation warnings
const mockWarn = jest.spyOn(console, 'warn').mockImplementation(() => {});

describe('Arranger (Deprecated)', () => {
	afterEach(() => {
		mockWarn.mockClear();
	});

	afterAll(() => {
		mockWarn.mockRestore();
	});

	it('should render and show deprecation warning', () => {
		const TestComponent = () => <div>Test Content</div>;

		render(
			<Arranger documentType="test">
				<TestComponent />
			</Arranger>
		);

		// Should show deprecation warning
		expect(mockWarn).toHaveBeenCalledWith(
			expect.stringContaining('DEPRECATION WARNING: <Arranger> component is deprecated')
		);
	});

	it('should render with render prop and show deprecation warning', () => {
		render(
			<Arranger 
				documentType="test"
				render={({ sqon }) => <div>SQON: {JSON.stringify(sqon)}</div>}
			/>
		);

		// Should show deprecation warning
		expect(mockWarn).toHaveBeenCalledWith(
			expect.stringContaining('DEPRECATION WARNING: <Arranger> component is deprecated')
		);
	});

	it('should render with component prop and show deprecation warning', () => {
		const TestComponent = () => <div>Component Test</div>;

		render(
			<Arranger 
				documentType="test"
				component={TestComponent}
			/>
		);

		// Should show deprecation warning
		expect(mockWarn).toHaveBeenCalledWith(
			expect.stringContaining('DEPRECATION WARNING: <Arranger> component is deprecated')
		);
	});
});