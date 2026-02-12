<script lang="ts">
	import { resolve } from '$app/paths';
	import { toggleMenu } from '$lib/stores/main-store';
	import { Map } from 'lucide-svelte';
	import NavigationDesktop from './NavigationDesktop.svelte';
</script>

<header>
	<button class="mobile-only burger" on:click={toggleMenu}>
		<Map />
	</button>

	<a href={resolve('/')} class="logo">
		<svg>...</svg>
		<span class="sr-only">Nom de ton Portfolio</span>
	</a>

	<div class="desktop-only">
		<NavigationDesktop />
	</div>
</header>

<style lang="scss">
	header {
		display: flex;
		z-index: 30;
		.burger {
			// Structure & Taille (Carré parfait)
			display: flex;
			align-items: center;
			justify-content: center;
			width: 44px; // Taille standard recommandée pour le tactile
			height: 44px;

			// Style épuré
			appearance: none;
			background: #f5f5f5; // Un gris très léger pour le côté "objet"
			border: none;
			border-radius: 12px; // Bords arrondis
			cursor: pointer;
			color: #333;

			// Transition fluide
			transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

			&:hover {
				background-color: #eeeeee;
			}

			// Réactivité au clic (Feedback simple)
			&:active {
				transform: scale(0.92);
				background-color: #e0e0e0;
			}

			// Ajustement de l'icône Lucide
			:global(svg) {
				width: 24px;
				height: 24px;
				stroke-width: 2px;
			}
		}
	}

	.desktop-only {
		display: none;
		@media (min-width: 768px) {
			display: block;
		}
	}

	.mobile-only {
		display: block;
		@media (min-width: 768px) {
			display: none;
		}
	}

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
