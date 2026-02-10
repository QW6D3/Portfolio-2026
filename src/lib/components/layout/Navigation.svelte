<script lang="ts">
	import { isMenuOpen, toggleMenu } from '$lib/stores/main-store';
	import { resolve } from '$app/paths';

	export const navItems = [
		{ name: 'Home', path: '/' },
		{ name: 'About Me', path: '/about-me' },
		{ name: 'Projects', path: '/projects' },
		{ name: 'Contact', path: '/contact' }
	] as const;
</script>

<section>
	<button on:click={toggleMenu}> Close </button>
	<nav class:is-open={$isMenuOpen}>
		<ul>
			{#each navItems as item (item.name)}
				<li><a href={resolve(item.path)}>{item.name}</a></li>
			{/each}
		</ul>
	</nav>
</section>

<style lang="scss">
	section {
		display: flex;
		position: fixed;
		top: 0;
		height: 100vh;
		width: 100%;
		z-index: -1000;
		button {
			height: 50px;
			width: 50px;
		}
		nav {
			display: flex;
			ul {
				display: flex;
				flex-direction: column;
				list-style: none;
				width: 100%;
				justify-content: center;
				li {
					overflow: hidden;
					a {
						display: flex;
						text-decoration: none;
						color: black;
						transform: translateY(100%);
						transition: transform 0.5s cubic-bezier(0, 0.92, 0.71, 0.87);
					}
				}
			}
			&.is-open {
				ul {
					li {
						a {
							transform: translateY(0);
						}
					}
				}
			}
		}
	}
</style>
