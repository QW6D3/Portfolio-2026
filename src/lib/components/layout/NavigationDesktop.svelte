<script lang="ts">
	import { resolve } from '$app/paths';
	import { navItems } from '$lib/data/navigation';
</script>

<nav>
	<ul>
		{#each navItems as item (item.name)}
			<li><a href={resolve(item.path)}>{item.name}</a></li>
		{/each}
	</ul>
</nav>

<style lang="scss">
	ul {
		display: flex;
		gap: 2rem;
		list-style: none;
		a {
			text-decoration: none;
			color: black;
			font-weight: 300;

			&:hover {
				color: rgb(97, 126, 97);
			}
		}
	}
</style>
