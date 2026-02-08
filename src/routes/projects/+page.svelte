<script lang="ts">
	// 1. Imports
	import { onMount } from 'svelte';
	import { projects } from '$lib/data/projects';

	// 2. Types
	type TileSize = { width: number; height: number };

	// 3. State (variables réactives)
	let columnCount = 1;
	let projectColumns: any[][] = [];
	let tileSize: TileSize = { width: 350, height: 200 };

	// 4. Lifecycle
	onMount(() => {
		updateLayout();
		window.addEventListener('resize', updateLayout);
		return () => window.removeEventListener('resize', updateLayout);
	});

	// 5. Utility functions

	/** Détermine le nombre de colonnes en fonction du nombre de projets */
	function getColumnCount(length: number): number {
		if (length <= 6) return 1;
		if (length <= 12) return 2;
		if (length <= 18) return 3;
		return 4;
	}

	/** Détermine le max de colonnes en fonction de la taille d'écran */
	function getMaxColumnsByScreen(): number {
		const width = window.innerWidth;
		if (width < 768) return 2;
		if (width <= 1024) return 3;
		return 4;
	}

	/** Calcule la taille des tiles en fonction du nombre de colonnes */
	function getSizeTile(columns: number): TileSize {
		const baseSize: TileSize = { width: 750, height: 500 };

		switch (columns) {
			case 1:
				return baseSize;
			case 2:
				return { width: baseSize.width * 0.7, height: baseSize.height * 0.7 };
			case 3:
				return { width: baseSize.width * 0.6, height: baseSize.height * 0.6 };
			default:
				return { width: baseSize.width * 0.5, height: baseSize.height * 0.5 };
		}
	}

	function splitProjects(projects: any[], columns: number): any[][] {
		const perColumn = Math.ceil(projects.length / columns);
		return Array.from({ length: columns }, (_, i) =>
			projects.slice(i * perColumn, (i + 1) * perColumn)
		);
	}

	function updateLayout() {
		const baseCount = getColumnCount(projects.length);
		const maxCount = getMaxColumnsByScreen();

		columnCount = Math.min(baseCount, maxCount);
		projectColumns = splitProjects(projects, columnCount);
		tileSize = getSizeTile(columnCount);
	}
</script>

<header>
	<div class="header-content">
		<h1>Mes projets</h1>
		<p>Découvrez mes projets les plus marquants, alliant créativité et expertise technique.</p>
		<button>Decouvrir mes projets</button>
	</div>
	<div class="slidingProject-content">
		<div class="absolute-slidingProjects columns-{columnCount}">
			{#each projectColumns as column, colIndex}
				<div class="column {colIndex % 2 === 0 ? 'scroll-down' : 'scroll-up'}">
					{#each [...column, ...column, ...column] as project}
						<div
							class="project-tile"
							style="width: {tileSize.width}px; height: {tileSize.height}px;"
						>
							<img src={project.imgCover} alt="Miniature projet" />
						</div>
					{/each}
				</div>
			{/each}
		</div>
	</div>
</header>
<main>
	<section></section>
	<section></section>
	<section></section>
</main>

<style lang="scss">
	:global(body) {
		background-color: black;
	}

	header {
		color: white;
		display: flex;
		position: relative;
		flex-direction: row;
		overflow: hidden;
		width: auto;
		height: 100vh;
		padding: 0 15%;

		.header-content {
			flex: 0.3;
			display: flex;
			flex-direction: column;
			gap: 8px;
			justify-content: center;

			button {
				font-family: var(--font-sans);
				background-color: white;
				color: black;
				border: none;
				padding: 20px 60px;
				border-radius: 8px;
				margin-top: 17px;
				font-size: var(--font-size-xs);
				font-weight: 800;
				cursor: pointer;
			}
		}
		.slidingProject-content {
			display: flex;
			flex: 0.7;
			.absolute-slidingProjects {
				display: flex;
				position: absolute;
				gap: 8px;
				top: 50%;
				right: -200px;
				transform: translateY(-50%) rotateZ(15deg);
				z-index: -1;
				.column {
					display: flex;
					flex-direction: column;
					justify-content: center;
					gap: 8px;
					.project-tile {
						height: 200px;
						width: 450px;
						img {
							width: 100%;
							height: 100%;
							object-fit: cover;
							border-radius: 8px;
						}
					}
				}
				.column:nth-child(odd) {
					margin-top: 100px;
				}
				&.columns-1 {
					right: 175px;
				}
			}
			/* Animation des colonnes */
			.scroll-up {
				animation: scroll-up 40s linear infinite;
			}

			.scroll-down {
				animation: scroll-down 40s linear infinite;
			}
			@keyframes scroll-up {
				from {
					transform: translateY(0);
				}
				to {
					transform: translateY(-20%);
				}
			}

			@keyframes scroll-down {
				from {
					transform: translateY(0);
				}
				to {
					transform: translateY(20%);
				}
			}
		}
	}

	/* Responsive design (à compléter si besoin) */
	@media (max-width: 1024px) {
	}
	@media (max-width: 768px) {
	}
</style>
