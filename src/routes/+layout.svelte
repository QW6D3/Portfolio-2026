<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import Navigation from '$lib/components/layout/Navigation.svelte';
	import '../styles/main.scss';
	import { isMenuOpen } from '$lib/stores/main-store';
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<meta charset="UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
</svelte:head>

<main>
	<Navigation />
	<div class="main-contents" class:menu-open={$isMenuOpen}>
		<slot />
	</div>
</main>

<style>
	.main-contents {
		width: 100%;
		height: 100vh;
		transition: background-color 0.3s ease;
		background-color: blue;
		&.menu-open {
			transition: all 0.3s ease;
			transform: scale(0.7) translateX(40%);
		}
	}
</style>
