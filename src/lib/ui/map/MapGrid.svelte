<script>
	import TERRAIN from '$lib/content/terrain/registry.js';
	import { buildIsoTileLayout } from '$lib/game/map/isometric.js';
	import {
		getIsoTileFaces,
		pointsToSvgPath,
		shadeHexColor,
		tintHexColor
	} from '$lib/game/map/isoTileGeometry.js';

	/**
	 * @type {{
	 *   map: import('$lib/game/map/types.js').GeneratedMap,
	 *   scenarioRotation?: import('$lib/game/map/types.js').TileRotation,
	 *   viewScale?: number,
	 *   showBattleOutline?: boolean,
	 *   interactive?: boolean,
	 *   selectedTile?: import('$lib/game/map/types.js').MapCoord | null,
	 *   onTileSelect?: (tile: import('$lib/game/map/types.js').MapTile) => void
	 * }}
	 */
	let {
		map,
		scenarioRotation = 0,
		viewScale = 1,
		showBattleOutline = true,
		interactive = false,
		selectedTile = null,
		onTileSelect = undefined
	} = $props();

	const layout = $derived(buildIsoTileLayout(map, scenarioRotation));
	const displayWidth = $derived(Math.round(layout.stageWidth * viewScale));
	const displayHeight = $derived(Math.round(layout.stageHeight * viewScale));

	const faces = $derived(
		getIsoTileFaces(layout.tileWidth, layout.tileHeight, layout.extrudeHeight)
	);

	const topPath = $derived(pointsToSvgPath(faces.top));
	const leftPath = $derived(pointsToSvgPath(faces.left));
	const rightPath = $derived(pointsToSvgPath(faces.right));

	/**
	 * @param {string} terrainId
	 */
	function tileColor(terrainId) {
		return TERRAIN[/** @type {keyof typeof TERRAIN} */ (terrainId)]?.color ?? '#333333';
	}

	/**
	 * @param {import('$lib/game/map/types.js').MapTile} tile
	 */
	function isSelected(tile) {
		if (!selectedTile) return false;
		return selectedTile.x === tile.x && selectedTile.y === tile.y;
	}

	/**
	 * @param {import('$lib/game/map/types.js').MapTile} tile
	 */
	function isBattleTile(tile) {
		return (
			tile.x >= map.battleBounds.x &&
			tile.x < map.battleBounds.x + map.battleBounds.width &&
			tile.y >= map.battleBounds.y &&
			tile.y < map.battleBounds.y + map.battleBounds.height
		);
	}

	/**
	 * @param {import('$lib/game/map/types.js').MapTile} tile
	 */
	function handleTileClick(tile) {
		if (!interactive || !onTileSelect) return;
		onTileSelect(tile);
	}

	/**
	 * @param {import('$lib/game/map/isometric.js').IsoTileLayoutEntry} entry
	 */
	function anchorX(entry) {
		return layout.offsetX + entry.screenX;
	}

	/**
	 * @param {import('$lib/game/map/isometric.js').IsoTileLayoutEntry} entry
	 */
	function anchorY(entry) {
		return layout.offsetY + entry.screenY;
	}

	/**
	 * @param {import('$lib/game/map/types.js').MapTile} tile
	 */
	function tileTitle(tile) {
		const name = TERRAIN[tile.terrainId]?.name ?? tile.terrainId;
		return `${name} (${tile.x}, ${tile.y})`;
	}
</script>

<div class="iso-viewport">
	<svg
		class="iso-canvas"
		width={displayWidth}
		height={displayHeight}
		viewBox="0 0 {layout.stageWidth} {layout.stageHeight}"
		role="img"
		aria-label="Isometric map preview"
	>
		{#each layout.entries as entry (entry.tile.x + '-' + entry.tile.y)}
			{@const color = tileColor(entry.tile.terrainId)}
			{@const battle = showBattleOutline && isBattleTile(entry.tile)}
			{@const selected = isSelected(entry.tile)}
			<g
				class="iso-tile"
				class:iso-tile--battle={battle}
				class:iso-tile--selected={selected}
				transform="translate({anchorX(entry)}, {anchorY(entry)})"
			>
				<path
					d={leftPath}
					fill={shadeHexColor(color, 34)}
					stroke="rgba(12, 18, 12, 0.35)"
					stroke-width="0.75"
					vector-effect="non-scaling-stroke"
				/>
				<path
					d={rightPath}
					fill={shadeHexColor(color, 20)}
					stroke="rgba(12, 18, 12, 0.35)"
					stroke-width="0.75"
					vector-effect="non-scaling-stroke"
				/>
				<path
					d={topPath}
					fill={battle ? tintHexColor(color, 8) : color}
					stroke={selected ? 'var(--color-gold)' : 'rgba(255, 255, 255, 0.22)'}
					stroke-width={selected ? 2 : 0.75}
					vector-effect="non-scaling-stroke"
					class="iso-tile__top"
				/>

				{#if interactive}
					<path
						d={topPath}
						fill="transparent"
						stroke="transparent"
						class="iso-tile__hit"
						role="button"
						tabindex="0"
						aria-label={tileTitle(entry.tile)}
						onclick={() => handleTileClick(entry.tile)}
						onkeydown={(event) => {
							if (event.key === 'Enter' || event.key === ' ') {
								event.preventDefault();
								handleTileClick(entry.tile);
							}
						}}
					>
						<title>{tileTitle(entry.tile)}</title>
					</path>
				{/if}
			</g>
		{/each}
	</svg>
</div>

<style>
	.iso-viewport {
		display: flex;
		justify-content: center;
		overflow: auto;
		max-width: 100%;
		padding: 1.25rem;
		border-radius: 0.75rem;
		border: 1px solid var(--color-border);
		background: transparent;
	}

	.iso-canvas {
		display: block;
		flex-shrink: 0;
		image-rendering: pixelated;
		image-rendering: crisp-edges;
	}

	.iso-tile__top {
		transition: filter 120ms ease;
	}

	.iso-tile__hit {
		cursor: pointer;
	}

	.iso-tile:has(.iso-tile__hit:hover) .iso-tile__top {
		filter: brightness(1.1);
	}

	.iso-tile--battle .iso-tile__top {
		filter: saturate(1.05);
	}

	.iso-tile--selected .iso-tile__top {
		filter: brightness(1.12);
	}
</style>
