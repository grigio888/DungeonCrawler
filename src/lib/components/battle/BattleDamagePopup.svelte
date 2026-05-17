<script>
	/** @type {{ amount: number, critical?: boolean, side?: 'player' | 'opponent' }} */
	let { amount, critical = false, side = 'player' } = $props();

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
</script>

<div
	class="damage-popup"
	class:damage-popup--critical={critical}
	class:damage-popup--arc-left={side === 'player'}
	class:damage-popup--arc-right={side === 'opponent'}
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
		transform: translate(-50%, -50%);
		transform-origin: center bottom;
		pointer-events: none;
		will-change: transform, opacity;
	}

	.damage-popup--arc-left {
		animation: damage-popup-arc-left 0.5s ease-out forwards;
	}

	.damage-popup--arc-right {
		animation: damage-popup-arc-right 0.5s ease-out forwards;
	}

	.damage-popup--critical {
		--burst-size: 7rem;
		width: var(--burst-size);
		height: var(--burst-size);
	}

	.damage-popup--critical.damage-popup--arc-left {
		animation-name: damage-popup-arc-left-critical;
	}

	.damage-popup--critical.damage-popup--arc-right {
		animation-name: damage-popup-arc-right-critical;
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

	/* Arc: spawns at center, rises while drifting outward, then fades. */
	@keyframes damage-popup-arc-left {
		0% {
			opacity: 0;
			transform: translate(-50%, -50%) scale(0.65);
		}

		14% {
			opacity: 1;
			transform: translate(calc(-50% - 0.2rem), calc(-50% - 0.9rem)) scale(1.06);
		}

		45% {
			opacity: 1;
			transform: translate(calc(-50% - 1.1rem), calc(-50% - 2.4rem)) scale(1);
		}

		100% {
			opacity: 0;
			transform: translate(calc(-50% - 2rem), calc(-50% - 4rem)) scale(0.9);
		}
	}

	@keyframes damage-popup-arc-right {
		0% {
			opacity: 0;
			transform: translate(-50%, -50%) scale(0.65);
		}

		14% {
			opacity: 1;
			transform: translate(calc(-50% + 0.2rem), calc(-50% - 0.9rem)) scale(1.06);
		}

		45% {
			opacity: 1;
			transform: translate(calc(-50% + 1.1rem), calc(-50% - 2.4rem)) scale(1);
		}

		100% {
			opacity: 0;
			transform: translate(calc(-50% + 2rem), calc(-50% - 4rem)) scale(0.9);
		}
	}

	@keyframes damage-popup-arc-left-critical {
		0% {
			opacity: 0;
			transform: translate(-50%, -50%) scale(0.5);
		}

		12% {
			opacity: 1;
			transform: translate(calc(-50% - 0.25rem), calc(-50% - 1rem)) scale(1.12);
		}

		42% {
			opacity: 1;
			transform: translate(calc(-50% - 1.35rem), calc(-50% - 2.75rem)) scale(1.04);
		}

		100% {
			opacity: 0;
			transform: translate(calc(-50% - 2.35rem), calc(-50% - 4.5rem)) scale(0.92);
		}
	}

	@keyframes damage-popup-arc-right-critical {
		0% {
			opacity: 0;
			transform: translate(-50%, -50%) scale(0.5);
		}

		12% {
			opacity: 1;
			transform: translate(calc(-50% + 0.25rem), calc(-50% - 1rem)) scale(1.12);
		}

		42% {
			opacity: 1;
			transform: translate(calc(-50% + 1.35rem), calc(-50% - 2.75rem)) scale(1.04);
		}

		100% {
			opacity: 0;
			transform: translate(calc(-50% + 2.35rem), calc(-50% - 4.5rem)) scale(0.92);
		}
	}
</style>
