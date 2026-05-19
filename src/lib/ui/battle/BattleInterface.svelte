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
	import SkillFactory from '$lib/content/skills/factory';
	import BattleDamagePopup from '$lib/ui/battle/BattleDamagePopup.svelte';
	import Window from '$lib/ui/window/Window.svelte';
	import ButtonRetangular from '$lib/ui/window/ButtonRetangular.svelte';

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
			return resolveMonsterSpriteUrl(monsterSprites, opponentView.promptPath ?? '', 'idle');
		}
		if (!opponentView.spriteKey) return null;
		return resolveClassSpriteUrl(
			classSprites,
			opponentView.promptPath ?? '',
			opponentView.spriteKey
		);
	});

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

<Window title={environment.name} class="m-0 flex min-h-[32rem] w-full max-w-none min-w-0 flex-col">
	<p class="mb-3 text-sm text-text-muted">{environment.description}</p>

	<div class="grid flex-1 gap-3 lg:grid-cols-[1fr_auto_1fr] lg:items-end">
		{#if player && playerView && battle}
			<Window title="Player" class="m-0 w-full max-w-none min-w-0">
				<div class="mb-3 flex items-start justify-between gap-3">
					<div>
						<p class="text-xs tracking-wide text-title-mid uppercase">Player</p>
						<h3 class="font-semibold text-frame-dark">{playerView.name}</h3>
						<p class="text-xs text-text-subtle">{playerView.label}</p>
					</div>
					<span class="rounded bg-parchment-aside px-2 py-0.5 font-mono text-xs text-text-muted"
						>Lv.{playerView.level}</span
					>
				</div>

				<div class="relative mx-auto mb-3 flex max-h-28 min-h-28 items-end justify-center">
					{#if playerDamagePopup}
						{#key playerDamagePopup.id}
							<BattleDamagePopup
								amount={playerDamagePopup.amount}
								critical={playerDamagePopup.critical}
								side="player"
							/>
						{/key}
					{/if}
					{#if playerSpriteUrl}
						<img src={playerSpriteUrl} alt={playerView.name} class="image-pixelated max-h-28" />
					{/if}
				</div>

				<div class="space-y-2 text-sm">
					<div>
						<div class="mb-1 flex justify-between text-xs text-text-muted">
							<span>HP</span>
							<span class="font-mono">{playerView.hp} / {playerView.maxHp}</span>
						</div>
						<div class="h-2 overflow-hidden rounded-full bg-bar-track">
							<div
								class="h-full bg-title-bottom transition-all duration-300"
								style:width="{barPercent(playerView.hp, playerView.maxHp)}%"
							></div>
						</div>
					</div>
					<div>
						<div class="mb-1 flex justify-between text-xs text-text-muted">
							<span>SP</span>
							<span class="font-mono">{playerView.sp} / {playerView.maxSp}</span>
						</div>
						<div class="h-2 overflow-hidden rounded-full bg-bar-track">
							<div
								class="h-full bg-title-mid transition-all duration-300"
								style:width="{barPercent(playerView.sp, playerView.maxSp)}%"
							></div>
						</div>
					</div>
				</div>
			</Window>
		{:else}
			<a
				href={rosterHref}
				class="group flex min-h-[14rem] flex-col items-center justify-center rounded-xl border border-dashed border-title-mid/40 bg-surface-inset p-6 text-center transition hover:border-title-mid hover:bg-selected-bg"
			>
				<p class="text-xs tracking-wide text-title-mid uppercase">Player</p>
				<p class="mt-3 text-lg font-semibold text-frame-dark group-hover:text-title-top">
					No character
				</p>
				<p class="mt-2 max-w-[14rem] text-sm text-text-subtle group-hover:text-text-muted">
					Create a character in the roster to battle here.
				</p>
				<p class="mt-4 text-xs font-medium text-title-mid group-hover:text-title-top">
					Open roster →
				</p>
			</a>
		{/if}

		<div class="flex flex-col items-center justify-center gap-2 px-2 py-4 text-center">
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
				<p class="text-sm text-text-muted">
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

		<Window title="Opponent" class="m-0 w-full max-w-none min-w-0">
			<div class="mb-3 flex items-start justify-between gap-3">
				<div>
					<p class="text-xs tracking-wide text-gold-dim uppercase">Opponent</p>
					<h3 class="font-semibold text-frame-dark">{opponentView.name}</h3>
					<p class="text-xs text-text-subtle">{opponentView.label}</p>
				</div>
				<span class="rounded bg-parchment-aside px-2 py-0.5 font-mono text-xs text-text-muted"
					>Lv.{opponentView.level}</span
				>
			</div>

			<div class="relative mx-auto mb-3 flex max-h-28 min-h-28 items-end justify-center">
				{#if opponentDamagePopup}
					{#key opponentDamagePopup.id}
						<BattleDamagePopup
							amount={opponentDamagePopup.amount}
							critical={opponentDamagePopup.critical}
							side="opponent"
						/>
					{/key}
				{/if}
				{#if opponentSpriteUrl}
					<img src={opponentSpriteUrl} alt={opponentView.name} class="image-pixelated max-h-28" />
				{/if}
			</div>

			<div class="space-y-2 text-sm">
				<div>
					<div class="mb-1 flex justify-between text-xs text-text-muted">
						<span>HP</span>
						<span class="font-mono">{opponentView.hp} / {opponentView.maxHp}</span>
					</div>
					<div class="h-2 overflow-hidden rounded-full bg-bar-track">
						<div
							class="h-full bg-gold-dim transition-all duration-300"
							style:width="{barPercent(opponentView.hp, opponentView.maxHp)}%"
						></div>
					</div>
				</div>
				<div>
					<div class="mb-1 flex justify-between text-xs text-text-muted">
						<span>SP</span>
						<span class="font-mono">{opponentView.sp} / {opponentView.maxSp}</span>
					</div>
					<div class="h-2 overflow-hidden rounded-full bg-bar-track">
						<div
							class="h-full bg-frame-light transition-all duration-300"
							style:width="{barPercent(opponentView.sp, opponentView.maxSp)}%"
						></div>
					</div>
				</div>
			</div>
		</Window>
	</div>

	{#if battle && playerView}
		<div class="mt-3 border-t border-border pt-3">
			<p class="mb-2 text-xs font-medium tracking-wide text-text-subtle uppercase">Actions</p>
			<div class="flex flex-wrap gap-1">
				{#each playerView.skills as skillId (skillId)}
					<ButtonRetangular
						label={describeSkill(skillId)}
						disabled={battle.isOver || battle.turn !== 'player'}
						onclick={() => onPlayerSkill(skillId)}
					/>
				{/each}
			</div>

			<dl class="mt-3 grid gap-2 text-xs text-text-subtle sm:grid-cols-2 lg:grid-cols-3">
				{#if player && isCharacter(player)}
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
				<div>
					<dt class="uppercase">Opponent STR</dt>
					<dd class="font-mono text-frame">{opponent.scales[SCALES.STRENGTH] ?? 0}</dd>
				</div>
			</dl>
		</div>
	{/if}

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

<style>
	.image-pixelated {
		image-rendering: pixelated;
		image-rendering: crisp-edges;
	}
</style>
