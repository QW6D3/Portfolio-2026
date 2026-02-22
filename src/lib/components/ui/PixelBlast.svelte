<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import * as THREE from 'three';
	import { EffectComposer, RenderPass } from 'postprocessing';

	// --- Types personnalisés ---
	interface PixelTouchPoint {
		x: number;
		y: number;
		age: number;
	}

	interface PixelTouchTexture {
		texture: THREE.Texture;
		update: () => void;
		addTouch: (pos: { x: number; y: number }) => void;
	}

	// --- Props ---
	export let variant: 'square' | 'circle' | 'triangle' | 'diamond' = 'square';
	export let pixelSize = 3;
	export let color = '#B19EEF';
	export let patternScale = 2;
	export let patternDensity = 1;
	export let liquid = false;
	export let liquidRadius = 1;
	export let pixelSizeJitter = 0;
	export let enableRipples = true;
	export let rippleIntensityScale = 1;
	export let rippleThickness = 0.1;
	export let rippleSpeed = 0.3;
	export let speed = 0.5;
	export let edgeFade = 0.5;
	export let noiseAmount = 0;

	// --- Constantes ---
	const SHAPE_MAP = { square: 0, circle: 1, triangle: 2, diamond: 3 };
	const MAX_CLICKS = 10;
	const randomSeed = Math.random() * 10000;

	let container: HTMLDivElement;
	let canvas: HTMLCanvasElement; // Ajout pour le bind
	let renderer: THREE.WebGLRenderer;
	let scene: THREE.Scene;
	let camera: THREE.OrthographicCamera;
	let material: THREE.ShaderMaterial;
	let composer: EffectComposer;
	let clock: THREE.Clock;
	let rafId: number;
	let touch: PixelTouchTexture | undefined;
	let clickIx = 0;

	const VERTEX_SRC = `void main() { gl_Position = vec4(position, 1.0); }`;
	const FRAGMENT_SRC = `
    precision highp float;
    uniform vec3 uColor; uniform vec2 uResolution; uniform float uTime;
    uniform float uPixelSize; uniform float uScale; uniform float uDensity;
    uniform float uPixelJitter; uniform int uEnableRipples;
    uniform float uRippleSpeed; uniform float uRippleThickness;
    uniform float uRippleIntensity; uniform float uEdgeFade;
    uniform int uShapeType;
    uniform vec2 uClickPos[${MAX_CLICKS}];
    uniform float uClickTimes[${MAX_CLICKS}];
    out vec4 fragColor;

    float Bayer2(vec2 a) { a = floor(a); return fract(a.x / 2. + a.y * a.y * .75); }
    #define Bayer8(a) (Bayer2(.5*(.5*(a)))*0.0625 + Bayer2(.5*(a))*0.25 + Bayer2(a))

    float hash11(float n){ return fract(sin(n)*43758.5453); }
    float vnoise(vec3 p){
      vec3 ip = floor(p); vec3 fp = fract(p);
      float n000 = hash11(dot(ip + vec3(0,0,0), vec3(1,57,113)));
      float n100 = hash11(dot(ip + vec3(1,0,0), vec3(1,57,113)));
      float n010 = hash11(dot(ip + vec3(0,1,0), vec3(1,57,113)));
      float n110 = hash11(dot(ip + vec3(1,1,0), vec3(1,57,113)));
      float n001 = hash11(dot(ip + vec3(0,0,1), vec3(1,57,113)));
      float n101 = hash11(dot(ip + vec3(1,0,1), vec3(1,57,113)));
      float n011 = hash11(dot(ip + vec3(0,1,1), vec3(1,57,113)));
      float n111 = hash11(dot(ip + vec3(1,1,1), vec3(1,57,113)));
      vec3 w = fp*fp*fp*(fp*(fp*6.0-15.0)+10.0);
      return mix(mix(mix(n000, n100, w.x), mix(n010, n110, w.x), w.y), mix(mix(n001, n101, w.x), mix(n011, n111, w.x), w.y), w.z) * 2.0 - 1.0;
    }

    float fbm2(vec2 uv, float t){
      vec3 p = vec3(uv * uScale, t); float amp = 1.0; float freq = 1.0; float sum = 1.0;
      for (int i = 0; i < 5; ++i){ sum += amp * vnoise(p * freq); freq *= 1.25; amp *= 1.0; }
      return sum * 0.5 + 0.5;
    }

    void main(){
      vec2 fragCoord = gl_FragCoord.xy - uResolution * .5;
      float aspectRatio = uResolution.x / uResolution.y;
      vec2 uv = (floor(fragCoord / (8.0 * uPixelSize)) * (8.0 * uPixelSize)) / uResolution * vec2(aspectRatio, 1.0);
      float feed = (fbm2(uv, uTime * 0.05) * 0.5 - 0.65) + (uDensity - 0.5) * 0.3;

      if (uEnableRipples == 1) {
        for (int i = 0; i < ${MAX_CLICKS}; ++i){
          if (uClickPos[i].x < 0.0) continue;
          vec2 cuv = (((uClickPos[i] - uResolution*.5 - (4.0*uPixelSize)) / uResolution)) * vec2(aspectRatio, 1.0);
          float t = max(uTime - uClickTimes[i], 0.0);
          float r = distance(uv, cuv);
          float ring = exp(-pow((r - uRippleSpeed * t) / uRippleThickness, 2.0));
          feed = max(feed, ring * exp(-t) * exp(-10.0 * r) * uRippleIntensity);
        }
      }

      float bw = step(0.5, feed + Bayer8(gl_FragCoord.xy / uPixelSize) - 0.5);
      float M = bw;
      
      if (uEdgeFade > 0.0) {
        vec2 norm = gl_FragCoord.xy / uResolution;
        M *= smoothstep(0.0, uEdgeFade, min(min(norm.x, norm.y), min(1.0 - norm.x, 1.0 - norm.y)));
      }

      fragColor = vec4(uColor, M);
    }
  `;

	const createTouchTexture = (): PixelTouchTexture => {
		const size = 64;
		const canvasT = document.createElement('canvas');
		canvasT.width = canvasT.height = size;
		const ctx = canvasT.getContext('2d')!;
		const texture = new THREE.Texture(canvasT);
		const trail: PixelTouchPoint[] = [];
		return {
			texture,
			update: () => {
				ctx.fillStyle = 'black';
				ctx.fillRect(0, 0, size, size);
				for (let i = trail.length - 1; i >= 0; i--) {
					const p = trail[i];
					p.age++;
					if (p.age > 64) {
						trail.splice(i, 1);
						continue;
					}
					const intensity = 1.0 - p.age / 64;
					ctx.fillStyle = `rgba(255, 255, 255, ${intensity * 0.2})`;
					ctx.beginPath();
					ctx.arc(p.x * size, (1 - p.y) * size, liquidRadius * 5, 0, Math.PI * 2);
					ctx.fill();
				}
				texture.needsUpdate = true;
			},
			addTouch: (pos: { x: number; y: number }) => trail.push({ ...pos, age: 0 })
		};
	};

	onMount(() => {
		// Utilisation du canvas bindé pour éviter les erreurs de manipulation DOM
		renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

		scene = new THREE.Scene();
		camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
		clock = new THREE.Clock();

		const uniforms = {
			uResolution: { value: new THREE.Vector2() },
			uTime: { value: 0 },
			uColor: { value: new THREE.Color(color) },
			uClickPos: { value: Array.from({ length: MAX_CLICKS }, () => new THREE.Vector2(-1, -1)) },
			uClickTimes: { value: new Float32Array(MAX_CLICKS) },
			uShapeType: { value: SHAPE_MAP[variant] },
			uPixelSize: { value: pixelSize },
			uScale: { value: patternScale },
			uDensity: { value: patternDensity },
			uPixelJitter: { value: pixelSizeJitter },
			uEnableRipples: { value: enableRipples ? 1 : 0 },
			uRippleSpeed: { value: rippleSpeed },
			uRippleThickness: { value: rippleThickness },
			uRippleIntensity: { value: rippleIntensityScale },
			uEdgeFade: { value: edgeFade }
		};

		material = new THREE.ShaderMaterial({
			vertexShader: VERTEX_SRC,
			fragmentShader: FRAGMENT_SRC,
			uniforms,
			transparent: true,
			glslVersion: THREE.GLSL3
		});

		const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
		scene.add(quad);

		if (liquid || noiseAmount > 0) {
			composer = new EffectComposer(renderer);
			composer.addPass(new RenderPass(scene, camera));
			if (liquid) touch = createTouchTexture();
		}

		const resize = () => {
			if (!container) return;
			const { clientWidth: w, clientHeight: h } = container;
			renderer.setSize(w, h, false); // false pour ne pas casser le CSS
			material.uniforms.uResolution.value.set(
				w * renderer.getPixelRatio(),
				h * renderer.getPixelRatio()
			);
		};

		window.addEventListener('resize', resize);
		resize();

		const animate = () => {
			rafId = requestAnimationFrame(animate);
			const t = (clock.getElapsedTime() + randomSeed) * speed;
			material.uniforms.uTime.value = t;
			if (touch) touch.update();
			if (composer) composer.render();
			else renderer.render(scene, camera);
		};
		animate();

		canvas.onpointerdown = (e) => {
			const rect = canvas.getBoundingClientRect();
			const x = (e.clientX - rect.left) * renderer.getPixelRatio();
			const y = (rect.height - (e.clientY - rect.top)) * renderer.getPixelRatio();
			material.uniforms.uClickPos.value[clickIx].set(x, y);
			material.uniforms.uClickTimes.value[clickIx] = material.uniforms.uTime.value;
			clickIx = (clickIx + 1) % MAX_CLICKS;
		};
	});

	onDestroy(() => {
		if (typeof window !== 'undefined') window.removeEventListener('resize', () => {});
		if (rafId) cancelAnimationFrame(rafId);
		if (renderer) renderer.dispose();
		if (material) material.dispose();
	});

	$: if (material) {
		material.uniforms.uColor.value.set(color);
		material.uniforms.uPixelSize.value = pixelSize;
		material.uniforms.uDensity.value = patternDensity;
	}
</script>

<div bind:this={container} class="pixel-blast-wrapper">
	<canvas bind:this={canvas}></canvas>
</div>

<style>
	.pixel-blast-wrapper {
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
		z-index: -1;
		overflow: hidden;
	}
	canvas {
		display: block;
		width: 100%;
		height: 100%;
	}
</style>
