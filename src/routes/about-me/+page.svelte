<script lang="ts">
	import Header from '$lib/components/layout/Header.svelte';
	import { onMount } from 'svelte';

	import { skills as skillsData, type Skill } from '$lib/data/about';

	type SkillCounter = Record<string, number>;

	let currentSection: number = 0;
	const totalSections: number = 4;
	let isAnimating: boolean = false;
	let touchStartY: number = 0;
	let container: HTMLElement;
	let wrapper: HTMLElement;

	function easeInOutExpo(t: number): number {
		if (t === 0) return 0;
		if (t === 1) return 1;
		if (t < 0.5) return Math.pow(2, 20 * t - 10) / 2;
		return (2 - Math.pow(2, -20 * t + 10)) / 2;
	}

	function animateTranslate(from: number, to: number, duration: number): void {
		const start = performance.now();

		function step(now: number): void {
			const elapsed = now - start;
			const progress = Math.min(elapsed / duration, 1);
			const eased = easeInOutExpo(progress);
			const current = from + (to - from) * eased;

			wrapper.style.transform = `translateY(${current}px)`;

			if (progress < 1) {
				requestAnimationFrame(step);
			} else {
				isAnimating = false;
			}
		}

		requestAnimationFrame(step);
	}

	function goToSection(index: number): void {
		if (index < 0 || index >= totalSections || isAnimating) return;

		isAnimating = true;
		currentSection = index;

		const sections = container.querySelectorAll<HTMLElement>('.about-section');
		const sectionHeight = sections[0].getBoundingClientRect().height;
		const gap: number = 44;

		const currentTransform = new DOMMatrix(getComputedStyle(wrapper).transform);
		const fromY = currentTransform.m42;
		const toY = -(index * (sectionHeight + gap));

		animateTranslate(fromY, toY, 1100);
	}

	function handleWheel(e: WheelEvent): void {
		e.preventDefault();
		if (e.deltaY > 0) goToSection(currentSection + 1);
		else goToSection(currentSection - 1);
	}

	function handleTouchStart(e: TouchEvent): void {
		touchStartY = e.touches[0].clientY;
	}

	function handleTouchMove(e: TouchEvent): void {
		e.preventDefault();
	}

	function handleTouchEnd(e: TouchEvent): void {
		const delta: number = touchStartY - e.changedTouches[0].clientY;
		if (Math.abs(delta) < 30) return;
		if (delta > 0) goToSection(currentSection + 1);
		else goToSection(currentSection - 1);
	}

	onMount(() => {
		const mainContents = document.querySelector<HTMLElement>('.main-contents');
		if (mainContents) mainContents.style.overflowY = 'hidden';

		container.addEventListener('wheel', handleWheel, { passive: false });
		container.addEventListener('touchstart', handleTouchStart, { passive: true });
		container.addEventListener('touchmove', handleTouchMove, { passive: false });
		container.addEventListener('touchend', handleTouchEnd, { passive: true });

		return () => {
			if (mainContents) mainContents.style.overflowY = '';
			container.removeEventListener('wheel', handleWheel);
			container.removeEventListener('touchstart', handleTouchStart);
			container.removeEventListener('touchmove', handleTouchMove);
			container.removeEventListener('touchend', handleTouchEnd);
		};
	});

	function sortSkillsByCategory(skills: Skill[]) {
		const NumberByCategory = skills.reduce((acc: SkillCounter, skill: (typeof skills)[number]) => {
			const category = skill.group;
			if (!acc[category]) {
				acc[category] = 0;
			}
			acc[category]++;
			return acc;
		}, {});

		const sortedCategories = Object.entries(NumberByCategory) as [string, number][];

		return sortedCategories.sort((a, b) => b[1] - a[1]);
	}

	const sortedSkills = sortSkillsByCategory(skillsData);

	console.log('Sorted Skills by Category:', sortedSkills);
</script>

<main class="about-page" bind:this={container}>
	<div class="sections-wrapper" bind:this={wrapper}>
		<section class="hero-section about-section">
			<Header />
			<img src="" alt="" />
			<div>
				<img src="/images/man.webp" alt="" />
				<div class="bubbles"></div>
				<p>Salut j'utilise Whatsapp</p>
			</div>
		</section>
		<section class="skills about-section"></section>
		<section class="passions about-section"></section>
		<section class="CTA-project about-section"></section>
	</div>
</main>

<style lang="scss">
	.about-page {
		display: flex;
		flex-direction: column;
		height: 100dvh;
		width: 100%;
		padding: 0;
		overflow: visible;
	}

	.sections-wrapper {
		display: flex;
		flex-direction: column;
		gap: 44px;
		will-change: transform;
		transform: translateY(0);

		.about-section {
			height: calc(100dvh - 88px);
			width: 100%;
			flex-shrink: 0;
			border-radius: 20px;
			box-sizing: border-box;
			position: relative;
		}

		.hero-section {
			display: flex;
			flex-direction: column;
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
	}
</style>
