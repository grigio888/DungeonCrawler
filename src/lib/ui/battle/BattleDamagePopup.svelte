<script>
	import { onMount } from 'svelte';

	/** @type {{ amount: number, critical?: boolean, side?: 'player' | 'opponent' }} */
	let { amount, critical = false, side = 'player' } = $props();

	/** @type {HTMLDivElement | null} */
	let root = $state(null);

	const DURATION_MS = $derived(critical ? 950 : 850);
	const APEX_FRACTION = 0.75;

	/** @typedef {[number, number]} Point */

	/** Cubic-bezier path in px from the spawn point (center). */
	const PATHS = /** @type {const} */ ({
		player: {
			normal: [
				[0, 0],
				[-10, -34],
				[-24, -54],
				[-30, -14]
			],
			critical: [
				[0, 0],
				[-12, -40],
				[-28, -64],
				[-36, -18]
			]
		},
		opponent: {
			normal: [
				[0, 0],
				[10, -34],
				[24, -54],
				[30, -14]
			],
			critical: [
				[0, 0],
				[12, -40],
				[28, -64],
				[36, -18]
			]
		}
	});

	/**
	 * @param {number} t
	 * @param {Point} p0
	 * @param {Point} p1
	 * @param {Point} p2
	 * @param {Point} p3
	 * @returns {Point}
	 */
	function cubicPoint(t, p0, p1, p2, p3) {
		const u = 1 - t;
		const tt = t * t;
		const uu = u * u;
		const uuu = uu * u;
		const ttt = tt * t;

		return [
			uuu * p0[0] + 3 * uu * t * p1[0] + 3 * u * tt * p2[0] + ttt * p3[0],
			uuu * p0[1] + 3 * uu * t * p1[1] + 3 * u * tt * p2[1] + ttt * p3[1]
		];
	}

	/** @param {number} t */
	function opacityAt(t) {
		if (t <= 0.1) return t / 0.1;
		if (t <= 0.62) return 1;
		return Math.max(0, 1 - (t - 0.62) / 0.38);
	}

	/** @param {number} t */
	function scaleAt(t) {
		const start = critical ? 0.62 : 0.78;
		const peak = critical ? 1.06 : 1;
		const end = critical ? 0.94 : 0.92;

		if (t <= APEX_FRACTION) {
			const u = t / APEX_FRACTION;
			return start + (peak - start) * u * (2 - u);
		}

		const u = (t - APEX_FRACTION) / (1 - APEX_FRACTION);
		return peak + (end - peak) * u * u;
	}

	/**
	 * @param {number} spikes
	 * @param {number} outer
	 * @param {number} inner
	 */
	function burstPoints(spikes = 12, outer = 46, inner = 22) {
		const cx = 50;
		const cy = 50;

		return Array.from({ length: spikes * 2 }, (_, index) => {
			const radius = index % 2 === 0 ? outer : inner;
			const angle = (Math.PI / spikes) * index - Math.PI / 2;
			const x = cx + radius * Math.cos(angle);
			const y = cy + radius * Math.sin(angle);
			return `${x},${y}`;
		}).join(' ');
	}

	const burstPolygon = burstPoints();

	/** @type {readonly { x2: number, y2: number }[]} */
	const impactLines = [
		{ x2: 50, y2: 4 },
		{ x2: 88, y2: 18 },
		{ x2: 96, y2: 50 },
		{ x2: 82, y2: 82 },
		{ x2: 50, y2: 96 },
		{ x2: 18, y2: 88 },
		{ x2: 4, y2: 50 },
		{ x2: 12, y2: 16 }
	];

	onMount(() => {
		const node = root;
		if (!node) return;

		const sideKey = side === 'player' ? 'player' : 'opponent';
		const pathKey = critical ? 'critical' : 'normal';
		const [p0, p1, p2, p3] = PATHS[sideKey][pathKey];

		const startedAt = performance.now();
		let frameId = 0;

		/** @param {number} now */
		function tick(now) {
			const elapsed = now - startedAt;
			let t = elapsed / DURATION_MS;

			if (t >= 1) {
				t = 1;
			}

			const [x, y] = cubicPoint(t, p0, p1, p2, p3);
			const scale = scaleAt(t);
			const opacity = opacityAt(t);

			node.style.transform = `translate3d(calc(-50% + ${x}px), calc(-50% + ${y}px), 0) scale(${scale})`;
			node.style.opacity = String(opacity);

			if (t < 1) {
				frameId = requestAnimationFrame(tick);
			}
		}

		frameId = requestAnimationFrame(tick);

		return () => cancelAnimationFrame(frameId);
	});
</script>

<div
	bind:this={root}
	class="damage-popup"
	class:damage-popup--critical={critical}
	role="status"
	aria-live="polite"
>
	{#if critical}
		<svg class="damage-popup__burst" viewBox="0 0 100 100" aria-hidden="true">
			<g class="damage-popup__lines">
				{#each impactLines as line, index (index)}
					<line x1="50" y1="50" x2={line.x2} y2={line.y2} />
				{/each}
			</g>
			<polygon class="damage-popup__shape" points={burstPolygon} />
		</svg>
	{/if}

	<span class="damage-popup__value" class:damage-popup__value--critical={critical}>
		{amount}
	</span>
</div>

<style>
	.damage-popup {
		position: absolute;
		left: 50%;
		top: 50%;
		z-index: 10;
		display: grid;
		place-items: center;
		transform: translate3d(-50%, -50%, 0) scale(0.78);
		transform-origin: center center;
		opacity: 0;
		pointer-events: none;
		backface-visibility: hidden;
		will-change: transform, opacity;
	}

	.damage-popup--critical {
		--burst-size: 7rem;
		width: var(--burst-size);
		height: var(--burst-size);
	}

	.damage-popup__burst {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		overflow: visible;
	}

	.damage-popup__lines line {
		stroke: #fff8e7;
		stroke-width: 2.5;
		stroke-linecap: round;
		opacity: 0.85;
	}

	.damage-popup__shape {
		fill: #c54a32;
		stroke: #000;
		stroke-width: 2.5;
		stroke-linejoin: round;
	}

	.damage-popup__value {
		position: relative;
		z-index: 1;
		font-family: Impact, 'Arial Black', 'Helvetica Neue', sans-serif;
		font-size: 1.25rem;
		font-weight: 900;
		line-height: 1;
		letter-spacing: -0.04em;
		color: #fff;
		white-space: nowrap;
		-webkit-text-stroke: 2px #000;
		paint-order: stroke fill;
		text-shadow:
			2px 2px 0 #000,
			-1px -1px 0 #000;
	}

	.damage-popup__value--critical {
		font-size: 1.85rem;
		color: #ffe566;
		-webkit-text-stroke: 3px #000;
		text-shadow:
			3px 3px 0 #000,
			-1px -1px 0 #000,
			0 0 8px rgb(255 235 120 / 55%);
	}
</style>
