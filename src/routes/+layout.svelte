<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import Header from '$lib/components/layout/Header.svelte'; // Ton nouveau composant
	import NavigationMobile from '$lib/components/layout/NavigationMobile.svelte';
	import '../styles/main.scss';
	import { isMenuOpen } from '$lib/stores/main-store';
	import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit';

	injectSpeedInsights();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<meta charset="UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
</svelte:head>

<NavigationMobile />

<Header />

<main>
	<div class="main-contents" class:menu-open={$isMenuOpen}>
		<slot />
	</div>
</main>

<style lang="scss">
	main {
		overflow: hidden;
		background-color: rgb(97, 126, 97);

		.main-contents {
			position: relative;
			z-index: 20;
			width: 100%;
			height: 100vh;
			background-color: white;

			transition:
				transform 0.4s cubic-bezier(0.4, 0, 0.2, 1),
				border-radius 0.4s cubic-bezier(0.4, 0, 0.2, 1);

			&.menu-open {
				transition:
					transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275),
					border-radius 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
				transform: scale(0.8) translateX(60%);
				border-radius: 45px;
				box-shadow: -20px 0 50px rgba(0, 0, 0, 0.2);
				pointer-events: none;
			}
		}
	}
</style>
