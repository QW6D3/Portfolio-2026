<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import NavigationMobile from '$lib/components/layout/NavigationMobile.svelte';
	import '../styles/main.scss';
	import { isMenuOpen } from '$lib/stores/main-store';
	import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit';
	import { page } from '$app/stores';

	injectSpeedInsights();

	$: pageTitle =
		$page.url.pathname === '/'
			? 'Portfolio'
			: $page.url.pathname.split('/').pop()?.replace(/-/g, ' ');
</script>

<svelte:head>
	<title>Charlie | {pageTitle} — Développeur Créatif</title>
	<meta
		name="description"
		content="Développeur créatif passionné par le design système et les expériences web fluides. Découvrez mes projets et mon univers."
	/>
	<meta name="author" content="Charlie" />
	<meta charset="UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />

	<meta property="og:title" content="Charlie | Portfolio — Développeur Créatif" />
	<meta
		property="og:description"
		content="Développeur créatif passionné par le design système. Explorez mon travail."
	/>
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://portfolio-2026-three-iota.vercel.app" />

	<link rel="icon" href={favicon} />
	<link
		rel="preload"
		href="/fonts/Sharpie/Sharpie-Variable.woff2"
		as="font"
		type="font/woff2"
		crossorigin="anonymous"
	/>
	<link
		rel="preload"
		href="/fonts/Ranade/Ranade-Variable.woff2"
		as="font"
		type="font/woff2"
		crossorigin="anonymous"
	/>
</svelte:head>

<main id="main-content" aria-hidden={$isMenuOpen}>
	<div class="page-stack mobile-only" class:menu-open={$isMenuOpen}></div>

	<div class="main-contents" class:menu-open={$isMenuOpen}>
		<div
			class="scroll-overlay"
			class:active={$isMenuOpen}
			on:click={() => isMenuOpen.set(false)}
			on:keydown={(e) => e.key === 'Enter' && isMenuOpen.set(false)}
			role="button"
			tabindex="0"
			aria-label="Fermer le menu"
		></div>
		<slot />
	</div>
</main>

<div class="mobile-only" aria-label="Menu principal">
	<NavigationMobile />
</div>

<style lang="scss">
	@use '../styles/abstracts/variables' as *;

	main {
		overflow: hidden;
		position: relative;
		// Utilisation de la variable de fond claire/beige
		background-color: var(--color-bg);
		height: 100dvh;
		width: 100%;
	}

	.mobile-only {
		display: block;
		@media (min-width: 768px) {
			display: none;
		}
	}

	.page-stack,
	.main-contents {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: var(--color-bg);
		will-change: transform;
		overflow: hidden;
	}

	.page-stack {
		z-index: 2;
		opacity: 1;
		pointer-events: none;
		transform: scale(1);

		transition:
			transform 0.5s cubic-bezier(0.34, 1.2, 0.64, 1),
			border-radius 0.5s cubic-bezier(0.34, 1.2, 0.64, 1),
			opacity 0.4s ease;

		&.menu-open {
			opacity: 1;
			transform: scale(0.7) translateX(60%);
			border-radius: $inner-radius-target;
			box-shadow: -8px 5px 20px rgba($color-accent1-dark, 0.08);
		}
	}

	.main-contents {
		z-index: 3;
		padding: $page-padding;
		overflow: hidden;
		-webkit-overflow-scrolling: touch;

		transition:
			transform 0.55s cubic-bezier(0.34, 1.2, 0.64, 1),
			border-radius 0.55s cubic-bezier(0.34, 1.2, 0.64, 1),
			box-shadow 0.55s cubic-bezier(0.34, 1.2, 0.64, 1);

		&.menu-open {
			transform: scale(0.83) translateX(66%);
			border-radius: $inner-radius-target;

			box-shadow: -15px 10px 40px rgba($color-accent1-dark, 0.15);
			user-select: none;
			pointer-events: none;
			overflow: hidden;
		}
	}

	.scroll-overlay {
		position: absolute;
		inset: 0;
		z-index: 999;
		background: transparent;
		pointer-events: none;
		opacity: 0;
		transition: opacity 0.3s ease;

		&.active {
			opacity: 1;
			pointer-events: auto;
		}
	}
</style>
