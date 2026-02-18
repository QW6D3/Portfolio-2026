<script lang="ts">
	import Header from '$lib/components/layout/Header.svelte';
</script>

<main class="home-page">
	<div class="tag"></div>
	<div class="hero-mask">
		<div class="loader"></div>
	</div>
	<Header />
	<div class="home-content">
		<h1>Charlie</h1>
		<h2>CHARRON</h2>
		<p>I am testing something to see if my pipeline does actually work</p>
	</div>
</main>

<style lang="scss">
	.home-page {
		position: relative;
		box-sizing: border-box;
		height: 100%;
		overflow: hidden;
		display: flex;
		flex-direction: column;

		// --- VARIABLES DE STRUCTURE ---
		$radius: 16px;
		$tag-height-mobile: 94px;
		$tag-height-desktop: 64px;
		$tag-width-mobile: 94px;
		$tag-width-desktop: 485.05+50px;
		$raccord-size: 1.125rem;
		$raccord-radius: 0.8rem;

		.tag {
			position: absolute;
			top: 0;
			height: $tag-height-mobile;
			background-color: var(--color-bg);
			z-index: 3;
			pointer-events: none;
			transition: all 0.3s ease;

			// FORMAT MOBILE (Gauche)
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

			// Raccord Droite (Mobile)
			&::before {
				top: 0;
				right: -$raccord-size;
				border-top-left-radius: $raccord-radius;
				box-shadow: -0.375rem -0.375rem var(--color-bg);
			}

			// Raccord Bas (Mobile)
			&::after {
				bottom: -$raccord-size;
				left: 0;
				border-top-left-radius: $raccord-radius;
				box-shadow: -0.375rem -0.375rem var(--color-bg);
			}
		}

		@media (min-width: 768px) {
			.tag {
				left: auto;
				right: 0;
				height: $tag-height-desktop;
				width: $tag-width-desktop;
				border-radius: 0 0 0 $radius;

				&::before {
					right: auto;
					left: -$raccord-size;
					border-top-left-radius: 0; // Reset
					border-top-right-radius: $raccord-radius;
					box-shadow: 0.375rem -0.375rem var(--color-bg);
				}
				&::after {
					left: auto;
					right: 0;
					border-top-left-radius: 0; // Reset
					border-top-right-radius: $raccord-radius;
					box-shadow: 0.375rem -0.375rem var(--color-bg);
				}
			}
		}

		.hero-mask {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			z-index: 2;
			background-color: transparent; // Ton gris transparent
			pointer-events: none;
			border-radius: $radius;
			overflow: hidden;

			.loader {
				position: absolute;
				z-index: 5;
				top: 50%;
				left: 50%;
				// On définit une taille fixe carrée pour le début
				width: 100px;
				height: 100px;
				background-color: var(--color-primary);
				border-radius: 12px;

				// On utilise forwards pour que le carré reste à 100% à la fin de l'anim
				animation: rotation-expand 3s cubic-bezier(0.85, 0, 0.15, 1) forwards;
			}

			@keyframes rotation-expand {
				0% {
					// Petit carré qui commence sa rotation
					transform: translate(-50%, -50%) rotateZ(0deg) scale(1);
					border-radius: 12px;
				}
				70% {
					// Il tourne en restant petit pour bien voir l'effet
					transform: translate(-50%, -50%) rotateZ(280deg) scale(1.2);
				}
				100% {
					// Il finit sa rotation et explose pour couvrir tout le masque
					// Le scale(15) ou plus assure de couvrir même les grands écrans
					transform: translate(-50%, -50%) rotateZ(360deg) scale(25);
					border-radius: 0; // Il devient rectangulaire par la force des choses à la fin
				}
			}
		}

		.home-content {
			box-sizing: border-box;
			height: 100%;
			padding: clamp(1rem, 5vw, 2rem);
		}
	}
</style>
