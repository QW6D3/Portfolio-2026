<script lang="ts">
	import { isMenuOpen, toggleMenu } from '$lib/stores/main-store';
	import { resolve } from '$app/paths';
	import { navItems } from '$lib/data/navigation';
</script>

<section>
	<button on:click={toggleMenu}> Close </button>
	<nav class:is-open={$isMenuOpen}>
		<ul>
			{#each navItems as item (item.name)}
				<li><a href={resolve(item.path)} on:click={toggleMenu}>{item.name}</a></li>
			{/each}
		</ul>
	</nav>
</section>

<style lang="scss">
	section {
		display: flex;
		flex-direction: column;
		position: fixed;
		top: 0;
		height: 100vh;
		width: 100%;
		z-index: 1;
		background-color: rgb(97, 126, 97);
		button {
			height: 50px;
			width: 50px;
		}
		nav {
			display: flex;
			height: 100%;
			width: 45.4%;
			ul {
				display: flex;
				padding: 0;
				margin: 0;
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
						transition: 0.5s cubic-bezier(0, 0.92, 0.71, 0.87) 0.25s;
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
