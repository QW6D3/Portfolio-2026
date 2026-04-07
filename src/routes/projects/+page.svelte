<script lang="ts">
	import Header from '$lib/components/layout/Header.svelte';
	import ProjectCard from '$lib/components/layout/ProjectCard.svelte';
	import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-svelte';
	import { projects, upcomingProjects } from '$lib/data/projects';
	import type { Project } from '$lib/data/projects';
	import { tick } from 'svelte';

	let pendingSearch = '';
	let inputSearchBar = '';

	let filterOpen = false;
	let filterPopupEl: HTMLDivElement;
	let filterBtnEl: HTMLButtonElement;
	let popupHeight = 0;
	let popupContentEl: HTMLDivElement;

	let mobileFilterHeight = 0;
	let mobileFilterContentEl: HTMLDivElement;

	type FilterTag = { category: string; value: string; id: string };
	let activeFilters: FilterTag[] = [];
	let removingIds: Set<string> = new Set();

	const years = ['2025', '2024', '2023'];
	const filterOptions: Record<string, string[]> = {
		Type: ['Web App', 'Mobile', 'API', 'Open Source', 'CLI', 'Design System'],
		Langages: ['TypeScript', 'JavaScript', 'Python', 'Rust', 'Go', 'Swift'],
		Stack: ['SvelteKit', 'React', 'Next.js', 'Node.js', 'PostgreSQL', 'Docker']
	};

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

	async function updatePopupHeight() {
		if (!filterOpen || !popupContentEl) return;
		await tick();
		const newH = popupContentEl.scrollHeight;
		if (Math.abs(newH - popupHeight) > 1) {
			popupHeight = newH;
		}
	}

	// Correction : Utilisation de 'void' pour satisfaire no-unused-expressions
	// tout en déclenchant la réactivité Svelte sur ces variables.
	$: {
		void activeFilters;
		void comboStates;
		if (filterOpen) updatePopupHeight();
	}

	$: comboFiltered = Object.fromEntries(
		Object.entries(filterOptions).map(([cat, opts]) => [
			cat,
			opts.filter((o) => o.toLowerCase().includes((comboStates[cat]?.search ?? '').toLowerCase()))
		])
	);

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

	async function toggleMobileFilter() {
		if (mobileFilterHeight === 0) {
			await tick();
			mobileFilterHeight = mobileFilterContentEl?.scrollHeight ?? 0;
		} else {
			mobileFilterHeight = 0;
		}
	}

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

	function addFilter(category: string, value: string) {
		if (activeFilters.some((f) => f.category === category && f.value === value)) return;
		activeFilters = [
			...activeFilters,
			{ category, value, id: `${category}-${value}-${Date.now()}` }
		];
		tick().then(() => {
			if (popupContentEl) updatePopupHeight();
			if (mobileFilterContentEl && mobileFilterHeight > 0)
				mobileFilterHeight = mobileFilterContentEl.scrollHeight;
		});
	}

	async function removeFilter(id: string) {
		removingIds = new Set([...removingIds, id]);
		await new Promise((r) => setTimeout(r, 310));
		activeFilters = activeFilters.filter((f) => f.id !== id);
		removingIds = new Set([...removingIds].filter((x) => x !== id));
	}

	function triggerSearch() {
		inputSearchBar = pendingSearch;
	}

	function handleSearchKey(e: KeyboardEvent) {
		if (e.key === 'Enter') triggerSearch();
	}

	function applyFilters(list: Project[]): Project[] {
		return list.filter((p: Project) => {
			const matchSearch =
				inputSearchBar.trim() === '' ||
				p.title.toLowerCase().includes(inputSearchBar.toLowerCase()) ||
				p.tags.some((t) => t.toLowerCase().includes(inputSearchBar.toLowerCase()));

			const filtersByCategory: Record<string, string[]> = {};
			for (const f of activeFilters) {
				if (!filtersByCategory[f.category]) filtersByCategory[f.category] = [];
				filtersByCategory[f.category].push(f.value);
			}

			const matchFilters = Object.entries(filtersByCategory).every(([cat, vals]) => {
				if (cat === 'Année') return vals.some((v) => p.year?.toString() === v);
				if (cat === 'Type') return vals.some((v) => p.type === v);
				if (cat === 'Langages') return vals.some((v) => p.tags?.includes(v));
				if (cat === 'Stack') return vals.some((v) => p.tags?.includes(v));
				return true;
			});

			return matchSearch && matchFilters;
		});
	}

	$: filteredProjects = (() => {
		void inputSearchBar;
		void activeFilters;
		return applyFilters(projects);
	})();

	$: filteredUpcoming = (() => {
		void inputSearchBar;
		void activeFilters;
		return applyFilters(upcomingProjects);
	})();

	let visibleIds = new Set<string>();
	let enteringIds = new Set<string>();
	let exitingIds = new Set<string>();

	$: {
		const allFiltered = [...filteredProjects, ...filteredUpcoming];
		const newIds = new Set(allFiltered.map((p) => p.id));
		const entering = [...newIds].filter((id) => !visibleIds.has(id));
		const exiting = [...visibleIds].filter((id) => !newIds.has(id));
		enteringIds = new Set(entering);
		exitingIds = new Set(exiting);
		visibleIds = newIds;
	}

	const MAX_TAGS = 3;
</script>

<svelte:window on:click={handleOutsideClick} />

<main class="project-page">
	<Header />

	<div class="page-container">
		<div class="projects-container">
			<div class="section-header-main finalize-header">
				<span class="section-title-main">Projets finalisés</span>
				<span class="section-line-main"></span>
			</div>

			{#if filteredProjects.length === 0}
				<p class="no-results">Aucun projet trouvé.</p>
			{:else}
				<div class="projects-grid">
					{#each filteredProjects as project (project.id)}
						<div
							class="card-wrapper finalize-card"
							class:card-entering={enteringIds.has(project.id)}
							class:card-exiting={exitingIds.has(project.id)}
						>
							<ProjectCard {project} maxTags={MAX_TAGS} />
						</div>
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
						<div
							class="card-wrapper upcoming-card"
							class:card-entering={enteringIds.has(project.id)}
							class:card-exiting={exitingIds.has(project.id)}
						>
							<ProjectCard {project} maxTags={MAX_TAGS} />
						</div>
					{/each}
				</div>
			{/if}
		</div>
	</div>

	<div class="desktop-search-wrapper">
		<div class="research-container">
			<h1 class="search-title">Découvrez mes projets</h1>

			<div class="project-searchBar">
				<div class="upper-part">
					<input
						type="text"
						class="input-search"
						bind:value={pendingSearch}
						on:keydown={handleSearchKey}
						placeholder="Rechercher un projet ou un tag…"
					/>
				</div>

				<div class="lower-part">
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
							<span class="separator" aria-hidden="true">|</span>
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
							style="height:{popupHeight}px;"
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

				<div class="button-tag" class:visible={pendingSearch.length > 0}></div>
				<div class="box-button">
					<button
						class="button-search"
						class:visible={pendingSearch.length > 0}
						on:click={triggerSearch}
						aria-label="Rechercher"
					>
						<Search color="#ffffff" size={18} />
					</button>
				</div>
			</div>
		</div>
	</div>

	<div class="mobile-search-wrapper">
		<div class="mobile-search-bar">
			<div class="mobile-top-row">
				<button
					class="mobile-filter-btn"
					on:click={toggleMobileFilter}
					aria-label="Filtres"
					class:active={mobileFilterHeight > 0}
				>
					<SlidersHorizontal
						size={18}
						strokeWidth={1.5}
						color={mobileFilterHeight > 0 ? 'var(--color-primary)' : 'rgba(255,255,255,0.6)'}
					/>
				</button>
				<input
					type="text"
					class="mobile-input"
					bind:value={pendingSearch}
					on:keydown={handleSearchKey}
					placeholder="Rechercher…"
				/>
				<button class="mobile-search-submit" on:click={triggerSearch} aria-label="Rechercher">
					<Search size={16} color="rgba(255,255,255,0.4)" />
				</button>
			</div>

			<div class="mobile-filter-panel" style="height:{mobileFilterHeight}px;">
				<div class="mobile-filter-content" bind:this={mobileFilterContentEl}>
					{#if activeFilters.length > 0}
						<div class="mobile-active-tags">
							{#each activeFilters as f (f.id)}
								<span class="filter-tag" class:removing={removingIds.has(f.id)}>
									<span class="tag-label">{f.category}:{f.value}</span>
									<button class="tag-remove" on:click={() => removeFilter(f.id)}>
										<X size={11} strokeWidth={2.5} />
									</button>
								</span>
							{/each}
						</div>
					{/if}
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
	$mobile-bar-h: 72px;

	.project-page {
		position: relative;
		min-height: 100dvh;
	}

	.page-container {
		padding-top: clamp(220px, 28vh, 320px);
		padding-bottom: 25px;
		box-sizing: border-box;

		@media (max-width: 767px) {
			position: relative;
			padding-top: 80px;
		}
	}

	.desktop-search-wrapper {
		position: fixed;
		top: 15%;
		left: 0;
		right: 0;
		z-index: 100;
		display: flex;
		justify-content: center;
		padding: 24px 24px 0;
		pointer-events: none;

		@media (max-width: 767px) {
			display: none;
		}
	}

	.research-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 20px;
		pointer-events: auto;
		width: 100%;
		max-width: 850px;
	}

	.search-title {
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
		width: 1ch;
		text-align: center;
		line-height: 1;
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
		justify-content: flex-start;
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
			border: none;
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

	.mobile-search-wrapper {
		display: none;

		@media (max-width: 767px) {
			display: flex;
			flex-direction: column;
			position: sticky;
			bottom: 0;
			left: 0;
			right: 0;
			z-index: 200;
			padding: 0 16px 20px;
			background: linear-gradient(to top, var(--color-bg) 60%, transparent);
			padding-top: 24px;
		}
	}

	.mobile-search-bar {
		display: flex;
		position: absolute;
		width: 100%;
		bottom: 0;
		left: 50%;
		transform: translate(-50%);
		flex-direction: column;
		background: var(--color-text);
		border-radius: 16px;
		overflow: hidden;
	}

	.mobile-top-row {
		display: flex;
		gap: 10px;
		padding: 14px 16px;
		width: 100%;
	}

	.mobile-filter-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		background: transparent;
		border: none;
		cursor: pointer;
		padding: 0;
		flex-shrink: 0;
		transition: transform 0.3s $ease-out-expo;

		&.active {
			transform: rotate(90deg);
		}
	}

	.mobile-input {
		width: 100%;
		background: transparent;
		border: none;
		outline: none;
		color: var(--color-bg);
		font-size: 0.95rem;
		&::placeholder {
			color: var(--color-bg);
			opacity: 0.4;
		}
	}

	.mobile-search-submit {
		display: flex;
		align-items: center;
		justify-content: center;
		background: transparent;
		border: none;
		cursor: pointer;
		padding: 0;
		flex-shrink: 0;
	}

	.mobile-filter-panel {
		overflow: hidden;
		transition: height $dur $ease-out-expo;
		width: 100%;
	}

	.mobile-filter-content {
		display: flex;
		flex-direction: column;
		gap: 16px;
		padding: 0 16px 16px;
	}

	.mobile-active-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
	}

	.projects-container {
		padding: 0 clamp(16px, 6vw, 120px);
		display: flex;
		flex-direction: column;

		@media (max-width: 767px) {
			padding: 0 16px;
		}
	}

	.section-header-main {
		display: flex;
		align-items: center;
		gap: 16px;
		margin-bottom: 24px;
		&.finalize-header {
			animation: fadeInContent 1.5s $ease-out-expo both;
			animation-delay: 0.5s !important;
		}
		&.upcoming-header {
			animation: fadeInContent 1.5s $ease-out-expo both;
			animation-delay: 1s !important;
			margin-top: 52px;
		}
	}

	.section-title-main {
		font-size: 0.72rem;
		font-weight: 200;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--color-text);
		white-space: nowrap;
		flex-shrink: 0;
	}

	.section-line-main {
		flex: 1;
		height: 1px;
		background: rgba(102, 102, 102, 0.5);
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

	.card-wrapper {
		animation: cardEnter 0.55s $ease-out-expo both;

		@for $i from 1 through 16 {
			&:nth-child(#{$i}) {
				animation-delay: #{1.6 + ($i - 1) * 0.06}s;
			}
		}
	}

	.card-entering {
		animation: cardEnter 1.5s $ease-out-expo both;
		animation-delay: 0.9s !important;
	}

	.card-exiting {
		animation: cardExit 0.3s $ease-out-expo both;
		pointer-events: none;
	}

	.no-results {
		text-align: center;
		color: var(--color-text);
		opacity: 0.3;
		font-size: 0.85rem;
		padding: 24px 0;
	}

	@keyframes cardEnter {
		from {
			opacity: 0;
			transform: translateY(28px) scale(0.97);
		}
		to {
			opacity: 1;
			transform: translateY(0) scale(1);
		}
	}

	@keyframes cardExit {
		from {
			opacity: 1;
			transform: translateY(0) scale(1);
		}
		to {
			opacity: 0;
			transform: translateY(-12px) scale(0.96);
		}
	}

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
