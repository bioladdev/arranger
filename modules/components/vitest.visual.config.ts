/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
	plugins: [
		react({
			jsxImportSource: '@emotion/react',
		}),
	],
	resolve: {
		alias: [
			{ find: /^#public/, replacement: resolve(__dirname, 'public') },
			{ find: /^#(.*)/, replacement: resolve(__dirname, 'src/$1') },
		],
	},
	test: {
		environment: 'jsdom',
		globals: true,
		setupFiles: ['./src/test-setup.ts'],
		include: ['src/__tests__/visual/**/*.visual.test.{ts,tsx}'],
	},
});