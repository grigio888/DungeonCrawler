<script>
	import { resolve } from '$app/paths';
	import { SCALES } from '$lib/enums';
	import {
		Battle,
		isCharacter,
		resolveClassSpriteUrl,
		resolveMonsterSpriteUrl,
		snapshotCombatant
	} from '$lib/battle';
	import SkillFactory from '$lib/skills/factory';
	import BattleDamagePopup from '$lib/components/battle/BattleDamagePopup.svelte';

	/**
	 * @type {{
	 *   player: import('$lib/characters').BaseCharacter | null,
	 *   opponent: import('$lib/battle/types.js').BattleCombatant,
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

	const classSprites = import.meta.glob('$lib/classes/**/sprites/*.{png,webp,gif}', {
		eager: true,
		query: '?url',
		import: 'default'
	});

	const monsterSprites = import.meta.glob('$lib/monsters/*/sprites/*.{png,webp,gif}', {
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
		return resolveClassSpriteUrl(classSprites, playerView.promptPath ?? '', playerView.spriteKey);
	});

	const opponentSpriteUrl = $derived.by(() => {
		if (!opponentView) return null;
		if (opponentView.kind === 'monster') {
			return resolveMonsterSpriteUrl(monsterSprites, opponentView.promptPath ?? '');
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

	/** @param {import('$lib/battle/types.js').BattleActionResult} entry */
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

<section
	class="flex min-h-[32rem] flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl shadow-black/40"
>
	<header
		class="border-b border-zinc-800 bg-gradient-to-r from-zinc-900 via-zinc-900/90 to-zinc-950 px-5 py-4"
	>
		<p class="text-xs font-medium tracking-widest text-sky-400/90 uppercase">Environment</p>
		<h2 class="mt-1 text-xl font-semibold text-zinc-100">{environment.name}</h2>
		<p class="mt-1 text-sm text-zinc-400">{environment.description}</p>
	</header>

	<div class="grid flex-1 gap-4 p-4 lg:grid-cols-[1fr_auto_1fr] lg:items-end">
		{#if player && playerView && battle}
			<article class="rounded-xl border border-emerald-500/25 bg-zinc-900/70 p-4">
				<div class="mb-3 flex items-start justify-between gap-3">
					<div>
						<p class="text-xs tracking-wide text-emerald-400/80 uppercase">Player</p>
						<h3 class="font-semibold text-zinc-100">{playerView.name}</h3>
						<p class="text-xs text-zinc-500">{playerView.label}</p>
					</div>
					<span class="rounded bg-zinc-800 px-2 py-0.5 font-mono text-xs text-zinc-400"
						>Lv.{playerView.level}</span
					>
				</div>

				<div class="relative mx-auto mb-3 flex min-h-28 max-h-28 items-end justify-center">
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
						<img
							src={playerSpriteUrl}
							alt={playerView.name}
							class="image-pixelated max-h-28"
						/>
					{/if}
				</div>

				<div class="space-y-2 text-sm">
					<div>
						<div class="mb-1 flex justify-between text-xs text-zinc-400">
							<span>HP</span>
							<span class="font-mono">{playerView.hp} / {playerView.maxHp}</span>
						</div>
						<div class="h-2 overflow-hidden rounded-full bg-zinc-800">
							<div
								class="h-full bg-emerald-500 transition-all duration-300"
								style:width="{barPercent(playerView.hp, playerView.maxHp)}%"
							></div>
						</div>
					</div>
					<div>
						<div class="mb-1 flex justify-between text-xs text-zinc-400">
							<span>SP</span>
							<span class="font-mono">{playerView.sp} / {playerView.maxSp}</span>
						</div>
						<div class="h-2 overflow-hidden rounded-full bg-zinc-800">
							<div
								class="h-full bg-sky-500 transition-all duration-300"
								style:width="{barPercent(playerView.sp, playerView.maxSp)}%"
							></div>
						</div>
					</div>
				</div>
			</article>
		{:else}
			<a
				href={rosterHref}
				class="group flex min-h-[14rem] flex-col items-center justify-center rounded-xl border border-dashed border-emerald-500/35 bg-zinc-900/50 p-6 text-center transition hover:border-emerald-400/60 hover:bg-emerald-950/20"
			>
				<p class="text-xs tracking-wide text-emerald-400/80 uppercase">Player</p>
				<p class="mt-3 text-lg font-semibold text-zinc-200 group-hover:text-emerald-100">
					No character
				</p>
				<p class="mt-2 max-w-[14rem] text-sm text-zinc-500 group-hover:text-zinc-400">
					Create a character in the roster to battle here.
				</p>
				<p class="mt-4 text-xs font-medium text-emerald-400/90 group-hover:text-emerald-300">
					Open roster →
				</p>
			</a>
		{/if}

		<div class="flex flex-col items-center justify-center gap-2 px-2 py-4 text-center">
			{#if !battle}
				<p class="text-xs tracking-widest text-zinc-500 uppercase">Battle</p>
				<p class="text-sm text-zinc-400">Waiting for a player character</p>
			{:else if battle.isOver}
				<p class="text-lg font-semibold text-amber-300">
					{battle.phase === 'victory' ? 'Victory!' : 'Defeat'}
				</p>
			{:else}
				<p class="text-xs tracking-widest text-zinc-500 uppercase">Turn</p>
				<p class="font-mono text-sm text-zinc-200">
					{battle.turn === 'player' ? 'Your turn' : 'Opponent turn'}
				</p>
			{/if}

			{#if battle?.lastAction && battle.lastAction.damage > 0}
				<p class="text-sm text-zinc-400">
					{#if battle.lastAction.isCritical}
						<span class="font-semibold text-red-400">Critical!</span><br>
						{' '}
					{/if}
					{battle.lastAction.damage} damage · {describeSkill(
						battle.lastAction.skillId ?? '0001_attack'
					)}
				</p>
			{/if}

			{#if battle}
				<button
					type="button"
					class="mt-2 rounded-lg border border-zinc-700 px-3 py-1.5 text-xs text-zinc-400 hover:border-zinc-500 hover:text-zinc-200"
					onclick={resetBattle}
				>
					Reset battle
				</button>
			{/if}
		</div>

		<article class="rounded-xl border border-rose-500/25 bg-zinc-900/70 p-4">
			<div class="mb-3 flex items-start justify-between gap-3">
				<div>
					<p class="text-xs tracking-wide text-rose-400/80 uppercase">Opponent</p>
					<h3 class="font-semibold text-zinc-100">{opponentView.name}</h3>
					<p class="text-xs text-zinc-500">{opponentView.label}</p>
				</div>
				<span class="rounded bg-zinc-800 px-2 py-0.5 font-mono text-xs text-zinc-400"
					>Lv.{opponentView.level}</span
				>
			</div>

			<div class="relative mx-auto mb-3 flex min-h-28 max-h-28 items-end justify-center">
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
					<img
						src={opponentSpriteUrl}
						alt={opponentView.name}
						class="image-pixelated max-h-28"
					/>
				{/if}
			</div>

			<div class="space-y-2 text-sm">
				<div>
					<div class="mb-1 flex justify-between text-xs text-zinc-400">
						<span>HP</span>
						<span class="font-mono">{opponentView.hp} / {opponentView.maxHp}</span>
					</div>
					<div class="h-2 overflow-hidden rounded-full bg-zinc-800">
						<div
							class="h-full bg-rose-500 transition-all duration-300"
							style:width="{barPercent(opponentView.hp, opponentView.maxHp)}%"
						></div>
					</div>
				</div>
				<div>
					<div class="mb-1 flex justify-between text-xs text-zinc-400">
						<span>SP</span>
						<span class="font-mono">{opponentView.sp} / {opponentView.maxSp}</span>
					</div>
					<div class="h-2 overflow-hidden rounded-full bg-zinc-800">
						<div
							class="h-full bg-violet-500 transition-all duration-300"
							style:width="{barPercent(opponentView.sp, opponentView.maxSp)}%"
						></div>
					</div>
				</div>
			</div>
		</article>
	</div>

	<footer class="border-t border-zinc-800 bg-zinc-900/80 p-4">
		<p class="mb-3 text-xs tracking-wide text-zinc-500 uppercase">Actions</p>
		<div class="flex flex-wrap gap-2">
			{#if battle && playerView}
				{#each playerView.skills as skillId (skillId)}
					<button
						type="button"
						class="rounded-lg border border-emerald-500/30 bg-emerald-950/50 px-4 py-2 text-sm text-emerald-100 transition hover:border-emerald-400 disabled:cursor-not-allowed disabled:opacity-40"
						disabled={battle.isOver || battle.turn !== 'player'}
						onclick={() => onPlayerSkill(skillId)}
					>
						{describeSkill(skillId)}
					</button>
				{/each}
			{/if}
		</div>

		<dl class="mt-4 grid gap-2 text-xs text-zinc-500 sm:grid-cols-2 lg:grid-cols-3">
			{#if player && isCharacter(player)}
				<div>
					<dt class="uppercase">Weapon</dt>
					<dd class="font-mono text-zinc-300">
						{player.getEquippedWeapon()?.name ?? 'Unarmed'}
					</dd>
				</div>
				<div>
					<dt class="uppercase">Est. damage</dt>
					<dd class="font-mono text-zinc-300">{player.estimateDamage('0001_attack').damage}</dd>
				</div>
			{/if}
			<div>
				<dt class="uppercase">Opponent STR</dt>
				<dd class="font-mono text-zinc-300">{opponent.scales[SCALES.STRENGTH] ?? 0}</dd>
			</div>
		</dl>

		{#if battle}
			<div class="mt-4 border-t border-zinc-800/80 pt-4">
				<p class="mb-2 text-xs tracking-wide text-zinc-500 uppercase">Battle log</p>
				{#if battleLog.length === 0}
					<p class="text-sm text-zinc-600">No actions yet.</p>
				{:else}
					<ol
						class="max-h-36 space-y-1.5 overflow-y-auto rounded-lg border border-zinc-800 bg-zinc-950/60 p-2 text-sm"
					>
						{#each battleLog as entry, index (index)}
							<li
								class="font-mono text-zinc-300"
								class:text-amber-300={entry.isCritical}
							>
								<span class="text-zinc-600">{index + 1}.</span>
								{formatLogEntry(entry)}
							</li>
						{/each}
					</ol>
				{/if}
			</div>
		{/if}
	</footer>
</section>

<style>
	.image-pixelated {
		image-rendering: pixelated;
		image-rendering: crisp-edges;
	}
</style>
