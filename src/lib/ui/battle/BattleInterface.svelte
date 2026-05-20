<script>
	import { resolve } from '$app/paths';
	import { SCALES } from '$lib/core/enum/stats.js';
	import {
		Battle,
		isCharacter,
		resolveClassSpriteUrl,
		resolveMonsterSpriteUrl,
		snapshotCombatant
	} from '$lib/game/battle';
	import {
		createMapSeed,
		DEFAULT_MAP_VIEW_SCALE,
		generateMap,
		getBattleCombatantCoords,
		getIsoTileDisplayCenter
	} from '$lib/game/map';
	import {
		getCombatantSpriteAnchor,
		parseAnimationFromCharacterSpriteKey
	} from '$lib/game/presentation/sprites';
	import SkillFactory from '$lib/content/skills/factory';
	import BattleDamagePopup from '$lib/ui/battle/BattleDamagePopup.svelte';
	import BattleSkillBar from '$lib/ui/battle/BattleSkillBar.svelte';
	import MapGrid from '$lib/ui/map/MapGrid.svelte';
	import Window from '$lib/ui/window/Window.svelte';
	import ButtonRetangular from '$lib/ui/window/ButtonRetangular.svelte';

	/** Fixed seed so the battle arena layout is stable between visits. */
	const BATTLE_MAP_SEED = 42;

	/** Player sprite is drawn larger than opponents on the battle map. */
	const BATTLE_PLAYER_ALIVE_SPRITE_SCALE = 1.75;
	const BATTLE_PLAYER_DEAD_SPRITE_SCALE = 1.35;

	/**
	 * @type {{
	 *   player: import('$lib/game/entities/character').BaseCharacter | null,
	 *   opponent: import('$lib/game/battle/types.js').BattleCombatant,
	 *   environment: import('$lib/environments').Environment,
	 *   battle?: Battle,
	 *   createCharacterHref?: string,
	 *   autoOpponentAttackMs?: number
	 * }}
	 */
	let {
		player,
		opponent,
		environment,
		battle: battleProp,
		createCharacterHref = '/debug/roster',
		autoOpponentAttackMs = 0
	} = $props();

	const rosterHref = resolve(createCharacterHref);

	const battle = $derived(
		player ? (battleProp ?? new Battle({ player, opponent, environment })) : null
	);

	const battleMap = $derived(generateMap({ seed: createMapSeed(BATTLE_MAP_SEED) }));
	const combatantCoords = $derived(getBattleCombatantCoords(battleMap));
	const mapViewScale = DEFAULT_MAP_VIEW_SCALE;

	const classSprites = import.meta.glob('$lib/content/classes/**/sprites/*.{png,webp,gif}', {
		eager: true,
		query: '?url',
		import: 'default'
	});

	const monsterSprites = import.meta.glob('$lib/content/monsters/*/sprites/*.{png,webp,gif}', {
		eager: true,
		query: '?url',
		import: 'default'
	});

	const playerView = $derived(battle?.playerSnapshot ?? null);
	const opponentView = $derived(
		battle?.opponentSnapshot ?? snapshotCombatant(opponent, 'opponent')
	);

	/**
	 * @param {import('$lib/game/battle/types.js').CombatantSnapshot} view
	 */
	function mapCombatantSpriteAnchor(view) {
		if (view.spriteKey) {
			return getCombatantSpriteAnchor(parseAnimationFromCharacterSpriteKey(view.spriteKey));
		}

		let animation = 'idle';
		if (!view.isAlive) {
			animation = 'dead';
		}
		return getCombatantSpriteAnchor(animation);
	}

	const playerSpriteUrl = $derived.by(() => {
		if (!playerView?.spriteKey) return null;
		return resolveClassSpriteUrl(
			classSprites,
			playerView.promptPath ?? '',
			playerView.spriteKey,
			player?.gender
		);
	});

	const opponentSpriteUrl = $derived.by(() => {
		if (!opponentView) return null;
		if (opponentView.kind === 'monster') {
			const monsterSprite = opponentView.isAlive ? 'idle' : 'dead';
			return resolveMonsterSpriteUrl(
				monsterSprites,
				opponentView.promptPath ?? '',
				monsterSprite
			);
		}
		if (!opponentView.spriteKey) return null;
		return resolveClassSpriteUrl(
			classSprites,
			opponentView.promptPath ?? '',
			opponentView.spriteKey
		);
	});

	const mapCombatants = $derived.by(() => {
		/** @type {{ coord: import('$lib/game/map/types.js').MapCoord, spriteUrl: string, side: 'player' | 'opponent', spriteAnchor: import('$lib/game/presentation/sprites/characterSprite.js').CombatantSpriteAnchor, spriteScale?: number }[]} */
		const markers = [];

		if (playerSpriteUrl && playerView) {
			markers.push({
				coord: combatantCoords.player,
				spriteUrl: playerSpriteUrl,
				side: 'player',
				spriteAnchor: mapCombatantSpriteAnchor(playerView),
				spriteScale: playerView.isAlive ? BATTLE_PLAYER_ALIVE_SPRITE_SCALE : BATTLE_PLAYER_DEAD_SPRITE_SCALE
			});
		}

		if (opponentSpriteUrl && opponentView) {
			markers.push({
				coord: combatantCoords.opponent,
				spriteUrl: opponentSpriteUrl,
				side: 'opponent',
				spriteAnchor: mapCombatantSpriteAnchor(opponentView)
			});
		}

		return markers;
	});

	const playerTileCenter = $derived(
		getIsoTileDisplayCenter(battleMap, combatantCoords.player, mapViewScale)
	);
	const opponentTileCenter = $derived(
		getIsoTileDisplayCenter(battleMap, combatantCoords.opponent, mapViewScale)
	);

	/**
	 * @param {number} current
	 * @param {number} max
	 */
	function barPercent(current, max) {
		if (max <= 0) return 0;
		return Math.max(0, Math.min(100, (current / max) * 100));
	}

	/**
	 * @param {string} skillId
	 */
	function describeSkill(skillId) {
		try {
			return new SkillFactory(skillId).name;
		} catch {
			return skillId;
		}
	}

	/** @param {import('$lib/game/battle/types.js').BattleActionResult} entry */
	function formatLogEntry(entry) {
		const attacker = entry.attacker === 'player' ? 'Player' : 'Opponent';
		const defender = entry.defender === 'player' ? 'Player' : 'Opponent';
		const skill = describeSkill(entry.skillId ?? '0001_attack');
		const crit = entry.isCritical ? ' · CRIT' : '';
		const ko = entry.defenderDefeated ? ' · KO' : '';

		if (entry.damage <= 0) {
			return `${attacker} — ${skill} (no damage)`;
		}

		return `${attacker} → ${defender}: ${entry.damage} dmg${crit} (${skill})${ko}`;
	}

	const battleLog = $derived(battle?.log ?? []);

	/**
	 * @param {string} skillId
	 */
	function onPlayerSkill(skillId) {
		if (!battle || battle.isOver || battle.turn !== 'player') return;
		battle.playerAttack(skillId);
	}

	function onOpponentTurn() {
		if (!battle || battle.isOver || battle.turn !== 'opponent') return;
		battle.opponentAttack();
	}

	function resetBattle() {
		battle?.reset();
		playerDamagePopup = null;
		opponentDamagePopup = null;
	}

	/** @type {{ amount: number, id: number, critical: boolean } | null} */
	let playerDamagePopup = $state(null);
	/** @type {{ amount: number, id: number, critical: boolean } | null} */
	let opponentDamagePopup = $state(null);

	$effect(() => {
		const activeBattle = battle;
		if (!activeBattle) {
			playerDamagePopup = null;
			opponentDamagePopup = null;
			return;
		}

		const action = activeBattle.lastAction;
		const revision = activeBattle.revision;

		if (!action || action.damage <= 0) return;

		const entry = { amount: action.damage, id: revision, critical: action.isCritical };

		if (action.defender === 'player') {
			playerDamagePopup = entry;
		} else {
			opponentDamagePopup = entry;
		}
	});

	$effect(() => {
		const activeBattle = battle;
		const delayMs = autoOpponentAttackMs;

		if (!activeBattle || delayMs <= 0) return;

		const turn = activeBattle.turn;
		const over = activeBattle.isOver;
		activeBattle.revision;

		if (over || turn !== 'opponent') return;

		const timerId = setTimeout(() => {
			onOpponentTurn();
		}, delayMs);

		return () => clearTimeout(timerId);
	});
</script>

{#snippet vitalsBars(view, hpBarClass, spBarClass)}
	<div class="space-y-2 text-sm">
		<div>
			<div class="mb-1 flex justify-between text-xs text-text-muted">
				<span>HP</span>
				<span class="font-mono">{view.hp} / {view.maxHp}</span>
			</div>
			<div class="h-2 overflow-hidden rounded-full bg-bar-track">
				<div
					class="h-full transition-all duration-300 {hpBarClass}"
					style:width="{barPercent(view.hp, view.maxHp)}%"
				></div>
			</div>
		</div>
		<div>
			<div class="mb-1 flex justify-between text-xs text-text-muted">
				<span>SP</span>
				<span class="font-mono">{view.sp} / {view.maxSp}</span>
			</div>
			<div class="h-2 overflow-hidden rounded-full bg-bar-track">
				<div
					class="h-full transition-all duration-300 {spBarClass}"
					style:width="{barPercent(view.sp, view.maxSp)}%"
				></div>
			</div>
		</div>
	</div>
{/snippet}

<Window title={environment.name} class="m-0 flex min-h-144 w-full max-w-none min-w-0 flex-col">
	<div class="rounded-lg bg-gradient-to-b from-surface-inset to-parchment-deep p-4">
		<div class="relative min-h-112 w-full">
			<div class="flex justify-center -translate-x-2/9">
				<MapGrid map={battleMap} viewScale={mapViewScale} embedded combatants={mapCombatants}>
				{#snippet overlay()}
					{#if playerDamagePopup && playerTileCenter}
						{#key playerDamagePopup.id}
							<div
								class="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-1/2"
								style:left="{playerTileCenter.x}px"
								style:top="{playerTileCenter.y}px"
							>
								<BattleDamagePopup
									amount={playerDamagePopup.amount}
									critical={playerDamagePopup.critical}
									side="player"
								/>
							</div>
						{/key}
					{/if}

					{#if opponentDamagePopup && opponentTileCenter}
						{#key opponentDamagePopup.id}
							<div
								class="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-1/2"
								style:left="{opponentTileCenter.x}px"
								style:top="{opponentTileCenter.y}px"
							>
								<BattleDamagePopup
									amount={opponentDamagePopup.amount}
									critical={opponentDamagePopup.critical}
									side="opponent"
								/>
							</div>
						{/key}
					{/if}
				{/snippet}
				</MapGrid>
			</div>

			<div class="pointer-events-none absolute inset-0 z-10">
			<div
				class="pointer-events-auto absolute top-3 left-1/2 z-30 flex -translate-x-1/2 flex-col items-center rounded-lg border border-border bg-parchment/92 px-4 py-3 text-center shadow-[0_4px_14px_rgba(12,30,46,0.12)] backdrop-blur-sm"
				aria-live="polite"
			>
				{#if !battle}
					<p class="text-xs tracking-widest text-text-subtle uppercase">Battle</p>
					<p class="text-sm text-text-muted">Waiting for a player character</p>
				{:else if battle.isOver}
					<p class="text-lg font-semibold text-gold">
						{battle.phase === 'victory' ? 'Victory!' : 'Defeat'}
					</p>
				{:else}
					<p class="text-xs tracking-widest text-text-subtle uppercase">Turn</p>
					<p class="font-mono text-sm text-frame-dark">
						{battle.turn === 'player' ? 'Your turn' : 'Opponent turn'}
					</p>
				{/if}

				{#if battle?.lastAction && battle.lastAction.damage > 0}
					<p class="mt-1 text-sm text-text-muted">
						{#if battle.lastAction.isCritical}
							<span class="font-semibold text-red-400">Critical!</span><br />
						{/if}
						{battle.lastAction.damage} damage · {describeSkill(
							battle.lastAction.skillId ?? '0001_attack'
						)}
					</p>
				{/if}

				{#if battle}
					<ButtonRetangular class="mt-2" label="reset battle" onclick={resetBattle} />
				{/if}
			</div>


			{#if player && playerView && battle}
				<div class="pointer-events-auto absolute bottom-3 left-3 z-20 flex items-end gap-2">
					<Window title="" class="m-0 w-86 max-w-[calc(100%-2rem)] min-w-0">
						<div class="mb-3 flex items-start justify-between gap-3">
							<h3 class="min-w-0 truncate font-semibold text-frame-dark">{playerView.name}</h3>
							<span
								class="shrink-0 rounded bg-parchment-aside px-2 py-0.5 font-mono text-xs text-text-muted"
								>Lv.{playerView.level}</span
							>
						</div>
						{@render vitalsBars(playerView, 'bg-title-bottom', 'bg-title-mid')}
					</Window>
                    <BattleSkillBar
                        skills={playerView.skills}
                        disabled={battle.isOver || battle.turn !== 'player'}
                        onSkill={onPlayerSkill}
                    />
					<!-- <Window title="" class="m-0 min-w-0 shrink-0">
						<p class="mb-2 text-xs font-medium tracking-wide text-text-subtle uppercase">Skills</p>
					</Window> -->
				</div>
			{/if}

			<div class="pointer-events-auto absolute top-3 right-3 z-20">
				<Window title="" class="m-0 w-86 max-w-[calc(100%-2rem)] min-w-0">
					<div class="mb-3 flex items-start justify-between gap-3">
						<h3 class="min-w-0 truncate font-semibold text-frame-dark">{opponentView.name}</h3>
						<span
							class="shrink-0 rounded bg-parchment-aside px-2 py-0.5 font-mono text-xs text-text-muted"
							>Lv.{opponentView.level}</span
						>
					</div>
					{@render vitalsBars(opponentView, 'bg-gold-dim', 'bg-frame-light')}
				</Window>
			</div>
			</div>
		</div>
	</div>

	<section
		class="mt-4 grid gap-4 border-t border-border pt-4 sm:grid-cols-2"
		aria-label="Combatant details"
	>
		<div class="min-w-0">
			<p class="mb-3 text-xs font-medium tracking-wide text-title-mid uppercase">Player</p>
			{#if player && playerView && battle}
				<div class="space-y-3 text-sm">
					<div>
						<h3 class="font-semibold text-frame-dark">{playerView.name}</h3>
						{#if playerView.label}
							<p class="text-xs text-text-subtle">{playerView.label}</p>
						{/if}
					</div>
					<p class="font-mono text-xs text-text-muted">Level {playerView.level}</p>
					{@render vitalsBars(playerView, 'bg-title-bottom', 'bg-title-mid')}
					<dl class="grid gap-2 text-xs text-text-subtle sm:grid-cols-2">
						{#if isCharacter(player)}
							<div>
								<dt class="uppercase">Weapon</dt>
								<dd class="font-mono text-frame">
									{player.getEquippedWeapon()?.name ?? 'Unarmed'}
								</dd>
							</div>
							<div>
								<dt class="uppercase">Est. damage</dt>
								<dd class="font-mono text-frame">{player.estimateDamage('0001_attack').damage}</dd>
							</div>
						{/if}
					</dl>
				</div>
			{:else}
				<a
					href={rosterHref}
					class="group flex flex-col items-center justify-center rounded-sm border border-dashed border-title-mid/40 bg-parchment/95 p-6 text-center transition hover:border-title-mid hover:bg-selected-bg"
				>
					<p class="text-lg font-semibold text-frame-dark group-hover:text-title-top">No character</p>
					<p class="mt-2 text-sm text-text-subtle group-hover:text-text-muted">
						Create a character in the roster to battle here.
					</p>
					<p class="mt-4 text-xs font-medium text-title-mid group-hover:text-title-top">
						Open roster →
					</p>
				</a>
			{/if}
		</div>

		<div class="min-w-0 sm:border-l sm:border-border sm:pl-4">
			<p class="mb-3 text-xs font-medium tracking-wide text-gold-dim uppercase">Opponent</p>
			<div class="space-y-3 text-sm">
				<div>
					<h3 class="font-semibold text-frame-dark">{opponentView.name}</h3>
					{#if opponentView.label}
						<p class="text-xs text-text-subtle">{opponentView.label}</p>
					{/if}
				</div>
				<p class="font-mono text-xs text-text-muted">Level {opponentView.level}</p>
				{@render vitalsBars(opponentView, 'bg-gold-dim', 'bg-frame-light')}
				<dl class="grid gap-2 text-xs text-text-subtle sm:grid-cols-2">
					<div>
						<dt class="uppercase">Strength</dt>
						<dd class="font-mono text-frame">{opponent.scales[SCALES.STRENGTH] ?? 0}</dd>
					</div>
					<div>
						<dt class="uppercase">Status</dt>
						<dd class="font-mono text-frame">{opponentView.isAlive ? 'Active' : 'Defeated'}</dd>
					</div>
				</dl>
			</div>
		</div>
	</section>

	{#snippet footer()}
		<p class="text-xs font-medium tracking-wide text-text-subtle uppercase">Battle log</p>
		{#if !battle || battleLog.length === 0}
			<p class="text-sm text-text-subtle">No actions yet.</p>
		{:else}
			<ol
				class="max-h-36 w-full space-y-1.5 overflow-y-auto rounded-lg border border-border bg-surface-code p-2 text-sm"
			>
				{#each battleLog as entry, index (index)}
					<li class="font-mono text-frame" class:text-gold={entry.isCritical}>
						<span class="text-text-subtle">{index + 1}.</span>
						{formatLogEntry(entry)}
					</li>
				{/each}
			</ol>
		{/if}
	{/snippet}
</Window>
