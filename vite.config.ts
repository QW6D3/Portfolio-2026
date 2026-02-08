import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config'; // On change l'import ici

export default defineConfig({
	plugins: [sveltekit()],
	test: {
		// Cette ligne dit à Vitest de chercher n'importe quel fichier .ts
		// dans ton dossier src/test/, même s'il n'a pas ".test" dans le nom
		include: ['src/test/*.ts', 'src/**/*.{test,spec}.ts'],

		// Optionnel : permet d'utiliser 'describe', 'it', 'expect' sans les importer
		globals: true,
		environment: 'jsdom'
	}
});
