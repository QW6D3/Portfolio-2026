import { writable } from 'svelte/store';

// On crée le store avec une valeur par défaut (false)
export const isMenuOpen = writable(false);

// Optionnel : On peut créer une fonction pour simplifier le toggle
export const toggleMenu = () => {
	isMenuOpen.update((value) => !value);
};
