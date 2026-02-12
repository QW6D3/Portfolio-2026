<script lang="ts">
	import NavigationMobile from './NavigationMobile.svelte';
	import NavigationDesktop from './NavigationDesktop.svelte';
	import { toggleMenu } from '$lib/stores/main-store';
	import { resolve } from '$app/paths';
</script>

<header>
	<a href={resolve('/')} class="logo">
		<svg>...</svg>
		<span class="sr-only">Nom de ton Portfolio</span>
	</a>

	<div class="desktop-only">
		<NavigationDesktop />
	</div>

	<button class="mobile-only burger" on:click={toggleMenu}> Menu </button>
</header>
<NavigationMobile />

<style lang="scss">
	header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem 2rem;
		position: fixed;
		width: 100%;
		z-index: 30;
	}

	.desktop-only {
		display: none;
		@media (min-width: 1024px) {
			display: block;
		}
	}

	.mobile-only {
		display: block;
		@media (min-width: 1024px) {
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
