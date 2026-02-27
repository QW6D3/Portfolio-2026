<script lang="ts">
	import { onMount } from 'svelte';
	import { categoriesInfo, skills } from '$lib/data/about';
	import Header from '$lib/components/layout/Header.svelte';
	import PixelBlast from '$lib/components/ui/PixelBlast.svelte';

	let visible: boolean = false;
	let isScrolling: boolean = false;
	let currentSection: number = 0;
	const totalSections: number = 3;

	onMount(() => {
		visible = true;

		const mainContent = document.querySelector('.main-contents') as HTMLElement;

		const originalPadding = mainContent?.style.padding;

		if (mainContent) {
			mainContent.style.setProperty('padding', '0', 'important');
			mainContent.style.setProperty('overflow-y', 'hidden', 'important');
		}
		document.body.style.overflow = 'hidden';
		return () => {
			if (mainContent) {
				mainContent.style.padding = originalPadding || '';
				mainContent.style.overflowY = 'auto';
			}
			document.body.style.overflow = 'auto';
			visible = false;
		};
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
		if (!visible || isScrolling) return;

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
			else if (diff < 0) goToSection(currentSection - 1);
		}
	}

	/* -- Section Skills -- */
	type CategoryKey = keyof typeof categoriesInfo;
	const uniqueGroups: CategoryKey[] = Array.from(
		new Set(skills.map((s) => s.group as CategoryKey))
	);

	function getGroupedSubSkills(groupName: string) {
		const groupSkills = skills.filter((s) => s.group === groupName);

		const hasSubGroups = groupSkills.some((s) => s.subGroup);

		if (!hasSubGroups) {
			return { hasSubGroups: false, list: groupSkills };
		}

		const grouped = groupSkills.reduce(
			(acc, skill) => {
				const key = skill.subGroup || 'Autres';
				if (!acc[key]) acc[key] = [];
				acc[key].push(skill);
				return acc;
			},
			{} as Record<string, typeof skills>
		);

		return { hasSubGroups: true, groups: Object.entries(grouped) };
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

		<section class="content-section skills">
			<div class="card-content">
				<h1>Ce que je sais faire ...</h1>
			</div>
			<div class="bento-grid">
				{#each uniqueGroups as group (group)}
					{@const info = categoriesInfo[group]}
					{@const subGroupData = getGroupedSubSkills(group)}
					{@const cardClass = `card-${group.toLowerCase()}`}

					<div class="bento-card {cardClass}" style="background-color: {info.color}">
						<div class="header">
							<h2 style="color: {info.color}; filter: brightness(0.6);">{group}</h2>
						</div>

						<div class="skill-list">
							{#if subGroupData.hasSubGroups}
								{#each subGroupData.groups as [subName, items] (subName)}
									<div class="sub-group-container">
										<span class="sub-group-title">{subName}</span>
										<ul>
											{#each items as skill (skill)}
												<li>{skill.name}</li>
											{/each}
										</ul>
									</div>
								{/each}
							{:else}
								<ul>
									{#each subGroupData.list as skill (skill)}
										<li>{skill.name}</li>
									{/each}
								</ul>
							{/if}
						</div>
					</div>
				{/each}
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

			.content-section {
				padding: $pad;
			}

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

			.skills {
				width: 100%;
				height: 100dvh;
				background-color: var(--color-text);
				padding-top: calc($header-h * 1.5);
				display: flex;
				flex-direction: column;
				overflow: hidden;

				h1 {
					color: var(--color-bg);
					font-weight: 900;
					margin-bottom: 2rem;
					font-size: clamp(2rem, 5vw, 3.5rem);
				}
				.bento-grid {
					display: grid;
					grid-template-columns: repeat(6, 1fr);
					grid-template-rows: repeat(5, 1fr);
					gap: calc($pad/2);
					width: 100%;
					height: 100%;

					.bento-card {
						border-radius: 20px;
						padding: 1.4rem;
						display: flex;
						flex-direction: column;
						gap: 0.8rem;
						overflow: hidden;
						transition: all 0.35s cubic-bezier(0.2, 1, 0.3, 1);

						&:hover {
							transform: translateY(-2px);
							filter: brightness(1.15);
						}

						&.card-frontend {
							grid-column: span 3 / span 3;
							grid-row: span 2 / span 2;
						}
						&.card-backend {
							grid-column: span 2 / span 2;
							grid-row: span 2 / span 2;
							grid-column-start: 4;
							grid-row-start: 1;
						}
						&.card-database {
							grid-column: span 2 / span 2;
							grid-row: span 3 / span 3;
							grid-column-start: 1;
							grid-row-start: 3;
						}
						&.card-devops {
							grid-column: span 3 / span 3;
							grid-row: span 3 / span 3;
							grid-column-start: 3;
							grid-row-start: 3;
						}
						&.card-tools {
							grid-row: span 3 / span 3;
							grid-column-start: 6;
							grid-row-start: 1;
						}
						&.card-design {
							grid-row: span 2 / span 2;
							grid-column-start: 6;
							grid-row-start: 4;
						}

						.header h2 {
							font-size: 1.5rem;
							font-weight: 700;
							letter-spacing: -0.02em;
							text-transform: uppercase;
							margin: 0;
							color: var(--color-bg);
						}

						.skill-list {
							display: flex;
							flex-direction: column;
							gap: 0.5rem;
							flex: 1;

							.sub-group-title {
								font-size: 0.58rem;
								letter-spacing: 0.1em;
								text-transform: uppercase;
								display: block;
								color: var(--color-bg);
							}

							ul {
								list-style: none;
								padding: 0;
								margin: 0;
								display: flex;
								flex-wrap: wrap;
								gap: 0.4rem;

								li {
									font-weight: 600;
									font-size: 0.85rem;
									color: rgba(255, 255, 255, 0.9);
									border-radius: 8px;
									padding: 0.25rem 0.65rem;
									white-space: nowrap;
									border: 1px solid rgba(255, 255, 255, 0.15);
								}
							}
						}
					}
				}
			}

			// ── Tablette ──
			@media (max-width: 1024px) {
				.skills {
					height: auto;
					min-height: 100dvh;

					.bento-grid {
						grid-template-columns: repeat(4, 1fr);
						grid-template-rows: auto;
						height: auto;

						.bento-card {
							grid-column: unset !important;
							grid-row: unset !important;
							grid-column-start: unset !important;
							grid-row-start: unset !important;
							min-height: 180px;

							&.card-frontend {
								grid-column: span 3 !important;
							}
							&.card-backend {
								grid-column: span 2 !important;
							}
							&.card-database {
								grid-column: span 2 !important;
							}
							&.card-devops {
								grid-column: span 2 !important;
							}
							&.card-tools {
								grid-column: span 1 !important;
							}
							&.card-design {
								grid-column: span 1 !important;
							}
						}
					}
				}
			}

			// ── Mobile ──
			@media (max-width: 600px) {
				.skills {
					.bento-grid {
						grid-template-columns: 1fr;
						height: auto;

						.bento-card {
							grid-column: unset !important;
							grid-row: unset !important;
							grid-column-start: unset !important;
							grid-row-start: unset !important;
							min-height: 160px;
						}
					}
				}
			}
		}
	}

	@media (min-width: 1024px) and (orientation: landscape) {
		main .about-container .hero {
			overflow: hidden;

			.hero-image-wrap {
				position: absolute;
				bottom: 0;
				left: 0;
				width: 50%;
				height: 100%;
				display: flex;
				justify-content: flex-start;
				align-items: flex-end;
				z-index: 1;
			}

			.photo-profil {
				width: clamp(700px, 75vw, 1500px);
				height: auto;
				max-height: 110vh;
				object-fit: contain;
				object-position: bottom left;
				transform: translateY(25%);
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
						}
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
				transform: none;
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
