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
							<span class="icon-wrap">
								<svelte:component this={item.icon} />
							</span>
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
		background-color: $bg-menu;
		visibility: hidden;
		transition: visibility 0.4s;

		&.is-open {
			visibility: visible;
		}
	}

	.menu-wrapper {
		width: 60%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding: calc(#{$page-padding} * 1.5);
	}

	.burger-close {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 44px;
		height: 44px;
		background: var(--color-white-soft);
		color: var(--color-white);
		border: none;
		border-radius: 12px;
		cursor: pointer;
		transition: all 0.3s var(--ease-out-expo);

		&:active {
			transform: scale(0.92);
			background-color: var(--color-white-hover);
		}
	}

	nav {
		flex-grow: 1;
		display: flex;
		margin-top: 3rem;
		align-items: start; // Centers menu vertically between button and footer

		ul {
			list-style: none;
			padding: 0 0 0 5px;
			margin: 0;
			display: flex;
			flex-direction: column;
			gap: 2rem;

			li {
				overflow: hidden;

				a {
					display: flex;
					align-items: center;
					gap: 1.25rem;
					text-decoration: none;
					color: var(--color-white);
					font-family: var(--font-title);
					font-size: var(--font-size-md);
					font-weight: 500;
					letter-spacing: 0.05em;
					text-transform: uppercase;

					/* Animation setup */
					transform: translateY(110%);
					transition: transform var(--transition-speed) var(--ease-out-expo);

					.icon-wrap {
						display: flex;
						opacity: var(--icon-opacity);
						transition: opacity 0.3s ease;
					}

					&:hover .icon-wrap {
						opacity: 1;
					}
				}
			}
		}
	}

	footer {
		opacity: 0;
		transition: opacity 0.6s ease;

		p {
			font-family: var(--font-sans);
			font-size: var(--font-size-xs);
			color: var(--color-white);
			opacity: 0.4;
			margin: 0;
		}
	}

	/* States when menu is active */
	.is-open {
		nav ul li a {
			transform: translateY(0);
			transition-delay: calc(var(--index) * 0.08s + 0.35s);
		}

		footer {
			opacity: 1;
			transition-delay: 0.8s;
		}
	}
</style>
