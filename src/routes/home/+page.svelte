<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import Header from '$lib/components/layout/Header.svelte';
	import Grainient from '$lib/components/ui/Grainient.svelte';

	let contentReady = false;

	const eyebrowTexts = ['Développeur fullstack', 'Futur apprenti ingénieur'];
	let eyebrowIndex = 0;
	let eyebrowVisible = true;

	onMount(() => {
		setTimeout(() => {
			contentReady = true;
			setInterval(() => {
				eyebrowVisible = false;
				setTimeout(() => {
					eyebrowIndex = (eyebrowIndex + 1) % eyebrowTexts.length;
					eyebrowVisible = true;
				}, 300);
			}, 2000);
		}, 3000);
	});
</script>

<main class="home-page">
	<Header />
	<div class="tag"></div>

	<div class="loader">
		<div class="inner" class:ready={contentReady}>
			<Grainient
				className="page-grainient"
				color1="#9B8FD4"
				color2="#6B55D6"
				color3="#4A3BA8"
				timeSpeed={0.12}
				warpStrength={0.6}
				warpFrequency={3.5}
				warpAmplitude={80}
				warpSpeed={1.2}
				rotationAmount={280}
				noiseScale={1.8}
				grainAmount={0.055}
				grainScale={2.5}
				contrast={1.15}
				saturation={0.85}
				gamma={1.05}
				zoom={0.85}
				colorBalance={0.05}
				blendSoftness={0.12}
			/>

			<div class="text-block">
				<p class="eyebrow" class:fade={!eyebrowVisible}>
					<span class="dash"></span>
					<span>{eyebrowTexts[eyebrowIndex]}</span>
					<span class="dash"></span>
				</p>

				<h1 class="name">
					<span class="name-line outline" style="transition-delay: 100ms;">CHARRON</span>
					<span class="name-line accent" style="transition-delay: 250ms;">Charlie</span>
				</h1>

				<div class="description-container" style="transition-delay: 400ms;">
					<p class="tagline">
						Des expériences numériques où la <strong>rigueur technique</strong>
						rencontre l'<strong>audace créative</strong>.
					</p>
				</div>

				<div class="cta-group" style="transition-delay: 550ms;">
					<button class="cta-primary" onclick={() => goto(resolve('/projects'))}>
						<span>Explorer mes projets</span>
						<svg width="18" height="18" viewBox="0 0 16 16" fill="none">
							<path
								d="M3 8h10M9 4l4 4-4 4"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
					</button>
					<button class="cta-secondary" onclick={() => goto(resolve('/contact'))}
						>Me contacter</button
					>
				</div>
			</div>
		</div>
	</div>
</main>

<style lang="scss">
	.home-page {
		$radius: 16px;
		$tag-height-mobile: 94px;
		$tag-height-desktop: 64px;
		$tag-width-mobile: 94px;
		$tag-width-desktop: 535px;
		$raccord-size: 1.125rem;
		$raccord-radius: 0.8rem;

		position: relative;
		box-sizing: border-box;
		height: 100%;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		border-radius: $radius;

		.tag {
			position: absolute;
			top: 0;
			height: $tag-height-mobile;
			background-color: var(--color-bg);
			z-index: 4;
			pointer-events: none;
			left: 0;
			width: $tag-width-mobile;
			border-radius: 0 0 $radius 0;

			&::before,
			&::after {
				content: '';
				position: absolute;
				width: $raccord-size;
				height: $raccord-size;
				background-color: transparent;
			}
			&::before {
				top: 0;
				right: -$raccord-size;
				border-top-left-radius: $raccord-radius;
				box-shadow: -0.375rem -0.375rem var(--color-bg);
			}
			&::after {
				bottom: -$raccord-size;
				left: 0;
				border-top-left-radius: $raccord-radius;
				box-shadow: -0.375rem -0.375rem var(--color-bg);
			}

			@media (min-width: 768px) {
				left: auto;
				right: 0;
				height: $tag-height-desktop;
				width: $tag-width-desktop;
				border-radius: 0 0 0 $radius;

				&::before {
					right: auto;
					left: -$raccord-size;
					border-top-left-radius: 0;
					border-top-right-radius: $raccord-radius;
					box-shadow: 0.375rem -0.375rem var(--color-bg);
				}
				&::after {
					left: auto;
					right: 0;
					border-top-left-radius: 0;
					border-top-right-radius: $raccord-radius;
					box-shadow: 0.375rem -0.375rem var(--color-bg);
				}
			}
		}

		.loader {
			position: absolute;
			top: 50%;
			left: 50%;
			width: 100px;
			height: 100px;
			background-color: var(--color-primary);
			border-radius: 12px;
			overflow: hidden;
			z-index: 2;
			animation: loader-expand 3s cubic-bezier(0.85, 0, 0.15, 1) forwards;

			@keyframes loader-expand {
				0% {
					transform: translate(-50%, -50%) rotate(0deg) scale(1);
					border-radius: 12px;
				}
				70% {
					transform: translate(-50%, -50%) rotate(280deg) scale(1.2);
				}
				100% {
					transform: translate(-50%, -50%) rotate(360deg) scale(25);
					border-radius: 0;
				}
			}
		}

		.inner {
			position: absolute;
			width: 100vw;
			height: 100vh;
			top: 50%;
			left: 50%;
			animation: inner-counter 3s cubic-bezier(0.85, 0, 0.15, 1) forwards;

			@keyframes inner-counter {
				0% {
					transform: translate(-50%, -50%) rotate(0deg) scale(1);
				}
				70% {
					transform: translate(-50%, -50%) rotate(-280deg) scale(0.8);
				}
				100% {
					transform: translate(-50%, -50%) rotate(-360deg) scale(0.04);
				}
			}
		}

		:global(.page-grainient) {
			position: absolute !important;
			inset: 0 !important;
			z-index: 0 !important;
		}

		.text-block {
			position: absolute;
			inset: 0;
			z-index: 2;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			text-align: center;
		}

		.eyebrow,
		.name-line,
		.description-container,
		.cta-group {
			opacity: 0;
			transform: translateY(20px);
			transition:
				opacity 0.8s cubic-bezier(0.2, 0.8, 0.2, 1),
				transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
		}

		.eyebrow {
			display: flex;
			align-items: center;
			gap: 0.8rem;
			font-size: clamp(0.6rem, 0.85vw, 0.75rem);
			font-weight: 700;
			letter-spacing: 0.5em;
			text-transform: uppercase;
			color: rgba(255, 255, 255, 0.55);
			margin: 0 0 1.2rem;

			.dash {
				display: block;
				width: 20px;
				height: 1px;
				background: rgba(255, 255, 255, 0.28);
				flex-shrink: 0;
			}

			&.fade {
				opacity: 0 !important;
				transform: translateY(-6px) !important;
				transition:
					opacity 0.25s ease,
					transform 0.25s ease !important;
			}
		}

		.name {
			display: flex;
			flex-direction: column;
			align-items: center;
			margin: 0 0 3rem;
			font-size: clamp(4rem, 12vw, 10rem);
			line-height: 1;
			letter-spacing: -0.02em;

			.name-line {
				display: block;

				&.outline {
					-webkit-text-stroke: 1.5px rgba(255, 255, 255, 0.45);
					color: transparent;
					filter: drop-shadow(0 4px 16px rgba(0, 0, 0, 0.15));
				}

				&.accent {
					margin-top: -88px;
					color: #fff;
					line-height: 0.78;
					position: relative;
					z-index: 2;
					text-shadow:
						0 2px 0 rgba(0, 0, 0, 0.1),
						0 8px 32px rgba(0, 0, 0, 0.25);
				}
			}
		}

		.description-container {
			margin-bottom: 2.5rem;

			.tagline {
				font-size: clamp(0.85rem, 1.2vw, 1rem);
				color: rgba(255, 255, 255, 0.65);
				max-width: 380px;
				line-height: 1.7;

				strong {
					color: rgba(255, 255, 255, 0.92);
				}
			}
		}

		.cta-group {
			display: flex;
			gap: 0.9rem;
			align-items: center;
			justify-content: center;
			flex-wrap: wrap;
		}

		.cta-primary {
			display: inline-flex;
			align-items: center;
			gap: 0.8rem;
			padding: 0.9rem 1.8rem;
			background-color: #fff;
			color: var(--color-primary);
			border: none;
			border-radius: 12px;
			text-decoration: none;
			font-size: 0.9rem;
			font-weight: 700;
			letter-spacing: -0.02em;
			white-space: nowrap;
			cursor: pointer;
			transition: all 0.3s ease;

			svg {
				transition: transform 0.3s ease;
				flex-shrink: 0;
			}

			&:hover {
				transform: scale(1.04) translateY(-2px);
				box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
				svg {
					transform: translateX(5px);
				}
			}
		}

		.cta-secondary {
			display: inline-flex;
			align-items: center;
			padding: 0.9rem 1.8rem;
			border: 1px solid rgba(255, 255, 255, 0.25);
			background: rgba(255, 255, 255, 0.06);
			backdrop-filter: blur(12px);
			color: rgba(255, 255, 255, 0.88);
			border-radius: 12px;
			text-decoration: none;
			font-size: 0.9rem;
			font-weight: 500;
			letter-spacing: -0.02em;
			white-space: nowrap;
			cursor: pointer;
			transition: all 0.3s ease;

			&:hover {
				background: rgba(255, 255, 255, 0.14);
				border-color: rgba(255, 255, 255, 0.55);
				transform: translateY(-2px);
			}
		}

		.inner.ready {
			.eyebrow,
			.name-line,
			.description-container,
			.cta-group {
				opacity: 1;
				transform: translateY(0);
			}
		}
	}
</style>
