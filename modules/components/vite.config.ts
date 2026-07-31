import { defineConfig } from 'vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import babel from '@rolldown/plugin-babel';
import { dirname, resolve } from 'node:path';

export default defineConfig({
	plugins: [react(), babel({ presets: [reactCompilerPreset()] })],
	define: {
		global: 'globalThis',
		'process.env': {},
	},
	build: {
		lib: {
			entry: resolve(import.meta.dirname, 'lib/main.js'),
			name: 'MyLib',
			// the proper extensions will be added
			fileName: 'my-lib',
		},
		rolldownOptions: {
			external: ['react', 'react-dom', 'react/jsx-runtime'],
		},
	},
});
