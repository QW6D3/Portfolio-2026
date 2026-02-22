<script lang="ts">
	import Header from '$lib/components/layout/Header.svelte';
	import PixelBlast from '$lib/components/ui/PixelBlast.svelte';
</script>

<main>
	<Header />
	<div class="about-container">
		<section class="about-section hero">
			<PixelBlast color="#B19EEF" pixelSize={3} patternDensity={1.5} variant="triangle" />
			<div class="hero-content">
				<h1>
					<span class="line-top">UN PEU PLUS</span>
					<span class="line-bottom">SUR MOI</span>
				</h1>
				<img
					class="photo-profil"
					src="/images/chourli-sansfond.png"
					alt="Photo de Charlie Charron"
				/>
			</div>
		</section>

		<section class="about-section next">
			<h1>À propos de Charlie</h1>
		</section>
		<section>
			<h1>Test</h1>
		</section>
	</div>
</main>

<style lang="scss">
	$pad: 44px;
	$header-h: 88px;

	main {
		width: 100%;
		display: flex;
		flex-direction: column;

		.about-container {
			width: 100%;
			display: flex;
			flex-direction: column;
			gap: $pad;

			> section {
				width: 100%;
				flex-shrink: 0;
				position: relative;
				box-sizing: border-box;

				height: calc(100dvh - #{$pad}* 2);

				background: #fff;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;

				&.hero {
					/* EXCEPTIONS POUR LA HERO */
					margin: 0 -#{$pad} 0 -#{$pad};
					width: calc(100% + #{$pad * 2});

					// On retire le header seulement ici
					height: calc(100dvh - #{$header-h} - #{$pad});

					padding: 0; // Pas de padding pour l'image collée
					overflow: hidden;
					background: transparent;

					.hero-content {
						flex: 1;
						display: flex;
						flex-direction: column;
						justify-content: flex-end;
						align-items: center;

						h1 {
							margin-bottom: -8vh;
							z-index: 1;
							line-height: 0.8;
							.line-top {
								font-size: 14vw;
								display: block;
							}
							.line-bottom {
								font-size: 20vw;
								display: block;
							}
						}

						.photo-profil {
							width: 100%;
							max-width: 120vw;
							height: auto;
							display: block;
							z-index: 2;
							filter: grayscale(90%) contrast(120%) brightness(90%);
						}
					}
				}

				// Styles communs pour les textes
				h1 {
					font-size: 12vw;
					color: #333;
					font-weight: 900;
					text-align: center;
				}

				p {
					font-size: 1.1rem;
					line-height: 1.6;
					color: #444;
					text-align: center;
					max-width: 600px;
				}
			}
		}
	}
</style>
