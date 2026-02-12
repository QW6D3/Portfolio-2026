<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
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

<main>
	<div class="main-contents" class:menu-open={$isMenuOpen}>
		<slot />
	</div>
</main>
<NavigationMobile />

<style lang="scss">
	@use '../styles/abstracts/variables' as *;

	main {
		overflow: hidden;
		background-color: $bg-menu;
		height: 100vh;
		width: 100vw;
	}

	.main-contents {
		padding: $page-padding;
		position: relative;
		z-index: 2;
		width: 100%;
		height: 100%;
		background-color: white;
		overflow-y: auto;

		transition:
			transform 0.4s cubic-bezier(0.4, 0, 0.2, 1),
			border-radius 0.4s cubic-bezier(0.4, 0, 0.2, 1);

		&.menu-open {
			transition:
				transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275),
				border-radius 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);

			transform: scale(0.8) translateX(65%);
			border-radius: $inner-radius-target;
			box-shadow: -15px 0 30px rgba(0, 0, 0, 0.15);
			pointer-events: none;
			user-select: none;
		}
	}
</style>
