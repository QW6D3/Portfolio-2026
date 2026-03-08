<script lang="ts">
	import type { Project } from '$lib/data/projects';
	import { ArrowUpRight } from 'lucide-svelte';
	import Grainient from './../ui/Grainient.svelte';
	import { hexToRgb } from '$lib/utilities/color';
	import { resolve } from '$app/paths';

	export let project: Project;
	export let maxTags: number = 99;

	$: timeOffset = project.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) * 0.37;
	$: baseColor = project.colors || '#5227FF';
	$: displayedTags = project.tags.slice(0, maxTags);
	$: hiddenCount = project.tags.length - displayedTags.length;

	function darken(hex: string, amount: number): string {
		const [r, g, b] = hexToRgb(hex);
		const factor = 1 - amount;
		const toHex = (n: number) =>
			Math.round(n * factor * 255)
				.toString(16)
				.padStart(2, '0');
		return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
	}
</script>

<a
	class="project-card"
	href={resolve(`/projects/${project.id}`)}
	style="
        view-transition-name: project-{project.id};
        --project-font: {project.font || 'inherit'};
        --project-color: {baseColor};
    "
	aria-label="Voir le projet {project.title}"
>
	<div class="card-bg-container">
		<Grainient
			{timeOffset}
			color1={darken(baseColor, 0.7)}
			color2={darken(baseColor, 0.5)}
			color3={darken(baseColor, 0.8)}
			timeSpeed={1.5}
			warpStrength={1.2}
			warpFrequency={4.5}
			warpSpeed={1.8}
			warpAmplitude={55.0}
			grainAmount={0.08}
			grainScale={2.5}
			contrast={1.4}
			saturation={0.95}
			zoom={0.9}
			blendAngle={-15.0}
			rotationAmount={420.0}
		/>

		{#if project.backgroundImage}
			<div class="image-overlay" style:background-image="url({project.backgroundImage})"></div>
		{/if}
	</div>

	<div class="card-center-content">
		{#if project.logo}
			<img src={project.logo} alt="" class="project-logo" />
			<span class="sr-only">{project.title}</span>
		{:else}
			<span class="text-logo">{project.title}</span>
		{/if}
	</div>

	<div class="card-tags" aria-hidden="true">
		{#each displayedTags as tag (tag)}
			<span class="tag">{tag}</span>
		{/each}
		{#if hiddenCount > 0}
			<span class="tag tag-more">+{hiddenCount}</span>
		{/if}
	</div>

	<div class="btn-tag" aria-hidden="true"></div>
	<div class="box-button" aria-hidden="true">
		<div class="button-arrow" style:background-color={baseColor}>
			<ArrowUpRight size={20} strokeWidth={2.5} />
		</div>
	</div>
</a>

<style lang="scss">
	$raccord-size: 2rem;
	$raccord-radius: 16px;
	$btn-size: 44px;
	$btn-radius: 9px;
	$ease: 400ms cubic-bezier(0.23, 1, 0.32, 1);

	.project-card {
		position: relative;
		display: block;
		width: 100%;
		aspect-ratio: 16 / 10;
		border-radius: 24px;
		text-decoration: none;
		background-color: #000;
		transition: transform 0.4s ease;

		@media (hover: hover) {
			&:hover {
				transform: scale(0.98);
				.card-tags {
					opacity: 1;
					transform: translateY(0);
					transition:
						opacity 0.1s ease,
						transform 0.4s ease;
				}
			}
		}
	}

	.card-bg-container {
		position: absolute;
		inset: 0;
		z-index: 1;
		transition: transform 0.8s ease;
		border-radius: 24px;
		overflow: hidden;
	}

	.image-overlay {
		position: absolute;
		inset: 0;
		z-index: 2;
		background-size: cover;
		background-position: center;
		opacity: 0.3;
		mix-blend-mode: soft-light;
		pointer-events: none;
	}

	.card-center-content {
		position: absolute;
		inset: 0;
		display: flex;
		justify-content: center;
		align-items: stretch;
		height: 100%;
		z-index: 5;
		padding: 2.5rem;
		pointer-events: none;

		.project-logo {
			display: flex;
			align-items: center;
			object-fit: contain;
			height: 100%;
			max-width: 50%;
		}

		.text-logo {
			font-family: var(--project-font);
			font-size: 2.2rem;
			font-weight: 800;
			color: white;
			text-align: center;
			text-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
		}
	}

	.card-tags {
		position: absolute;
		bottom: 20px;
		left: 20px;
		z-index: 6;
		display: flex;
		gap: 8px;
		opacity: 0;
		transform: translateY(15px);
		transition:
			opacity 0.4s ease,
			transform 0.4s ease;
	}

	.tag {
		font-size: 0.75rem;
		font-weight: 500;
		color: rgba(255, 255, 255, 0.9);
		background: rgba(255, 255, 255, 0.1);
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 10px;
		padding: 6px 12px;
	}

	.tag-more {
		opacity: 0.6;
	}

	.btn-tag {
		position: absolute;
		bottom: -2px;
		right: -2px;
		width: calc($btn-size + 16px);
		height: calc($btn-size + 16px);
		background-color: var(--color-bg, #000);
		border-radius: 20px 0 0 0;
		z-index: 6;

		&::before,
		&::after {
			content: '';
			position: absolute;
			width: $raccord-size;
			height: $raccord-size;
			border-bottom-right-radius: $raccord-radius;
			box-shadow: 8px 8px var(--color-bg, #000);
		}
		&::before {
			bottom: 0;
			left: -$raccord-size;
		}
		&::after {
			top: -$raccord-size;
			right: 0;
		}
	}

	.box-button {
		position: absolute;
		right: 0;
		bottom: 0;
		width: $btn-size;
		height: $btn-size;
		z-index: 7;

		.button-arrow {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 100%;
			height: 100%;
			border-radius: $btn-radius;
			color: #fff;
			transition: filter 0.3s ease;
			&:hover {
				filter: brightness(1.2);
			}
		}
	}

	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		border: 0;
	}
</style>
