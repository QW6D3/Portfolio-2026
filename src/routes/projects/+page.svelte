<script lang="ts">
	import Header from '$lib/components/layout/Header.svelte';
	import ProjectCard from '$lib/components/layout/ProjectCard.svelte';
	import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-svelte';
	import { projects, upcomingProjects } from '$lib/data/projects';
	import type { Project } from '$lib/data/projects';
	import { tick } from 'svelte';

	// ── Search ────────────────────────────────────────────────
	let inputSearchBar = '';

	// ── Filter popup state ───────────────────────────────────
	let filterOpen = false;
	let filterPopupEl: HTMLDivElement;
	let filterBtnEl: HTMLButtonElement;
	let popupHeight = 0;
	let popupContentEl: HTMLDivElement;

	// ── Active filters ────────────────────────────────────────
	type FilterTag = { category: string; value: string; id: string };
	let activeFilters: FilterTag[] = [];
	let removingIds: Set<string> = new Set();

	// ── Filter options ────────────────────────────────────────
	const years = ['2025', '2024', '2023'];
	const filterOptions: Record<string, string[]> = {
		Type: ['Web App', 'Mobile', 'API', 'Open Source', 'CLI', 'Design System'],
		Langages: ['TypeScript', 'JavaScript', 'Python', 'Rust', 'Go', 'Swift'],
		Stack: ['SvelteKit', 'React', 'Next.js', 'Node.js', 'PostgreSQL', 'Docker']
	};

	// ── Custom select / combobox state ───────────────────────
	let yearOpen = false;
	let yearBtnEl: HTMLButtonElement;
	let yearListHeight = 0;
	let yearListEl: HTMLUListElement;
	let yearTriggerRect = { bottom: 0, left: 0, width: 0 };

	type ComboRect = { bottom: number; left: number; width: number };
	type ComboState = { open: boolean; search: string; listHeight: number; rect: ComboRect };
	let comboStates: Record<string, ComboState> = Object.fromEntries(
		Object.keys(filterOptions).map((k) => [
			k,
			{ open: false, search: '', listHeight: 0, rect: { bottom: 0, left: 0, width: 0 } }
		])
	);
	let comboBtnEls: Record<string, HTMLButtonElement> = {};
	let comboListEls: Record<string, HTMLUListElement> = {};

	// ── Gestion de la hauteur du popup (Fix boucle infinie) ──
	async function updatePopupHeight() {
		if (filterOpen && popupContentEl) {
			await tick();
			const newH = popupContentEl.scrollHeight;
			if (newH !== popupHeight) popupHeight = newH;
		}
	}

	// On surveille les changements de filtres pour ajuster la hauteur
	$: if (activeFilters || filterOpen) {
		updatePopupHeight();
	}

	$: comboFiltered = Object.fromEntries(
		Object.entries(filterOptions).map(([cat, opts]) => [
			cat,
			opts.filter((o) => o.toLowerCase().includes((comboStates[cat]?.search ?? '').toLowerCase()))
		])
	);

	// ── Toggle filter popup ───────────────────────────────────
	async function toggleFilter() {
		if (!filterOpen) {
			Object.keys(comboStates).forEach((k) => {
				comboStates[k].search = '';
				comboStates[k].open = false;
				comboStates[k].listHeight = 0;
			});
			comboStates = { ...comboStates };
			yearOpen = false;
			filterOpen = true;
			await tick();
			popupHeight = popupContentEl?.scrollHeight ?? 0;
		} else {
			closeFilter();
		}
	}

	function closeFilter() {
		popupHeight = 0;
		Object.keys(comboStates).forEach((k) => {
			comboStates[k].search = '';
			comboStates[k].open = false;
			comboStates[k].listHeight = 0;
		});
		comboStates = { ...comboStates };
		yearOpen = false;
		setTimeout(() => (filterOpen = false), 420);
	}

	// ── Year dropdown ─────────────────────────────────────────
	async function toggleYear(e: MouseEvent) {
		e.stopPropagation();
		if (!yearOpen) {
			const rect = yearBtnEl.getBoundingClientRect();
			yearTriggerRect = { bottom: rect.bottom + 6, left: rect.left, width: rect.width };
			yearOpen = true;
			await tick();
			yearListHeight = yearListEl?.scrollHeight ?? 0;
		} else {
			yearListHeight = 0;
			setTimeout(() => (yearOpen = false), 380);
		}
	}

	// ── Combobox ──────────────────────────────────────────────
	async function toggleCombo(cat: string, e: MouseEvent) {
		e.stopPropagation();
		const isOpen = comboStates[cat].open;

		for (const k of Object.keys(comboStates)) {
			if (k !== cat && comboStates[k].open) {
				comboStates[k].listHeight = 0;
				const kk = k;
				setTimeout(() => {
					comboStates[kk].open = false;
					comboStates = { ...comboStates };
				}, 380);
			}
		}

		if (!isOpen) {
			const rect = comboBtnEls[cat].getBoundingClientRect();
			comboStates[cat].rect = { bottom: rect.bottom + 6, left: rect.left, width: rect.width };
			comboStates[cat].open = true;
			comboStates = { ...comboStates };
			await tick();
			comboStates[cat].listHeight = comboListEls[cat]?.scrollHeight ?? 0;
			comboStates = { ...comboStates };
		} else {
			comboStates[cat].listHeight = 0;
			comboStates = { ...comboStates };
			setTimeout(() => {
				comboStates[cat].open = false;
				comboStates = { ...comboStates };
			}, 380);
		}
	}

	// ── Outside click ─────────────────────────────────────────
	function handleOutsideClick(e: MouseEvent) {
		const target = e.target as Node;

		if (yearOpen && !yearBtnEl?.closest('.year-select')?.contains(target)) {
			yearListHeight = 0;
			setTimeout(() => (yearOpen = false), 380);
		}

		for (const cat of Object.keys(comboStates)) {
			if (comboStates[cat].open) {
				const wrap = comboBtnEls[cat]?.closest('.combo-select');
				if (!wrap?.contains(target)) {
					comboStates[cat].listHeight = 0;
					comboStates = { ...comboStates };
					const cc = cat;
					setTimeout(() => {
						comboStates[cc].open = false;
						comboStates = { ...comboStates };
					}, 380);
				}
			}
		}

		if (
			filterOpen &&
			filterPopupEl &&
			!filterPopupEl.contains(target) &&
			filterBtnEl &&
			!filterBtnEl.contains(target)
		) {
			closeFilter();
		}
	}

	// ── Add / remove filters ──────────────────────────────────
	function addFilter(category: string, value: string) {
		if (activeFilters.some((f) => f.category === category && f.value === value)) return;
		activeFilters = [
			...activeFilters,
			{ category, value, id: `${category}-${value}-${Date.now()}` }
		];
		updatePopupHeight();
	}

	async function removeFilter(id: string) {
		removingIds = new Set([...removingIds, id]);
		await new Promise((r) => setTimeout(r, 310));
		activeFilters = activeFilters.filter((f) => f.id !== id);
		removingIds = new Set([...removingIds].filter((x) => x !== id));
		updatePopupHeight();
	}

	// ── Filtered projects ─────────────────────────────────────
	$: filteredProjects = projects.filter((p: Project) => {
		const matchSearch =
			inputSearchBar.trim() === '' ||
			p.title.toLowerCase().includes(inputSearchBar.toLowerCase()) ||
			p.tags.some((t) => t.toLowerCase().includes(inputSearchBar.toLowerCase()));

		const matchFilters = activeFilters.every((f) => {
			if (f.category === 'Année') return p.year?.toString() === f.value;
			if (f.category === 'Type') return p.type === f.value;
			if (f.category === 'Langages') return p.tags?.includes(f.value);
			if (f.category === 'Stack') return p.tags?.includes(f.value);
			return true;
		});

		return matchSearch && matchFilters;
	});

	$: filteredUpcoming = upcomingProjects.filter((p: Project) => {
		const matchSearch =
			inputSearchBar.trim() === '' ||
			p.title.toLowerCase().includes(inputSearchBar.toLowerCase()) ||
			p.tags.some((t) => t.toLowerCase().includes(inputSearchBar.toLowerCase()));

		const matchFilters = activeFilters.every((f) => {
			if (f.category === 'Année') return p.year?.toString() === f.value;
			if (f.category === 'Type') return p.type === f.value;
			if (f.category === 'Langages') return p.tags?.includes(f.value);
			if (f.category === 'Stack') return p.tags?.includes(f.value);
			return true;
		});

		return matchSearch && matchFilters;
	});
</script>

<svelte:window on:click={handleOutsideClick} />

<main class="project-page">
	<Header />
	<div class="page-container">
		<div class="research-container">
			<h1 class="search-title">Découvrez mes projets</h1>

			<div class="project-searchBar">
				<div class="upper-part">
					<input
						type="text"
						class="input-search"
						bind:value={inputSearchBar}
						placeholder="Rechercher un projet ou un tag…"
					/>
				</div>

				<div class="lower-part desktop-only">
					<div class="filter-row">
						<button
							class="filter-btn"
							bind:this={filterBtnEl}
							on:click|stopPropagation={toggleFilter}
							aria-label="Filtres"
						>
							<SlidersHorizontal color="#ffffff" strokeWidth={1.5} size={18} />
						</button>

						{#if activeFilters.length > 0}
							<span class="separator">|</span>
						{/if}

						<div class="tags-row">
							{#each activeFilters as f (f.id)}
								<span class="filter-tag" class:removing={removingIds.has(f.id)}>
									<span class="tag-label">{f.category}:{f.value}</span>
									<button
										class="tag-remove"
										on:click|stopPropagation={() => removeFilter(f.id)}
										aria-label="Supprimer {f.value}"
									>
										<X size={11} strokeWidth={2.5} />
									</button>
								</span>
							{/each}
						</div>
					</div>

					{#if filterOpen}
						<div
							class="filter-popup"
							bind:this={filterPopupEl}
							style="height: {popupHeight}px;"
							on:click|stopPropagation
						>
							<div class="filter-popup-inner">
								<div class="filter-popup-content" bind:this={popupContentEl}>
									<div class="popup-close-row">
										<button
											class="popup-close-btn"
											on:click={closeFilter}
											aria-label="Fermer les filtres"
										>
											<X size={15} strokeWidth={2} />
										</button>
									</div>

									<div class="filter-grid">
										<div class="filter-section">
											<div class="section-header">
												<span class="filter-section-title">Année</span>
												<span class="section-line"></span>
											</div>
											<div class="year-select" on:click|stopPropagation>
												<button
													class="select-trigger"
													class:open={yearOpen}
													bind:this={yearBtnEl}
													on:click={toggleYear}
												>
													<span
														>{activeFilters.find((f) => f.category === 'Année')?.value ??
															'Sélectionner…'}</span
													>
													<ChevronDown size={14} strokeWidth={1.8} />
												</button>
											</div>
										</div>

										{#each Object.entries(filterOptions) as [cat] (cat)}
											<div class="filter-section">
												<div class="section-header">
													<span class="filter-section-title">{cat}</span>
													<span class="section-line"></span>
												</div>
												<div class="combo-select" on:click|stopPropagation>
													<button
														class="select-trigger"
														class:open={comboStates[cat].open}
														bind:this={comboBtnEls[cat]}
														on:click={(e) => toggleCombo(cat, e)}
													>
														<span class="combo-trigger-text">
															{#if activeFilters.filter((f) => f.category === cat).length > 0}
																{activeFilters
																	.filter((f) => f.category === cat)
																	.map((f) => f.value)
																	.join(', ')}
															{:else}
																Sélectionner…
															{/if}
														</span>
														<ChevronDown size={14} strokeWidth={1.8} />
													</button>
												</div>
											</div>
										{/each}
									</div>
								</div>
							</div>
						</div>
					{/if}
				</div>

				<div class="button-tag" class:visible={inputSearchBar.length > 0}></div>
				<div class="box-button">
					<div class="button-search" class:visible={inputSearchBar.length > 0}>
						<Search color="#ffffff" size={18} />
					</div>
				</div>
			</div>
		</div>

		<div class="projects-container">
			<div class="section-header-main">
				<span class="section-title-main">Projets finalisés</span>
				<span class="section-line-main"></span>
			</div>

			{#if filteredProjects.length === 0}
				<p class="no-results">Aucun projet trouvé.</p>
			{:else}
				<div class="projects-grid">
					{#each filteredProjects as project (project.id)}
						<ProjectCard {project} />
					{/each}
				</div>
			{/if}

			<div class="section-header-main upcoming-header">
				<span class="section-title-main">Projets à venir</span>
				<span class="section-line-main"></span>
			</div>

			{#if filteredUpcoming.length === 0}
				<p class="no-results">Aucun projet à venir correspondant.</p>
			{:else}
				<div class="projects-grid">
					{#each filteredUpcoming as project (project.id)}
						<ProjectCard {project} />
					{/each}
				</div>
			{/if}
		</div>
	</div>
</main>

{#if yearOpen}
	<ul
		class="dropdown-fixed"
		bind:this={yearListEl}
		style="top:{yearTriggerRect.bottom}px;left:{yearTriggerRect.left}px;width:{yearTriggerRect.width}px;height:{yearListHeight}px;"
		on:click|stopPropagation
	>
		{#each years as y (y)}
			<li>
				<button
					class="dropdown-item"
					class:active={activeFilters.some((f) => f.category === 'Année' && f.value === y)}
					on:click={() => {
						addFilter('Année', y);
						yearListHeight = 0;
						setTimeout(() => (yearOpen = false), 380);
					}}>{y}</button
				>
			</li>
		{/each}
	</ul>
{/if}

{#each Object.entries(filterOptions) as [cat] (cat)}
	{#if comboStates[cat].open}
		<div
			class="dropdown-fixed combo-dropdown-fixed"
			style="top:{comboStates[cat].rect.bottom}px;left:{comboStates[cat].rect
				.left}px;width:{comboStates[cat].rect.width}px;height:{comboStates[cat].listHeight}px;"
			on:click|stopPropagation
		>
			<div class="combo-search-wrap">
				<input
					class="combo-search"
					type="text"
					placeholder="Rechercher…"
					bind:value={comboStates[cat].search}
					on:click|stopPropagation
				/>
			</div>
			<ul class="combo-list" bind:this={comboListEls[cat]}>
				{#each comboFiltered[cat] as opt (opt)}
					<li>
						<button
							class="dropdown-item"
							class:active={activeFilters.some((f) => f.category === cat && f.value === opt)}
							on:click={() => addFilter(cat, opt)}>{opt}</button
						>
					</li>
				{:else}
					<li class="no-combo-result">Aucun résultat</li>
				{/each}
			</ul>
		</div>
	{/if}
{/each}

<style lang="scss">
	$raccord-size: 2rem;
	$raccord-radius: 10px;
	$btn-size: 50px;
	$btn-radius: 9px;
	$ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
	$dur: 0.42s;

	.page-container {
		min-height: calc(100dvh - 88px);
		display: flex;
		flex-direction: column;
		padding: 100px 0 48px;
		box-sizing: border-box;
	}

	.research-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 20px;
		flex-shrink: 0;
		padding: 0 24px;
	}

	.search-title {
		font-size: clamp(1.8rem, 3.5vw, 2.6rem);
		font-weight: 700;
		color: var(--color-text);
		margin: 0;
		opacity: 0.25;
		filter: blur(6px);
		animation: revealTitle 0.7s $ease-out-expo forwards;
		animation-delay: 0.2s;
	}

	.project-searchBar {
		position: relative;
		display: flex;
		flex-direction: column;
		padding: 22px;
		border-radius: 20px;
		overflow: visible;
		background-color: var(--color-text);
		animation: expandBar 0.8s ease forwards;
		width: clamp(150px, 100%, 850px);
		box-sizing: border-box;

		.upper-part {
			display: flex;
			justify-content: space-between;
			animation: fadeInContent 0.4s ease forwards;
			animation-delay: 1.3s;
			opacity: 0;
			margin-bottom: 16px;

			.input-search {
				width: 100%;
				margin-left: 8px;
				background-color: transparent;
				border: none;
				outline: none;
				color: var(--color-bg);
				font-size: 0.95rem;
				&::placeholder {
					color: var(--color-bg);
					opacity: 0.4;
				}
			}
		}

		.lower-part {
			opacity: 0;
			animation: fadeInContent 0.4s ease forwards;
			animation-delay: 1s;
			z-index: 1;
			position: relative;
		}
	}

	.filter-row {
		display: flex;
		align-items: center;
		gap: 10px;
		flex-wrap: nowrap;
		min-height: 28px;
	}

	.filter-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		background: transparent;
		border: none;
		cursor: pointer;
		padding: 2px 4px;
		flex-shrink: 0;
		opacity: 0.7;
		transition: opacity 0.2s;
		&:hover {
			opacity: 1;
		}
	}

	.separator {
		color: var(--color-bg);
		opacity: 0.3;
		font-weight: 300;
		font-size: 1rem;
		flex-shrink: 0;
		user-select: none;
	}

	.tags-row {
		display: flex;
		align-items: center;
		gap: 7px;
		flex-wrap: wrap;
	}

	.filter-tag {
		display: inline-flex;
		align-items: center;
		gap: 5px;
		background-color: var(--color-bg);
		color: var(--color-text);
		border-radius: 6px;
		padding: 3px 8px 3px 9px;
		font-size: 0.75rem;
		font-weight: 500;
		white-space: nowrap;
		animation: tagIn 0.3s $ease-out-expo forwards;
		transition:
			opacity 0.3s ease,
			transform 0.3s ease,
			max-width 0.36s $ease-out-expo,
			padding 0.36s $ease-out-expo,
			margin 0.36s $ease-out-expo;

		&.removing {
			opacity: 0;
			transform: scale(0.82);
			max-width: 0 !important;
			padding-left: 0;
			padding-right: 0;
			overflow: hidden;
		}
	}

	.tag-label {
		line-height: 1;
	}

	.tag-remove {
		display: flex;
		align-items: center;
		justify-content: center;
		background: transparent;
		border: none;
		cursor: pointer;
		padding: 0;
		color: var(--color-text);
		opacity: 0.45;
		transition: opacity 0.18s;
		flex-shrink: 0;
		&:hover {
			opacity: 1;
		}
	}

	// ── Filter popup ──────────────────────────────────────────
	.filter-popup {
		position: absolute;
		top: calc(100% + 10px);
		left: 0;
		width: auto;
		min-width: 520px;
		background-color: #3a3a3a;
		border-radius: 14px;
		overflow: hidden;
		transition: height $dur $ease-out-expo;
		z-index: 9999;
		box-shadow: 0 12px 48px rgba(0, 0, 0, 0.45);
	}

	.filter-popup-inner {
		width: 100%;
	}

	.filter-popup-content {
		padding: 0 24px 24px;
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	.popup-close-row {
		display: flex;
		justify-content: flex-end;
		padding-top: 14px;
		padding-bottom: 2px;
	}

	.popup-close-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		background: transparent;
		border: none;
		cursor: pointer;
		color: rgba(255, 255, 255, 0.4);
		padding: 4px;
		border-radius: 6px;
		transition:
			color 0.2s,
			background 0.2s;
		&:hover {
			color: rgba(255, 255, 255, 0.9);
			background: rgba(255, 255, 255, 0.07);
		}
	}

	.filter-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 20px 28px;
	}

	.filter-section {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.section-header {
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.filter-section-title {
		font-size: 0.68rem;
		font-weight: 200;
		color: rgba(255, 255, 255, 0.45);
		white-space: nowrap;
		flex-shrink: 0;
		letter-spacing: 0.1em;
		text-transform: uppercase;
	}

	.section-line {
		flex: 1;
		height: 1px;
		background: rgba(255, 255, 255, 0.1);
	}

	.select-trigger {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		background: rgba(255, 255, 255, 0.06);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 8px;
		color: rgba(255, 255, 255, 0.65);
		font-size: 0.82rem;
		padding: 8px 12px;
		cursor: pointer;
		transition:
			background $dur $ease-out-expo,
			border-color $dur $ease-out-expo,
			color 0.2s;
		text-align: left;
		gap: 8px;
		box-sizing: border-box;

		span {
			flex: 1;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
		:global(svg) {
			flex-shrink: 0;
			opacity: 0.5;
			transition:
				transform $dur $ease-out-expo,
				opacity 0.2s;
		}

		&.open {
			background: rgba(255, 255, 255, 0.1);
			border-color: rgba(255, 255, 255, 0.2);
			color: #fff;
			:global(svg) {
				transform: rotate(180deg);
				opacity: 0.85;
			}
		}
		&:hover:not(.open) {
			background: rgba(255, 255, 255, 0.09);
			color: rgba(255, 255, 255, 0.9);
		}
	}

	.year-select,
	.combo-select {
		position: relative;
	}
	.combo-trigger-text {
		flex: 1;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	// ── Dropdowns fixed ───────────────────────────────────────
	:global(.dropdown-fixed) {
		position: fixed;
		list-style: none;
		margin: 0;
		padding: 4px;
		background: #2e2e2e;
		border: 1px solid rgba(255, 255, 255, 0.12);
		border-radius: 8px;
		box-shadow: 0 8px 28px rgba(0, 0, 0, 0.5);
		z-index: 10100;
		overflow: hidden;
		transition: height $dur $ease-out-expo;
		box-sizing: border-box;
	}

	:global(.combo-dropdown-fixed) {
		padding: 0;
	}

	:global(.combo-search-wrap) {
		padding: 8px 8px 6px;
		border-bottom: 1px solid rgba(255, 255, 255, 0.07);
	}

	:global(.combo-search) {
		width: 100%;
		background: rgba(255, 255, 255, 0.06);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 6px;
		color: rgba(255, 255, 255, 0.8);
		font-size: 0.78rem;
		padding: 5px 10px;
		outline: none;
		box-sizing: border-box;
		transition:
			border-color 0.22s,
			background 0.22s;
		&::placeholder {
			color: rgba(255, 255, 255, 0.28);
		}
		&:focus {
			border-color: rgba(255, 255, 255, 0.22);
			background: rgba(255, 255, 255, 0.09);
		}
	}

	:global(.combo-list) {
		list-style: none;
		margin: 0;
		padding: 4px;
		max-height: 180px;
		overflow-y: auto;
	}

	:global(.dropdown-item) {
		display: block;
		width: 100%;
		background: transparent;
		border: none;
		color: rgba(255, 255, 255, 0.6);
		font-size: 0.82rem;
		padding: 7px 10px;
		border-radius: 5px;
		cursor: pointer;
		text-align: left;
		transition:
			background 0.2s $ease-out-expo,
			color 0.2s;
		&:hover {
			background: rgba(255, 255, 255, 0.07);
			color: #fff;
		}
		&.active {
			background: var(--color-primary);
			color: #fff;
		}
	}

	:global(.no-combo-result) {
		font-size: 0.78rem;
		color: rgba(255, 255, 255, 0.28);
		padding: 10px;
		text-align: center;
	}

	// ── Search button corner ──────────────────────────────────
	.button-tag {
		position: absolute;
		bottom: -1px;
		right: -1px;
		width: calc($btn-size + 15px);
		height: calc($btn-size + 15px);
		background-color: var(--color-bg);
		border-radius: 15px 0 0 0;
		z-index: 2;
		pointer-events: none;
		transform-origin: bottom right;
		transform: scale(0);
		transition: transform 0.6s ease-out;

		&::before {
			content: '';
			position: absolute;
			width: $raccord-size;
			height: $raccord-size;
			background-color: transparent;
			bottom: 0;
			left: -$raccord-size;
			border-bottom-right-radius: $raccord-radius;
			box-shadow: 0.375rem 0.375rem var(--color-bg);
		}
		&::after {
			content: '';
			position: absolute;
			width: $raccord-size;
			height: $raccord-size;
			background-color: transparent;
			top: -$raccord-size;
			right: 0;
			border-bottom-right-radius: $raccord-radius;
			box-shadow: 0.375rem 0.375rem var(--color-bg);
		}
		&.visible {
			transform: scale(1);
			transition: transform 1.3s cubic-bezier(0.23, 0.99, 0.14, 1);
		}
	}

	.box-button {
		position: absolute;
		right: 0;
		bottom: 0;
		height: $btn-size;
		width: $btn-size;
		z-index: 3;

		.button-search {
			display: flex;
			justify-content: center;
			align-items: center;
			transform-origin: bottom right;
			width: 100%;
			height: 100%;
			background-color: var(--color-primary);
			border-radius: $btn-radius;
			cursor: pointer;
			transform: scale(0);
			transition:
				transform 0.6s ease-out,
				opacity 0.6s ease-out;
			&.visible {
				transform: scale(1);
				transition:
					transform 1.3s cubic-bezier(0.23, 0.99, 0.14, 1),
					opacity 0.4s ease;
			}
		}
	}

	// ── Projects container & sections ─────────────────────────
	.projects-container {
		flex: 1;
		margin-top: 48px;
		padding: 0 clamp(24px, 6vw, 120px);
		overflow-y: auto;
		display: flex;
		flex-direction: column;
		gap: 0;
	}

	// En-tête de section (style popup)
	.section-header-main {
		display: flex;
		align-items: center;
		gap: 16px;
		margin-bottom: 24px;

		&.upcoming-header {
			margin-top: 52px;
		}
	}

	.section-title-main {
		font-size: 0.72rem;
		font-weight: 200;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: rgba(255, 255, 255, 0.4);
		white-space: nowrap;
		flex-shrink: 0;
	}

	.section-line-main {
		flex: 1;
		height: 1px;
		background: rgba(255, 255, 255, 0.08);
	}

	.projects-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 20px;
		padding-bottom: 8px;

		@media (max-width: 1200px) {
			grid-template-columns: repeat(3, 1fr);
		}
		@media (max-width: 860px) {
			grid-template-columns: repeat(2, 1fr);
		}
		@media (max-width: 560px) {
			grid-template-columns: 1fr;
		}
	}

	.no-results {
		text-align: center;
		color: var(--color-text);
		opacity: 0.3;
		font-size: 0.85rem;
		padding: 24px 0;
	}

	// ── Keyframes ─────────────────────────────────────────────
	@keyframes expandBar {
		from {
			width: 0;
		}
		to {
			width: clamp(150px, 100%, 850px);
		}
	}
	@keyframes fadeInContent {
		from {
			opacity: 0;
			transform: translateY(12px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
	@keyframes revealTitle {
		from {
			opacity: 0.25;
			filter: blur(6px);
			transform: translateY(12px);
		}
		to {
			opacity: 1;
			filter: blur(0px);
			transform: translateY(0);
		}
	}
	@keyframes tagIn {
		from {
			opacity: 0;
			transform: scale(0.8) translateX(-6px);
		}
		to {
			opacity: 1;
			transform: scale(1) translateX(0);
		}
	}
</style>
