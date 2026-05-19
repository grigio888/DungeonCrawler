<script>
	import TERRAIN from '$lib/content/terrain/registry.js';
	import { FACING_ORDER } from '$lib/core/constants/sprites.js';
	import {
		BATTLE_GRID_SIZE,
		DEFAULT_MAP_VIEW_SCALE,
		MAP_SIZE,
		MAP_VIEW_SCALE_MAX,
		MAP_VIEW_SCALE_MIN,
		TILE_SIZE_PX,
		createMapSeed,
		generateMap,
		getScenarioFacingLabel,
		withScenarioRotation
	} from '$lib/game/map';
	import MapGrid from '$lib/ui/map/MapGrid.svelte';
	import ButtonRetangular from '$lib/ui/window/ButtonRetangular.svelte';
	import Window from '$lib/ui/window/Window.svelte';

	let seedInput = $state('42');
	let map = $state(generateMap({ seed: createMapSeed(42) }));
	/** @type {import('$lib/game/map/types.js').MapCoord | null} */
	let selectedTile = $state(null);
	let viewScale = $state(DEFAULT_MAP_VIEW_SCALE);

	const scenarioRotation = $derived(map.scenarioRotation ?? 0);

	const selectedMapTile = $derived.by(() => {
		if (!selectedTile) return null;
		return map.tiles[selectedTile.y]?.[selectedTile.x] ?? null;
	});

	const viewScaleLabel = $derived(`${Math.round(viewScale * 100)}%`);

	const viewScaleOptions = [1, 1.5, 2, 2.5, 3];

	const cameraOptions = $derived(
		FACING_ORDER.map((facing, rotation) => ({
			rotation: /** @type {import('$lib/game/map/types.js').TileRotation} */ (rotation),
			label: facing.toUpperCase()
		}))
	);

	/** @param {number} scale */
	function setViewScale(scale) {
		viewScale = Math.max(MAP_VIEW_SCALE_MIN, Math.min(MAP_VIEW_SCALE_MAX, scale));
	}

	/** @param {string} terrainId */
	function countTerrainTiles(terrainId) {
		let count = 0;
		for (const row of map.tiles) {
			for (const tile of row) {
				if (tile.terrainId === terrainId) count += 1;
			}
		}
		return count;
	}

	function regenerateMap() {
		const parsed = Number(seedInput);
		const seed = Number.isFinite(parsed) ? createMapSeed(parsed) : createMapSeed(Date.now());
		map = generateMap({ seed });
		selectedTile = null;
	}

	function randomizeSeed() {
		seedInput = String(createMapSeed(Date.now()));
		regenerateMap();
	}

	/** @param {import('$lib/game/map/types.js').MapTile} tile */
	function onTileSelect(tile) {
		selectedTile = { x: tile.x, y: tile.y };
	}

	/** @param {import('$lib/game/map/types.js').TileRotation} rotation */
	function setScenarioRotation(rotation) {
		map = withScenarioRotation(map, rotation);
	}
</script>

<svelte:head>
	<title>Map debug</title>
</svelte:head>

<main>
	<div class="mx-auto max-w-5xl px-4 py-8">
		<header class="mb-8 border-b border-border pb-6">
			<p class="text-sm font-medium tracking-wide text-title-mid uppercase">Debug</p>
			<h1 class="mt-1 text-3xl font-semibold tracking-tight text-frame-dark">Map generation</h1>
			<p class="mt-2 text-text-muted">
				Isometric 3D view with {TILE_SIZE_PX}px-wide tiles. The center holds a {BATTLE_GRID_SIZE}×{BATTLE_GRID_SIZE}
				battle grid. Rotate the camera around the scenario, or click a tile to inspect it.
			</p>
		</header>

		<Window title="Generator" class="m-0 mb-6 w-full max-w-none min-w-0">
			<div class="flex flex-wrap items-end gap-4">
				<label class="block min-w-[12rem] flex-1 text-sm">
					<span class="mb-1.5 block text-xs tracking-wide text-text-subtle uppercase">Seed</span>
					<input
						type="text"
						bind:value={seedInput}
						class="w-full rounded-lg border border-border-strong bg-white px-3 py-2 font-mono text-frame-dark focus:border-title-mid focus:outline-none"
					/>
				</label>

				<ButtonRetangular label="Generate" onclick={regenerateMap} />
				<ButtonRetangular label="Random seed" onclick={randomizeSeed} />
			</div>

			<dl class="mt-4 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
				<div>
					<dt class="text-xs tracking-wide text-text-subtle uppercase">Map size</dt>
					<dd class="font-mono text-frame-dark">{MAP_SIZE} × {MAP_SIZE} tiles</dd>
				</div>
				<div>
					<dt class="text-xs tracking-wide text-text-subtle uppercase">Tile width</dt>
					<dd class="font-mono text-frame-dark">{TILE_SIZE_PX}px (2:1 isometric)</dd>
				</div>
				<div>
					<dt class="text-xs tracking-wide text-text-subtle uppercase">Camera facing</dt>
					<dd class="font-mono text-frame-dark">{getScenarioFacingLabel(scenarioRotation)}</dd>
				</div>
				<div>
					<dt class="text-xs tracking-wide text-text-subtle uppercase">Battle tiles</dt>
					<dd class="font-mono text-frame-dark">
						{map.battleBounds.width} × {map.battleBounds.height}
					</dd>
				</div>
			</dl>
		</Window>

		<Window title="Preview" class="m-0 mb-6 w-full max-w-none min-w-0">
			<div class="mb-4 flex flex-wrap items-center justify-between gap-3">
				<p class="text-sm text-text-muted">
					Camera facing:
					<span class="font-mono text-frame-dark">{getScenarioFacingLabel(scenarioRotation)}</span>
					· View zoom:
					<span class="font-mono text-frame-dark">{viewScaleLabel}</span>
				</p>
				<div class="flex flex-wrap gap-2">
					{#each cameraOptions as option (option.rotation)}
						<ButtonRetangular
							label={option.label}
							onclick={() => setScenarioRotation(option.rotation)}
						/>
					{/each}
				</div>
			</div>
			<div class="mb-4 flex flex-wrap gap-2">
				{#each viewScaleOptions as scale (scale)}
					<ButtonRetangular
						label="{Math.round(scale * 100)}%"
						onclick={() => setViewScale(scale)}
					/>
				{/each}
			</div>
			<MapGrid
				{map}
				{scenarioRotation}
				{viewScale}
				interactive
				selectedTile={selectedTile}
				onTileSelect={onTileSelect}
			/>
		</Window>

		<Window title="Selected tile" class="m-0 mb-6 w-full max-w-none min-w-0">
			{#if !selectedMapTile}
				<p class="text-sm text-text-subtle">Click a tile on the map to inspect it.</p>
			{:else}
				<dl class="grid gap-3 text-sm sm:grid-cols-2">
					<div>
						<dt class="text-xs tracking-wide text-text-subtle uppercase">Position</dt>
						<dd class="font-mono text-frame-dark">
							({selectedMapTile.x}, {selectedMapTile.y})
						</dd>
					</div>
					<div>
						<dt class="text-xs tracking-wide text-text-subtle uppercase">Terrain</dt>
						<dd class="text-frame-dark">
							{TERRAIN[selectedMapTile.terrainId]?.name ?? selectedMapTile.terrainId}
						</dd>
					</div>
				</dl>
			{/if}
		</Window>

		<div class="grid gap-6 lg:grid-cols-2">
			<Window title="Terrain legend" class="m-0 w-full max-w-none min-w-0">
				<ul class="space-y-2 text-sm">
					{#each Object.values(TERRAIN) as terrain (terrain.id)}
						<li class="flex items-center gap-3">
							<span
								class="inline-block h-8 w-8 rounded border border-border-strong"
								style:background-color={terrain.color}
							></span>
							<div>
								<p class="font-medium text-frame-dark">{terrain.name}</p>
								<p class="text-xs text-text-subtle">{terrain.role} · {terrain.id}</p>
							</div>
							<span class="ml-auto font-mono text-xs text-text-muted">
								{countTerrainTiles(terrain.id)} tiles
							</span>
						</li>
					{/each}
				</ul>
			</Window>

			<Window title="Tracks" class="m-0 w-full max-w-none min-w-0">
				{#if map.tracks.length === 0}
					<p class="text-sm text-text-subtle">No tracks generated.</p>
				{:else}
					<ol class="space-y-3 text-sm">
						{#each map.tracks as track, index (index)}
							<li class="rounded-lg border border-border bg-surface-inset p-3">
								<p class="font-medium text-frame-dark">Track {index + 1}</p>
								<p class="mt-1 font-mono text-xs text-text-muted">
									Entry ({track.entry.x}, {track.entry.y}) · {track.path.length} tiles
								</p>
							</li>
						{/each}
					</ol>
				{/if}
			</Window>
		</div>
	</div>
</main>
