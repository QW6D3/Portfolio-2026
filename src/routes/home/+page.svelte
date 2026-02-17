<script lang="ts">
	import Header from '$lib/components/layout/Header.svelte';
</script>

<main class="home-page">
	<div class="tag"></div>
	<div class="hero-mask"></div>
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
		height: 100vh;
		overflow: hidden;
		display: flex;
		flex-direction: column;

		// --- VARIABLES DE STRUCTURE ---
		$radius: 16px;
		$tag-height-mobile: 94px;
		$tag-height-desktop: 64px;
		$tag-width-mobile: 94px;
		$tag-width-desktop: 485.05+88px;
		$raccord-size: 1.125rem;
		$raccord-radius: 0.8rem;

		.tag {
			position: absolute;
			top: 0;
			height: $tag-height-mobile;
			background-color: var(--color-bg);
			z-index: 3;
			pointer-events: none;
			transition: all 0.3s ease; // Transition douce lors du changement de taille

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
				// INVERSION POUR PC (Droite)
				left: auto;
				right: 0;
				height: $tag-height-desktop;
				width: $tag-width-desktop;
				border-radius: 0 0 0 $radius; // Arrondi en bas à GAUCHE maintenant

				// Raccord Gauche (PC)
				&::before {
					right: auto;
					left: -$raccord-size;
					border-top-left-radius: 0; // Reset
					border-top-right-radius: $raccord-radius;
					box-shadow: 0.375rem -0.375rem var(--color-bg); // Ombre inversée
				}

				// Raccord Bas (PC)
				&::after {
					left: auto;
					right: 0;
					border-top-left-radius: 0; // Reset
					border-top-right-radius: $raccord-radius;
					box-shadow: 0.375rem -0.375rem var(--color-bg); // Ombre inversée
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
			background-color: rgba(0, 0, 0, 0.151); // Ton gris transparent
			pointer-events: none;
			border-radius: $radius;
		}

		.home-content {
			box-sizing: border-box;
			height: 100%;
			padding: clamp(1rem, 5vw, 2rem);
		}
	}
</style>
