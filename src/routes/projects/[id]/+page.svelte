<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { ArrowLeft } from 'lucide-svelte';
	import { resolve } from '$app/paths';
	export let data;
	$: ({ project } = data);

	let mounted = false;

	onMount(() => {
		const main = document.querySelector('.main-contents') as HTMLElement;
		if (main) main.style.setProperty('padding', '0', 'important');
		document.body.classList.add('project-page-active');
		setTimeout(() => (mounted = true), 50);

		return () => {
			if (main) main.style.removeProperty('padding');
			document.body.classList.remove('project-page-active');
		};
	});

	onDestroy(() => {
		const main = document.querySelector('main');
		if (main) main.style.padding = '';
		document.body.classList.remove('project-page-active');
	});
</script>

<svelte:head>
	<title>{project.title} | Portfolio</title>
</svelte:head>

<header class="hero" style="--c: {project.colors};">
	<div class="hero-noise"></div>
	<div class="hero-glow"></div>

	<a href={resolve('/projects')} class="back-btn">
		<ArrowLeft size={18} strokeWidth={1.8} />
	</a>

	<div class="hero-inner" class:visible={mounted}>
		<div class="hero-eyebrow">
			<span class="eyebrow-pill">{project.type}</span>
			<span class="eyebrow-pill ghost">{project.year}</span>
		</div>

		{#if project.logo}
			<div class="hero-logo-wrap">
				{#if project.logo.endsWith('.svg')}
					<img src={project.logo} alt="" class="project-logo" />
					<span class="sr-only">{project.title}</span>
				{:else}
					<img src={project.logo} alt={project.title} class="project-logo" />
				{/if}
			</div>
		{/if}

		<h1 class="hero-title">{project.title}</h1>
		<p class="hero-context">{project.context || 'Projet personnel'}</p>

		<div class="hero-tags">
			{#each project.tags.slice(0, 5) as tag (tag)}
				<span class="hero-tag">{tag}</span>
			{/each}
		</div>

		<div class="hero-cta">
			{#if project.url}
				<a href={project.url} target="_blank" rel="noopener noreferrer" class="cta-primary">
					Explorer
					<svg width="13" height="13" viewBox="0 0 14 14" fill="none">
						<path
							d="M2 7h10M7 2l5 5-5 5"
							stroke="currentColor"
							stroke-width="1.8"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
				</a>
			{/if}
			{#if project.github}
				<a href={project.github} target="_blank" rel="noopener noreferrer" class="cta-ghost">
					<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
						<path
							d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
						/>
					</svg>
					GitHub
				</a>
			{/if}
		</div>
	</div>

	<div class="hero-scroll-hint">
		<span>Scroll</span>
		<div class="scroll-line"></div>
	</div>
</header>

<main class="page-body" style="--c: {project.colors};">
	<section class="section-lead">
		<div class="section-label">
			<span class="label-dot"></span>
			<span class="label-text">Le Projet</span>
		</div>
		<p class="lead-text">{project.description}</p>
		{#if project.fullDescription}
			<p class="full-text">{project.fullDescription}</p>
		{/if}
	</section>

	<div class="content-grid">
		<div class="main-col">
			{#if project.features}
				<section class="section-block">
					<div class="section-label">
						<span class="label-dot"></span>
						<span class="label-text">Fonctionnalités</span>
					</div>
					<div class="features-list">
						{#each project.features as feature, i (feature)}
							<div class="feature-row" style="animation-delay: {i * 0.08}s">
								<span class="feature-num">{String(i + 1).padStart(2, '0')}</span>
								<p>{feature}</p>
							</div>
						{/each}
					</div>
				</section>
			{/if}

			{#if project.challenges}
				<section class="section-block">
					<div class="section-label">
						<span class="label-dot"></span>
						<span class="label-text">Défis & Solutions</span>
					</div>
					<div class="challenges-wrap">
						{#each project.challenges as challenge (challenge)}
							<div class="challenge-card">
								<span class="challenge-bullet"></span>
								<p>{challenge}</p>
							</div>
						{/each}
					</div>
				</section>
			{/if}
		</div>

		<aside class="sidebar">
			<div class="sidebar-sticky">
				<div class="sidebar-card">
					<h3 class="sidebar-title">Stack technique</h3>
					<div class="stack-grid">
						{#each project.tags as tag (tag)}
							<span class="stack-badge">{tag}</span>
						{/each}
					</div>
				</div>

				{#if project.role}
					<div class="sidebar-card">
						<h3 class="sidebar-title">Mon rôle</h3>
						<p class="role-text">{project.role}</p>
					</div>
				{/if}

				<div class="sidebar-card info-card">
					<div class="info-row">
						<span class="info-label">Année</span>
						<span class="info-value">{project.year}</span>
					</div>
					<div class="info-divider"></div>
					<div class="info-row">
						<span class="info-label">Type</span>
						<span class="info-value">{project.type}</span>
					</div>
					{#if project.context}
						<div class="info-divider"></div>
						<div class="info-row">
							<span class="info-label">Contexte</span>
							<span class="info-value">{project.context}</span>
						</div>
					{/if}
				</div>

				<div class="sidebar-actions">
					{#if project.url}
						<a href={project.url} target="_blank" rel="noopener noreferrer" class="btn-explore">
							Explorer le projet
							<svg width="13" height="13" viewBox="0 0 14 14" fill="none">
								<path
									d="M2 7h10M7 2l5 5-5 5"
									stroke="currentColor"
									stroke-width="1.8"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
							</svg>
						</a>
					{/if}
					{#if project.github}
						<a href={project.github} target="_blank" rel="noopener noreferrer" class="btn-github">
							<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
								<path
									d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
								/>
							</svg>
							Code source
						</a>
					{/if}
				</div>
			</div>
		</aside>
	</div>
</main>

<style>
	/* ── BACK BUTTON ────────────────────────- */
	.back-btn {
		position: absolute;
		top: 28px;
		left: clamp(24px, 8vw, 120px);
		z-index: 10;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		border-radius: 100px;
		background: rgba(255, 255, 255, 0.08);
		border: 1px solid rgba(255, 255, 255, 0.12);
		color: rgba(255, 255, 255, 0.6);
		text-decoration: none;
		transition:
			background 0.2s,
			color 0.2s,
			transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
	}

	.back-btn:hover {
		background: rgba(255, 255, 255, 0.14);
		color: #fff;
		transform: translateX(-3px);
	}

	/* ── HERO ─────────────────────────────── */
	.hero {
		position: relative;
		min-height: 100svh;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: flex-start;
		background: var(--color-text, #1a1a1b);
		overflow: hidden;
		padding: clamp(80px, 12vw, 140px) clamp(24px, 8vw, 120px) clamp(60px, 8vw, 100px);
	}

	.hero-noise {
		position: absolute;
		inset: 0;
		background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
		opacity: 0.5;
		pointer-events: none;
	}

	.hero-glow {
		position: absolute;
		top: -15%;
		right: -5%;
		width: 55vw;
		height: 55vw;
		background: radial-gradient(ellipse at center, var(--c) 0%, transparent 65%);
		opacity: 0.15;
		pointer-events: none;
		filter: blur(48px);
	}

	.hero-inner {
		position: relative;
		z-index: 2;
		max-width: 680px;
		opacity: 0;
		transform: translateY(20px);
		transition:
			opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1),
			transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
	}

	.hero-inner.visible {
		opacity: 1;
		transform: translateY(0);
	}

	.hero-eyebrow {
		display: flex;
		align-items: center;
		gap: 8px;
		margin-bottom: 28px;
	}

	.eyebrow-pill {
		font-size: 0.7rem;
		font-weight: 500;
		letter-spacing: 0.15em;
		text-transform: uppercase;
		padding: 5px 14px;
		border-radius: 100px;
		background: var(--c);
		color: #fff;
	}

	.eyebrow-pill.ghost {
		background: transparent;
		border: 1px solid rgba(255, 255, 255, 0.15);
		color: rgba(255, 255, 255, 0.4);
	}

	.hero-logo-wrap {
		margin-bottom: 22px;
	}

	.project-logo {
		max-height: 52px;
		width: auto;
		opacity: 0.9;
	}

	.sr-only {
		display: none;
	}

	.hero-title {
		font-size: clamp(3.2rem, 8vw, 6.5rem);
		font-weight: 900;
		line-height: 0.95;
		color: #fff;
		margin: 0 0 18px;
		letter-spacing: -0.02em;
	}

	.hero-context {
		font-size: 1rem;
		font-weight: 300;
		color: rgba(255, 255, 255, 0.38);
		margin: 0 0 28px;
	}

	.hero-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 7px;
		margin-bottom: 36px;
	}

	.hero-tag {
		font-size: 0.72rem;
		font-weight: 400;
		letter-spacing: 0.06em;
		padding: 5px 14px;
		border: 1px solid rgba(255, 255, 255, 0.12);
		border-radius: 100px;
		color: rgba(255, 255, 255, 0.45);
		background: rgba(255, 255, 255, 0.04);
	}

	.hero-cta {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.cta-primary {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		padding: 12px 22px;
		background: var(--c);
		color: #fff;
		font-size: 0.85rem;
		font-weight: 500;
		text-decoration: none;
		border-radius: 100px;
		transition:
			transform 0.3s cubic-bezier(0.16, 1, 0.3, 1),
			box-shadow 0.3s;
	}

	.cta-primary:hover {
		transform: translateY(-2px);
		box-shadow: 0 10px 28px color-mix(in srgb, var(--c) 40%, transparent);
	}

	.cta-ghost {
		display: inline-flex;
		align-items: center;
		gap: 7px;
		padding: 11px 18px;
		border: 1px solid rgba(255, 255, 255, 0.14);
		border-radius: 100px;
		color: rgba(255, 255, 255, 0.38);
		font-size: 0.82rem;
		text-decoration: none;
		transition:
			color 0.2s,
			border-color 0.2s;
	}

	.cta-ghost:hover {
		color: rgba(255, 255, 255, 0.8);
		border-color: rgba(255, 255, 255, 0.3);
	}

	.hero-scroll-hint {
		position: absolute;
		bottom: 36px;
		left: clamp(24px, 8vw, 120px);
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10px;
		z-index: 2;
	}

	.hero-scroll-hint span {
		font-size: 0.6rem;
		letter-spacing: 0.22em;
		text-transform: uppercase;
		color: rgba(255, 255, 255, 0.2);
		writing-mode: vertical-rl;
	}

	.scroll-line {
		width: 1px;
		height: 44px;
		background: linear-gradient(to bottom, rgba(255, 255, 255, 0.18), transparent);
		animation: scrollPulse 2.2s ease-in-out infinite;
	}

	@keyframes scrollPulse {
		0%,
		100% {
			opacity: 0.3;
			transform: scaleY(0.6);
		}
		50% {
			opacity: 1;
			transform: scaleY(1);
		}
	}

	/* ── PAGE BODY ────────────────────────── */
	.page-body {
		background: var(--color-bg, #f5f2ed);
		padding: clamp(56px, 8vw, 110px) clamp(24px, 8vw, 120px);
	}

	/* ── SECTION LABEL ────────────────────── */
	.section-label {
		display: flex;
		align-items: center;
		gap: 10px;
		margin-bottom: 28px;
	}

	.label-dot {
		width: 8px;
		height: 8px;
		border-radius: 100px;
		background: var(--c);
		flex-shrink: 0;
	}

	.label-text {
		font-size: 0.68rem;
		font-weight: 500;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: var(--color-text, #1a1a1b);
		opacity: 0.35;
	}

	/* ── LEAD ─────────────────────────────── */
	.section-lead {
		max-width: 720px;
		margin-bottom: 72px;
	}

	.lead-text {
		font-size: clamp(1.2rem, 2.2vw, 1.65rem);
		font-weight: 400;
		line-height: 1.6;
		color: var(--color-text, #1a1a1b);
		margin: 0 0 20px;
	}

	.full-text {
		font-size: 0.97rem;
		font-weight: 300;
		line-height: 1.85;
		color: color-mix(in srgb, var(--color-text, #1a1a1b) 55%, transparent);
		margin: 0;
	}

	/* ── CONTENT GRID ─────────────────────── */
	.content-grid {
		display: grid;
		grid-template-columns: 1.6fr 1fr;
		gap: clamp(32px, 5vw, 90px);
		align-items: start;
	}

	.section-block {
		margin-bottom: 60px;
	}

	/* ── FEATURES ─────────────────────────── */
	.features-list {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.feature-row {
		display: grid;
		grid-template-columns: 40px 1fr;
		gap: 16px;
		align-items: center;
		padding: 14px 16px;
		border-radius: 16px;
		background: color-mix(in srgb, var(--c) 7%, transparent);
		border: 1px solid color-mix(in srgb, var(--c) 14%, transparent);
		opacity: 0;
		animation: fadeUp 0.55s cubic-bezier(0.16, 1, 0.3, 1) both;
	}

	.feature-num {
		font-size: 0.75rem;
		font-weight: 400;
		color: var(--c);
		opacity: 0.8;
	}

	.feature-row p {
		font-size: 0.93rem;
		font-weight: 400;
		line-height: 1.55;
		color: color-mix(in srgb, var(--color-text, #1a1a1b) 70%, transparent);
		margin: 0;
	}

	/* ── CHALLENGES ───────────────────────── */
	.challenges-wrap {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.challenge-card {
		display: flex;
		gap: 14px;
		align-items: flex-start;
		padding: 18px 20px;
		background: color-mix(in srgb, var(--c) 7%, white);
		border: 1px solid color-mix(in srgb, var(--c) 15%, transparent);
		border-radius: 20px;
		box-shadow: 0 2px 12px color-mix(in srgb, var(--c) 8%, transparent);
	}

	.challenge-bullet {
		width: 7px;
		height: 7px;
		min-width: 7px;
		border-radius: 100px;
		background: var(--c);
		margin-top: 5px;
		opacity: 0.9;
	}

	.challenge-card p {
		font-size: 0.9rem;
		line-height: 1.65;
		color: color-mix(in srgb, var(--color-text, #1a1a1b) 65%, transparent);
		margin: 0;
	}

	/* ── SIDEBAR ──────────────────────────── */
	.sidebar-sticky {
		position: sticky;
		top: 24px;
		display: flex;
		flex-direction: column;
		gap: 14px;
	}

	.sidebar-card {
		background: white;
		border-radius: 24px;
		padding: 22px;
		border: 1px solid color-mix(in srgb, var(--color-text, #1a1a1b) 7%, transparent);
		box-shadow: 0 2px 18px color-mix(in srgb, var(--color-text, #1a1a1b) 4%, transparent);
	}

	.sidebar-title {
		font-size: 0.65rem;
		font-weight: 500;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: color-mix(in srgb, var(--color-text, #1a1a1b) 32%, transparent);
		margin: 0 0 14px;
	}

	.stack-grid {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
	}

	.stack-badge {
		font-size: 0.75rem;
		font-weight: 500;
		padding: 5px 13px;
		background: color-mix(in srgb, var(--c) 10%, transparent);
		color: var(--c);
		border-radius: 100px;
		border: 1px solid color-mix(in srgb, var(--c) 20%, transparent);
	}

	.role-text {
		font-size: 0.9rem;
		line-height: 1.6;
		color: color-mix(in srgb, var(--color-text, #1a1a1b) 62%, transparent);
		margin: 0;
	}

	.info-card {
		display: flex;
		flex-direction: column;
	}

	.info-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 3px 0;
	}

	.info-label {
		font-size: 0.74rem;
		color: color-mix(in srgb, var(--color-text, #1a1a1b) 32%, transparent);
	}

	.info-value {
		font-size: 0.78rem;
		font-weight: 500;
		color: color-mix(in srgb, var(--color-text, #1a1a1b) 68%, transparent);
	}

	.info-divider {
		height: 1px;
		background: color-mix(in srgb, var(--color-text, #1a1a1b) 7%, transparent);
		margin: 8px 0;
	}

	.sidebar-actions {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.btn-explore {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		padding: 14px;
		background: var(--c);
		color: #fff;
		font-size: 0.85rem;
		font-weight: 500;
		text-decoration: none;
		border-radius: 100px;
		transition:
			transform 0.3s cubic-bezier(0.16, 1, 0.3, 1),
			box-shadow 0.3s;
	}

	.btn-explore:hover {
		transform: translateY(-2px);
		box-shadow: 0 10px 24px color-mix(in srgb, var(--c) 35%, transparent);
	}

	.btn-github {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		padding: 13px;
		background: transparent;
		color: color-mix(in srgb, var(--color-text, #1a1a1b) 45%, transparent);
		font-size: 0.82rem;
		text-decoration: none;
		border-radius: 100px;
		border: 1px solid color-mix(in srgb, var(--color-text, #1a1a1b) 12%, transparent);
		transition:
			color 0.2s,
			border-color 0.2s;
	}

	.btn-github:hover {
		color: var(--color-text, #1a1a1b);
		border-color: color-mix(in srgb, var(--color-text, #1a1a1b) 28%, transparent);
	}

	/* ── ANIMATIONS ───────────────────────── */
	@keyframes fadeUp {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	/* ── RESPONSIVE ───────────────────────── */
	@media (max-width: 900px) {
		.content-grid {
			grid-template-columns: 1fr;
		}
		.sidebar-sticky {
			position: static;
		}
	}

	@media (max-width: 600px) {
		.hero-title {
			font-size: clamp(2.6rem, 13vw, 3.5rem);
		}
	}
</style>
