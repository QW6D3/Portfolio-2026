<script lang="ts">
	import { onMount } from 'svelte';
	import Header from '$lib/components/layout/Header.svelte';
	import PixelBlast from '$lib/components/ui/PixelBlast.svelte';

	let visible: boolean = false;
	let isScrolling: boolean = false;
	let currentSection: number = 0;
	const totalSections: number = 3;

	onMount(() => {
		visible = true;
		document.body.style.overflow = 'hidden';
		return () => (document.body.style.overflow = 'auto');
	});

	function goToSection(index: number) {
		if (index >= 0 && index < totalSections && !isScrolling) {
			isScrolling = true;
			currentSection = index;
			setTimeout(() => {
				isScrolling = false;
			}, 800);
		}
	}

	function handleWheel(event: WheelEvent) {
		if (isScrolling) return;
		if (event.deltaY > 0) goToSection(currentSection + 1);
		else if (event.deltaY < 0) goToSection(currentSection - 1);
	}

	let touchStartY = 0;
	function handleTouchStart(event: TouchEvent) {
		touchStartY = event.touches[0].clientY;
	}

	function handleTouchMove(event: TouchEvent) {
		if (isScrolling) return;
		const touchEndY = event.touches[0].clientY;
		const diff = touchStartY - touchEndY;
		if (Math.abs(diff) > 50) {
			if (diff > 0) goToSection(currentSection + 1);
			else goToSection(currentSection - 1);
		}
	}
</script>

<svelte:window
	on:wheel|nonpassive={handleWheel}
	on:touchstart={handleTouchStart}
	on:touchmove|nonpassive={handleTouchMove}
/>

<div class="fixed-header">
	<Header />
</div>

<main>
	<div class="about-container" style="transform: translateY(-{currentSection * 100}vh);">
		<section class="hero">
			<PixelBlast color="#B19EEF" pixelSize={3} patternDensity={1.5} variant="triangle" />

			<div class="hero-image-wrap {visible ? 'animate' : ''}">
				<img
					class="photo-profil"
					src="/images/chourli-sansfond.webp"
					alt="Photo de Charlie Charron"
					fetchpriority="high"
				/>
			</div>

			<div class="hero-inner">
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
			</div>
		</section>

		<section class="content-section">
			<div class="card-content">
				<h1>À propos de Charlie</h1>
			</div>
		</section>

		<section class="content-section">
			<div class="card-content">
				<h1>Test</h1>
			</div>
		</section>
	</div>
</main>

<style lang="scss">
	$pad: 44px;
	$header-h: 88px;
	$transition-main: 0.8s cubic-bezier(0.65, 0, 0.35, 1);

	:global(.main-contents) {
		overflow-y: hidden !important;
		padding: 0 !important;
	}

	.fixed-header {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		padding: $pad;
		z-index: 100;
		pointer-events: none;
		:global(*) {
			pointer-events: auto;
		}
	}

	/* --- ANIMATIONS --- */
	.line-wrapper {
		display: block;
		overflow: hidden;
	}
	.anim-line {
		display: block;
		transform: translateY(110%);
		transition: transform 0.8s cubic-bezier(0.2, 1, 0.3, 1);
	}

	.hero-text.animate {
		.anim-line {
			transform: translateY(0);
		}
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

	.hero-image-wrap {
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

	/* --- LAYOUT --- */
	main {
		width: 100dvw;
		height: 100dvh;
		overflow: hidden;

		.about-container {
			width: 100%;
			display: flex;
			flex-direction: column;
			transition: transform $transition-main;
			will-change: transform;

			section {
				width: 100%;
				height: 100dvh;
				flex-shrink: 0;
				position: relative;
				box-sizing: border-box;
			}

			// --- HERO MOBILE ---
			.hero {
				background: transparent;
				display: flex;
				flex-direction: column;
				justify-content: flex-end;
				align-items: center;
				overflow: hidden;

				.hero-image-wrap {
					position: absolute;
					bottom: 0;
					width: 100%;
					display: flex;
					justify-content: center;
					z-index: 5;
				}

				.photo-profil {
					width: 105%;
					height: 70vh;
					object-fit: cover;
					object-position: top center;
					filter: grayscale(90%) contrast(120%) brightness(90%);
				}

				.hero-inner {
					width: 100%;
					height: 100%;
					padding: $pad;
					display: flex;
					flex-direction: column;
					justify-content: flex-end;
					align-items: center;
					z-index: 2;

					.hero-text {
						margin-bottom: 55vh;
						h1 {
							font-weight: 900;
							line-height: 0.8;
							text-align: center;
							.line-top {
								font-size: 14vw;
							}
							.line-bottom {
								font-size: 20vw;
							}
						}
						.desktop-info {
							display: none;
						}
					}
				}
			}

			// --- SECTIONS 2 & 3 ---
			.content-section {
				padding: $pad;
				.card-content {
					width: 100%;
					height: 100%;
					background: #fff;
					display: flex;
					justify-content: center;
					align-items: center;
					h1 {
						font-size: 10vw;
						font-weight: 900;
						color: #333;
					}
				}
			}
		}
	}

	/* --- DESKTOP (1024px+) --- */
	@media (min-width: 1024px) and (orientation: landscape) {
		main .about-container .hero {
			overflow: hidden;

			.hero-image-wrap {
				position: absolute;
				bottom: 0;
				left: 0;
				width: 50%; // On réserve la moitié gauche
				height: 100%;
				display: flex;
				justify-content: flex-start;
				align-items: flex-end;
				z-index: 1;
				// On peut retirer le transform ici si l'image est bien cadrée
			}

			.photo-profil {
				width: clamp(700px, 75vw, 1500px);
				height: auto;
				max-height: 110vh; // Évite que l'image ne dépasse trop en hauteur
				object-fit: contain; // On utilise contain pour garder le ratio sans couper la tête
				object-position: bottom left;
				transform: translateY(25%); // Ajustement fin selon ta photo
			}

			.hero-inner {
				position: relative;
				z-index: 10;
				display: flex;
				flex-direction: row;
				justify-content: flex-end;
				align-items: flex-start;
				height: 100%;
				padding: 0 ($pad * 3);

				.hero-text {
					flex: 0 1 40%;
					text-align: left;

					margin-bottom: 0;
					margin-top: 30vh;

					h1 {
						text-align: start;
						margin-bottom: 2rem;
						.line-top {
							font-size: 4.1vw;
						}
						.line-bottom {
							font-size: 6vw;
						}
					}

					.desktop-info {
						display: flex;
						flex-direction: column;
						align-items: flex-start;
						gap: 1.5rem;
						.line-wrapper {
							width: 100%;
							p {
								font-size: 1.1rem;
								max-width: 450px;
								color: #333;
								line-height: 1.6;
							}

							.btn-test {
								width: 100%;
								padding: 14px 45px;
								background: #333;
								color: white;
								border: none;
								border-radius: 50px;
								font-weight: 900;
								cursor: pointer;
								transition: transform 0.3s ease;

								&:hover {
									transform: scale(1.05);
								}
							}
						}
					}
				}
			}
		}
	}

	/* --- PC LARGE (1500px+) : Retour au format split --- */
	@media (min-width: 1500px) and (orientation: landscape) {
		main .about-container .hero {
			flex-direction: row;

			.hero-inner {
				display: flex;
				flex-direction: row-reverse;
				justify-content: space-between;
				align-items: center;
				height: 100%;
				padding: 0 ($pad * 6);
				position: relative;

				.hero-text {
					flex: 0 1 50%;
					margin-top: 0;
					text-align: left;
					z-index: 10;

					h1 {
						text-align: left;
						margin-bottom: 2rem;
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
						.btn-test {
							width: auto;
						} // Le bouton reprend sa taille normale
					}
				}
			}

			.hero-image-wrap {
				position: relative;
				bottom: 0;
				left: 0;
				height: 100%;
				display: flex;
				z-index: 5;
				transform: none; // Reset du transform parent
				opacity: 1;
			}

			.photo-profil {
				position: absolute;
				max-height: none;
				height: clamp(500px, 90vw, 130vh);
				width: auto;
				object-fit: contain;
				left: 15%;
				object-position: bottom left;
			}
		}
	}

	/* --- LANDSCAPE TABLET --- */
	@media (orientation: landscape) and (max-height: 1024px) and (max-width: 1023px) {
		main .about-container .hero {
			.hero-inner .hero-text h1 {
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
				transform: translateY(10%);
			}
		}
	}
</style>
