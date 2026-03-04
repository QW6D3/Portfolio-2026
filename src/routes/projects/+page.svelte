<script>
	import Header from '$lib/components/layout/Header.svelte';
	import { Search, SlidersHorizontal } from 'lucide-svelte';
	//import ProjectCard from '$lib/components/ui/projectCard.svelte'
	//import { projects } from '$lib/data/projects.ts'

	let inputSearchBar = '';
</script>

<main class="project-page">
	<Header />
	<div class="project-container">
		<div class="research-container">
			<h1>Découvrez mes projets</h1>
			<div class="project-searchBar">
				<div class="upper-part">
					<input
						type="text"
						class="input-search"
						bind:value={inputSearchBar}
						placeholder="Search Here"
					/>
				</div>
				<div class="lower-part desktop-only">
					<SlidersHorizontal color="#ffffff" strokeWidth={1.5} />
				</div>
				<div class="box-button">
					<div class="button-search" class:visible={inputSearchBar.length > 0}>
						<Search color="#ffffff" />
					</div>
				</div>
				<div class="button-tag" class:visible={inputSearchBar.length > 0}></div>
				<div class="mobile-filter mobile-only"></div>
				<div class=""></div>
			</div>
		</div>
	</div>
</main>

<style lang="scss">
	$raccord-size: 1.125rem;
	$raccord-radius: 20px;
	$btn-size: 50px;
	$btn-radius: 9px;

	.project-container {
		position: relative;
		height: calc(100dvh - 88px * 2);

		.project-searchBar {
			position: absolute;
			display: flex;
			flex-direction: column;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			height: auto;
			padding: 22px;
			border-radius: 20px;

			background-color: var(--color-text);
			animation: expandBar 0.8s ease forwards;

			.upper-part {
				display: flex;
				justify-content: space-between;
				animation: fadeInContent 0.4s ease forwards;
				animation-delay: 1.3s;
				opacity: 0;
				margin-bottom: 24px;

				.input-search {
					margin-left: 8px;
					background-color: transparent;
					border: none;
					outline: none;
					color: var(--color-bg);
				}
			}

			.lower-part {
				opacity: 0;
				animation: fadeInContent 0.4s ease forwards;
				animation-delay: 1s;
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

				// Raccord GAUCHE : inner radius horizontal
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
</style>
