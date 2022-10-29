import { federation } from '@gioboa/vite-module-federation';
import { createEsBuildAdapter } from '@softarc/native-federation-esbuild';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { importMaps } from './module-federation/vite-importmap-shim';

export default defineConfig(async ({ command }) => ({
	server: {
		fs: {
			allow: ['.', '../shared'],
		},
	},
	plugins: [
		command === 'serve' &&
			importMaps({
				'__x00__react/jsx-dev-runtime':
					'https://esm.sh/react@18.0.0?pin=v74&path=/jsx-dev-runtime',
			}),
		await federation({
			options: {
				workspaceRoot: __dirname,
				outputPath: 'dist',
				tsConfig: 'tsconfig.json',
				federationConfig: 'module-federation/federation.config.cjs',
				verbose: false,
				dev: command === 'serve',
			},
			adapter: createEsBuildAdapter({ plugins: [] }),
		}),
		react(),
	],
}));
