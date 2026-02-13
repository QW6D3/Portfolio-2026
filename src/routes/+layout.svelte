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
	<!-- Page empilée en arrière-plan -->
	<div class="page-stack" class:menu-open={$isMenuOpen}></div>

	<div class="main-contents" class:menu-open={$isMenuOpen}>
		<slot />
	</div>
</main>
<NavigationMobile />

<style lang="scss">
	@use '../styles/abstracts/variables' as *;

	main {
		overflow: hidden;
		position: relative;
		background-color: $color-bg-base;
		height: 100vh;
		width: 100vw;
	}

	.page-stack {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: #ffffff;
		z-index: 2;
		transform: scale(0.95) translateX(0);
		border-radius: 0;
		opacity: 0;
		pointer-events: none;

		transition:
			transform 0.5s cubic-bezier(0.34, 1.2, 0.64, 1),
			border-radius 0.5s cubic-bezier(0.34, 1.2, 0.64, 1),
			opacity 0.4s ease;

		&.menu-open {
			opacity: 0.7;
			transform: scale(0.7) translateX(60%);
			border-radius: $inner-radius-target;
			box-shadow: -8px 5px 20px rgba($color-accent-dark, 0.08);
		}
	}

	.main-contents {
		padding: $page-padding;
		position: relative;
		z-index: 2;
		width: 100%;
		height: 100%;
		background-color: #ffffff;
		overflow-y: auto;

		transition:
			transform 0.55s cubic-bezier(0.34, 1.2, 0.64, 1),
			border-radius 0.55s cubic-bezier(0.34, 1.2, 0.64, 1),
			box-shadow 0.55s cubic-bezier(0.34, 1.2, 0.64, 1);

		&.menu-open {
			transform: scale(0.83) translateX(66%);
			border-radius: $inner-radius-target;
			box-shadow: -15px 10px 40px rgba($color-accent-dark, 0.15);
			pointer-events: none;
			user-select: none;
		}
	}
</style>
