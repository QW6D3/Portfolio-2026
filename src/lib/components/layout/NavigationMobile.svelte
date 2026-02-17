<script lang="ts">
	import { isMenuOpen, toggleMenu } from '$lib/stores/main-store';
	import { resolve } from '$app/paths';
	import { navItems } from '$lib/data/navigation';
	import { X } from 'lucide-svelte';
</script>

<section class:is-open={$isMenuOpen}>
	<div class="menu-wrapper">
		<button class="burger-close" on:click={toggleMenu} aria-label="Close menu">
			<X />
		</button>

		<nav>
			<ul>
				{#each navItems as item, i (item.name)}
					<li style="--index: {i}">
						<a href={resolve(item.path)} on:click={toggleMenu}>
							<span class="text-wrap">{item.name}</span>
						</a>
					</li>
				{/each}
			</ul>
		</nav>

		<footer>
			<p>© — Charlie Charron</p>
		</footer>
	</div>
</section>

<style lang="scss">
	@use '../../../styles/abstracts/variables' as *;

	section {
		position: fixed;
		inset: 0;
		z-index: 1;
		visibility: hidden;
		transition: visibility 0.4s;
		contain: content;
		transform: translateZ(0);

		// Configuration du gradient animé (Mode Clair)
		background: linear-gradient(
			45deg,
			$color-primary-light,
			$color-secondary-light,
			$color-bg-light
		);
		background-size: 200% 200%;
		animation: gradient-animation 8s ease infinite;

		// Configuration du gradient animé (Mode Sombre)
		@media (prefers-color-scheme: dark) {
			background: linear-gradient(
				45deg,
				$color-primary-dark,
				$color-secondary-dark,
				$color-bg-dark
			);
			background-size: 200% 200%;
		}

		&::before {
			content: '';
			position: absolute;
			inset: 0;
			background: linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 0%, transparent 100%);
			pointer-events: none;
		}

		&.is-open {
			visibility: visible;
		}
	}

	// L'animation transposée
	@keyframes gradient-animation {
		0% {
			background-position: 0% 50%;
		}
		50% {
			background-position: 100% 50%;
		}
		100% {
			background-position: 0% 50%;
		}
	}

	.menu-wrapper {
		box-sizing: border-box;
		width: 60%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding: calc(#{$page-padding} * 1.5);
		position: relative;
	}

	.burger-close {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 44px;
		height: 44px;
		background: var(--color-bg);
		color: var(--color-secondary);
		border: none;
		border-radius: 12px;
		cursor: pointer;
		transition:
			transform 0.3s var(--ease-out-expo),
			background-color 0.3s ease;

		&:active {
			transform: scale(0.92);
		}
	}

	nav {
		flex-grow: 1;
		display: flex;
		margin-top: 3rem;
		align-items: start;

		ul {
			list-style: none;
			padding: 0 0 0 5px;
			margin: 0;
			display: flex;
			flex-direction: column;
			gap: 2rem;
		}
	}

	li {
		overflow: hidden;

		a {
			display: flex;
			align-items: center;
			width: 100%;
			gap: 1.25rem;
			padding-left: 0.25rem;
			text-decoration: none;
			color: var(--color-bg);
			font-family: var(--font-title);
			font-size: var(--font-size-md);
			font-weight: 900;
			letter-spacing: 0em;
			text-transform: uppercase;

			will-change: transform;
			transform: translateY(110%);
			transition: transform var(--transition-speed) var(--ease-out-expo);
		}
	}

	footer {
		opacity: 0;
		transition: opacity 0.6s ease;

		p {
			font-family: var(--font-sans);
			font-size: var(--font-size-xxs);
			color: var(--color-text);
			opacity: 0.6;
			margin: 0;
		}
	}

	.is-open a {
		transform: translateY(0);
		transition-delay: calc(var(--index) * 0.08s + 0.35s);
	}

	.is-open footer {
		opacity: 1;
		transition-delay: 0.8s;
	}
</style>
