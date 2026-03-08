<script lang="ts">
	import { onMount } from 'svelte';

	export let sizing: 'fill' | 'stretch' = 'fill';
	export let color: string = 'rgba(128, 128, 128, 1)';
	export let animation: { scale: number; speed: number } | undefined = undefined;
	export let noise: { opacity: number; scale: number } | undefined = undefined;
	export let className: string = '';

	let feColorMatrixRef: SVGFEColorMatrixElement;
	const id = `shadowoverlay-${Math.random().toString(36).substr(2, 9)}`;

	// On crée des valeurs dérivées sécurisées
	$: animScale = animation?.scale ?? 0;
	$: animSpeed = animation?.speed ?? 0;
	$: animationEnabled = animScale > 0;

	function mapRange(
		value: number,
		fromLow: number,
		fromHigh: number,
		toLow: number,
		toHigh: number
	): number {
		if (fromLow === fromHigh) return toLow;
		return toLow + ((value - fromLow) / (fromHigh - fromLow)) * (toHigh - toLow);
	}

	$: displacementScale = animationEnabled ? mapRange(animScale, 1, 100, 20, 100) : 0;

	$: animationDuration = animationEnabled ? mapRange(animSpeed, 1, 100, 1000, 50) : 1;

	onMount(() => {
		let frame: number;
		let startTime = Date.now();

		function update() {
			if (animationEnabled && feColorMatrixRef) {
				const elapsed = Date.now() - startTime;
				const duration = animationDuration * 40;
				const hueValue = ((elapsed / duration) * 360) % 360;
				feColorMatrixRef.setAttribute('values', hueValue.toString());
			}
			frame = requestAnimationFrame(update);
		}

		frame = requestAnimationFrame(update);
		return () => cancelAnimationFrame(frame);
	});
</script>

<div
	class="shadow-container {className}"
	style:overflow="hidden"
	style:position="relative"
	style:width="100%"
	style:height="100%"
>
	<div
		class="overlay-wrapper"
		style:position="absolute"
		style:inset="-{displacementScale}px"
		style:filter={animationEnabled ? `url(#${id}) blur(4px)` : 'none'}
	>
		{#if animationEnabled}
			<svg style:position="absolute" width="0" height="0">
				<defs>
					<filter {id}>
						<feTurbulence
							result="undulation"
							numOctaves="2"
							baseFrequency="{mapRange(animScale, 0, 100, 0.001, 0.0005)},{mapRange(
								animScale,
								0,
								100,
								0.004,
								0.002
							)}"
							seed="0"
							type="turbulence"
						/>
						<feColorMatrix
							bind:this={feColorMatrixRef}
							in="undulation"
							type="hueRotate"
							values="180"
						/>
						<feColorMatrix
							in="dist"
							result="circulation"
							type="matrix"
							values="4 0 0 0 1  4 0 0 0 1  4 0 0 0 1  1 0 0 0 0"
						/>
						<feDisplacementMap
							in="SourceGraphic"
							in2="circulation"
							scale={displacementScale}
							result="dist"
						/>
						<feDisplacementMap
							in="dist"
							in2="undulation"
							scale={displacementScale}
							result="output"
						/>
					</filter>
				</defs>
			</svg>
		{/if}

		<div
			class="shadow-mask"
			style:background-color={color}
			style:mask-image="url('https://framerusercontent.com/images/ceBGguIpUU8luwByxuQz79t7To.png')"
			style:mask-size={sizing === 'stretch' ? '100% 100%' : 'cover'}
			style:mask-repeat="no-repeat"
			style:mask-position="center"
			style:width="100%"
			style:height="100%"
		></div>
	</div>

	{#if noise && noise.opacity > 0}
		<div
			class="noise-layer"
			style:position="absolute"
			style:inset="0"
			style:background-image="url('https://framerusercontent.com/images/g0QcWrxr87K0ufOxIUFBakwYA8.png')"
			style:background-size="{(noise?.scale ?? 1) * 200}px"
			style:background-repeat="repeat"
			style:opacity={(noise?.opacity ?? 0) / 2}
		></div>
	{/if}
</div>

<style lang="scss">
	.content-overlay {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		text-align: center;
		z-index: 10;
		width: 100%;
	}

	.noise-layer {
		pointer-events: none;
	}

	// Pour assurer le support de mask sur certains navigateurs
	.shadow-mask {
		-webkit-mask-image: url('https://framerusercontent.com/images/ceBGguIpUU8luwByxuQz79t7To.png');
		-webkit-mask-size: cover;
		-webkit-mask-repeat: no-repeat;
		-webkit-mask-position: center;
	}
</style>
