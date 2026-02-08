<script lang="ts">
	import { onMount } from 'svelte';
	import { projects } from '$lib/data/projects';

	interface Project {
		id: string | number;
		imgCover: string;
		title?: string;
	}

	type TileSize = { width: number; height: number };

	// 2. State typé
	let columnCount = 1;
	let projectColumns: Project[][] = [];
	let tileSize: TileSize = { width: 350, height: 200 };

	onMount(() => {
		updateLayout();
		window.addEventListener('resize', updateLayout);
		return () => window.removeEventListener('resize', updateLayout);
	});

	function getColumnCount(length: number): number {
		if (length <= 6) return 1;
		if (length <= 12) return 2;
		if (length <= 18) return 3;
		return 4;
	}

	function getMaxColumnsByScreen(): number {
		const width = window.innerWidth;
		if (width < 768) return 2;
		if (width <= 1024) return 3;
		return 4;
	}

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

	// Typage strict de la fonction split
	function splitProjects(items: Project[], columns: number): Project[][] {
		const perColumn = Math.ceil(items.length / columns);
		return Array.from({ length: columns }, (_, i) =>
			items.slice(i * perColumn, (i + 1) * perColumn)
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
			{#each projectColumns as column, colIndex (colIndex)}
				<div class="column {colIndex % 2 === 0 ? 'scroll-down' : 'scroll-up'}">
					{#each [...column, ...column, ...column] as project, i (`${colIndex}-${i}`)}
						<div
							class="project-tile"
							style="width: {tileSize.width}px; height: {tileSize.height}px;"
						>
							<img src={project.imgCover} alt="Miniature du projet {project.title || ''}" />
						</div>
					{/each}
				</div>
			{/each}
		</div>
	</div>
</header>
