/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
	plugins: [
		react({
			jsxImportSource: '@emotion/react',
		}),
		dts({
			insertTypesEntry: true,
			include: ['src/**/*'],
			exclude: ['src/**/*.test.*', 'src/**/*.stories.*'],
		}),
	],
	build: {
		lib: {
			entry: resolve(__dirname, 'src/index.ts'),
			name: 'ArrangerComponents',
			formats: ['es'],
			fileName: 'index',
		},
		rollupOptions: {
			external: ['react', 'react-dom', '@emotion/react', '@emotion/styled'],
		},
		sourcemap: true,
		target: 'es2020',
	},
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
	},
});
