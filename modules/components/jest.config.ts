import { type JestConfigWithTsJest } from 'ts-jest';

const jestConfig: JestConfigWithTsJest = {
	testEnvironment: 'jsdom',
	verbose: true,
	preset: 'ts-jest/presets/default-esm',
	extensionsToTreatAsEsm: ['.ts', '.tsx'],
	moduleNameMapping: {
		'^#(.*)$': '<rootDir>/src/$1',
	},
	transform: {
		'^.+\\.(ts|tsx)$': ['ts-jest', {
			useESM: true,
		}],
	},
};

export default jestConfig;
