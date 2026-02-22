<script lang="ts">
	import { resolve } from '$app/paths';
	import { toggleMenu } from '$lib/stores/main-store';
	import { Menu } from 'lucide-svelte';
	import NavigationDesktop from './NavigationDesktop.svelte';
</script>

<header>
	<button class="burger" on:click={toggleMenu} aria-label="Open menu">
		<Menu />
	</button>

	<a href={resolve('/')} class="logo">
		<img src="/images/C.svg" alt="Logo de Charlie Charron" />
		<span class="sr-only">Charlie Charron</span>
	</a>

	<nav class="desktop-nav">
		<NavigationDesktop />
	</nav>
</header>

<style lang="scss">
	@use '../../../styles/abstracts/variables' as *;

	header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 4px $page-padding 0; // Utilisation de ta variable de padding
		z-index: 30;
		position: relative;
		contain: layout style;

		.logo {
			display: flex;
			align-items: center;
			// Utilisation de la variable CSS pour le changement de thème auto
			color: var(--color-text);
			text-decoration: none;

			img {
				width: 44px;
				height: 44px;
				aspect-ratio: 1 / 1;
			}
		}

		.burger {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 44px;
			height: 44px;
			appearance: none;
			// Utilisation des variables du thème pour le bouton
			background: var(--color-secondary);
			color: var(--color-bg);
			border: none;
			border-radius: 12px;
			cursor: pointer;

			will-change: transform;
			transition:
				transform 0.2s cubic-bezier(0.4, 0, 0.2, 1),
				background-color 0.2s ease,
				opacity 0.2s ease;

			@media (min-width: 768px) {
				display: none;
			}

			&:hover {
				opacity: 0.9;
			}

			&:active {
				transform: scale(0.92);
			}

			:global(svg) {
				width: 18px;
				height: 18px;
				stroke-width: var(--icon-stroke); // Utilisation de ton token base
			}
		}

		.desktop-nav {
			display: none;

			@media (min-width: 768px) {
				display: block;
			}
		}
	}

	// Ta classe utilitaire pour cesser le texte du logo (accessibilité)
	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}
</style>
