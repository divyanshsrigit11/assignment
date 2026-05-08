import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite'; // Add this
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		tailwindcss(), // Add this
		sveltekit()
	],
	server: {
		proxy: {
			'/api': {
				target: 'http://localhost:3000',
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api/, '')
			}
		}
	}
});