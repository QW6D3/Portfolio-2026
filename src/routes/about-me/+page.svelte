<script lang="ts">
	import Header from '$lib/components/layout/Header.svelte';
	import { onMount } from 'svelte';

	let currentSection: number = 0;
	const totalSections: number = 4;
	let isAnimating: boolean = false;
	let touchStartY: number = 0;
	let container: HTMLElement;

	function goToSection(index: number): void {
		if (index < 0 || index >= totalSections || isAnimating) return;

		isAnimating = true;
		currentSection = index;

		const sections = container.querySelectorAll<HTMLElement>('.about-section');
		const sectionHeight = sections[0].getBoundingClientRect().height;
		const gap: number = 44;
		const targetTop: number = index * (sectionHeight + gap);

		container.scrollTo({ top: targetTop, behavior: 'smooth' });

		setTimeout(() => {
			isAnimating = false;
		}, 800);
	}

	function handleWheel(e: WheelEvent): void {
		e.preventDefault();
		if (e.deltaY > 0) {
			goToSection(currentSection + 1);
		} else {
			goToSection(currentSection - 1);
		}
	}

	function handleTouchStart(e: TouchEvent): void {
		touchStartY = e.touches[0].clientY;
	}

	function handleTouchMove(e: TouchEvent): void {
		// Bloque tout scroll natif pendant le touch
		e.preventDefault();
	}

	function handleTouchEnd(e: TouchEvent): void {
		const delta: number = touchStartY - e.changedTouches[0].clientY;
		if (Math.abs(delta) < 30) return;
		if (delta > 0) {
			goToSection(currentSection + 1);
		} else {
			goToSection(currentSection - 1);
		}
	}

	onMount(() => {
		const mainContents = document.querySelector<HTMLElement>('.main-contents');
		if (mainContents) {
			mainContents.style.overflowY = 'hidden';
		}

		container.addEventListener('wheel', handleWheel, { passive: false });
		container.addEventListener('touchstart', handleTouchStart, { passive: true });
		container.addEventListener('touchmove', handleTouchMove, { passive: false }); // passive: false obligatoire pour preventDefault
		container.addEventListener('touchend', handleTouchEnd, { passive: true });

		return () => {
			if (mainContents) {
				mainContents.style.overflowY = '';
			}
			container.removeEventListener('wheel', handleWheel);
			container.removeEventListener('touchstart', handleTouchStart);
			container.removeEventListener('touchmove', handleTouchMove);
			container.removeEventListener('touchend', handleTouchEnd);
		};
	});
</script>

<main class="about-page" bind:this={container}>
	<section class="hero-section about-section">
		<Header />
	</section>
	<section class="skills about-section"></section>
	<section class="passions about-section"></section>
	<section class="CTA-project about-section"></section>
	<div class="scroll-spacer"></div>
</main>

<style lang="scss">
	.about-page {
		display: flex;
		flex-direction: column;
		height: 100dvh;
		width: 100%;
		padding: 0;
		gap: 44px;
		overflow-y: scroll;
		scrollbar-width: none;
		&::-webkit-scrollbar {
			display: none;
		}

		.about-section {
			height: calc(100dvh - 88px);
			width: 100%;
			flex-shrink: 0;
			border-radius: 20px;
			box-sizing: border-box;
			position: relative;
			scroll-margin-top: 44px;
		}

		.hero-section {
		}
		.skills {
			background-color: red;
		}
		.passions {
			background-color: green;
		}
		.CTA-project {
			background-color: yellow;
		}
		.scroll-spacer {
			flex-shrink: 0;
			height: 44px; // même valeur que ton gap = padding bas visuel
		}
	}
</style>
