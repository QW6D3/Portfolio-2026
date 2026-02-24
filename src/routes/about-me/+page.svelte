<script lang="ts">
	import { onMount } from 'svelte';
	import Header from '$lib/components/layout/Header.svelte';
	import PixelBlast from '$lib/components/ui/PixelBlast.svelte';

	let visible = false;
	onMount(() => {
		visible = true;
	});
</script>

<main>
	<Header />
	<div class="about-container">
		<section class="about-section hero">
			<PixelBlast color="#B19EEF" pixelSize={3} patternDensity={1.5} variant="triangle" />
			<div class="hero-content">
				<div class="hero-text {visible ? 'animate' : ''}">
					<h1>
						<span class="line-wrapper">
							<span class="line-top anim-line">UN PEU PLUS</span>
						</span>
						<span class="line-wrapper">
							<span class="line-bottom anim-line">SUR MOI</span>
						</span>
					</h1>
					<div class="desktop-info">
						<span class="line-wrapper">
							<p class="anim-line">
								Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
								incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
								exercitation.
							</p>
						</span>
						<span class="line-wrapper">
							<button class="btn-test anim-line">test</button>
						</span>
					</div>
				</div>

				<div class="hero-image {visible ? 'animate' : ''}">
					<img
						class="photo-profil"
						src="/images/chourli-sansfond.webp"
						alt="Photo de Charlie Charron"
					/>
				</div>
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

	/* --- LOGIQUE D'ANIMATION --- */
	.line-wrapper {
		display: block;
		overflow: hidden; /* Effet tiroir : cache ce qui dépasse du bas */
		vertical-align: bottom;
	}

	.anim-line {
		display: block;
		transform: translateY(110%); /* Départ caché en bas */
		transition: transform 0.8s cubic-bezier(0.2, 1, 0.3, 1);
	}

	.hero-text.animate {
		.anim-line {
			transform: translateY(0); /* Remonte à sa place */
		}
		/* Décalage pour l'effet cascade */
		h1 .line-wrapper:nth-child(1) .anim-line {
			transition-delay: 0.1s;
		}
		h1 .line-wrapper:nth-child(2) .anim-line {
			transition-delay: 0.2s;
		}
		.desktop-info .line-wrapper:nth-child(1) .anim-line {
			transition-delay: 0.3s;
		}
		.desktop-info .line-wrapper:nth-child(2) .anim-line {
			transition-delay: 0.4s;
		}
	}

	.hero-image {
		opacity: 0;
		transform: translateY(15%);
		transition:
			transform 1.2s cubic-bezier(0.2, 1, 0.3, 1),
			opacity 1.5s ease;

		&.animate {
			opacity: 1;
			transform: translateY(0);
		}
	}

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
				height: calc(100dvh - #{$pad} * 2);
				background: #fff;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;

				&.hero {
					margin: 0 -#{$pad} 0 -#{$pad};
					width: calc(100% + #{$pad * 2});
					height: calc(100dvh - #{$header-h} - #{$pad});
					padding: 0;
					background: transparent;
					overflow-y: visible;

					.hero-content {
						flex: 1;
						display: flex;
						flex-direction: column;
						justify-content: flex-end;
						align-items: center;
						width: 100%;
						position: relative;

						.hero-text {
							display: flex;
							flex-direction: column;
							align-items: center;
							z-index: 3;
							h1 {
								margin-bottom: -10vh;
								line-height: 0.8;
								.line-top {
									font-size: 14vw;
									display: block;
								}
								.line-bottom {
									font-size: 20vw;
									padding-right: 10px;
									display: block;
								}
							}
							.desktop-info {
								display: none;
							}
						}
						.hero-image {
							width: 100%;
							display: flex;
							justify-content: center;
						}
						.photo-profil {
							width: 105%;
							margin-left: 15px;
							min-width: 100%;
							height: 75vh;
							object-fit: cover;
							object-position: top center;
							display: block;
							z-index: 2;
							filter: grayscale(90%) contrast(120%) brightness(90%);
						}

						@media (min-width: 1024px) {
							flex-direction: column;
							justify-content: space-between;
							align-items: center;
							padding: $pad ($pad * 3) 0 ($pad * 3);
							overflow: hidden;

							.hero-text {
								flex: 1;
								display: flex;
								flex-direction: column;
								justify-content: center;
								align-items: center;
								text-align: center;
								width: 100%;
								z-index: 10;

								h1 {
									margin-bottom: 1.5rem;
									.line-top {
										font-size: 4vw;
									}
									.line-bottom {
										font-size: 7vw;
									}
								}
								.desktop-info {
									display: flex;
									flex-direction: column;
									align-items: center;
									gap: 1.2rem;
									p {
										display: block;
										font-size: 1.1rem;
										max-width: 600px;
										color: #333;
									}
									.btn-test {
										padding: 12px 40px;
										background: #333;
										color: white;
										border: none;
										border-radius: 12px;
										font-weight: 900;
									}
								}
							}

							.hero-image {
								flex: 0 0 auto;
								width: 100%;
								display: flex;
								justify-content: center;
								align-items: flex-end;
							}

							.photo-profil {
								height: 100vh;
								width: auto;
								transform: translateY(-10%);
								margin-left: 0;
							}
						}

						@media (min-width: 1500px) {
							flex-direction: row-reverse;
							justify-content: space-between;
							align-items: stretch;
							padding: 0 ($pad * 4);

							.hero-text {
								flex: 0 1 40%;
								height: 100%;
								justify-content: center;
								align-items: flex-start;
								text-align: left;
								padding-bottom: 0;

								h1 {
									text-align: left;
									.line-top {
										font-size: 2.5vw;
									}
									.line-bottom {
										font-size: 4vw;
									}
								}
								.desktop-info {
									align-items: flex-start;
									p {
										text-align: left;
									}
								}
							}

							.hero-image {
								flex: 1 1 60%;
								height: 100%;
								align-items: flex-end;
								justify-content: flex-start;
							}

							.photo-profil {
								height: clamp(500px, 70vw, 130vh);
								transform: translateY(25%);
								object-position: bottom left;
							}
						}

						@media (orientation: landscape) and (max-height: 1024px) and (max-width: 1023px) {
							justify-content: flex-end;
							.hero-text h1 {
								margin-bottom: -15vh;
								.line-top {
									font-size: 8vw !important;
								}
								.line-bottom {
									font-size: 12vw !important;
								}
							}
							.photo-profil {
								height: 70vh !important;
								width: 70% !important;
								min-width: auto;
								transform: translateY(10%);
								object-position: center 20%;
							}
						}
					}
				}

				h1 {
					font-size: 12vw;
					color: #333;
					font-weight: 900;
					text-align: center;
				}
			}
		}
	}
</style>
