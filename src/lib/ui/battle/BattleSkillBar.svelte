<script>
	import SkillFactory from '$lib/content/skills/factory';

	const SKILL_SLOT_COUNT = 5;

	const skillIconModules = import.meta.glob('$lib/content/skills/*/sprites/*.{png,webp,gif}', {
		eager: true,
		query: '?url',
		import: 'default'
	});

	/**
	 * @typedef {{
	 *   skills?: string[],
	 *   disabled?: boolean,
	 *   onSkill?: (skillId: string) => void
	 * }} Props
	 */

	/** @type {Props} */
	let { skills = [], disabled = false, onSkill } = $props();

	const slots = $derived(
		Array.from({ length: SKILL_SLOT_COUNT }, (_, index) => skills[index] ?? null)
	);

	/**
	 * @param {string} skillId
	 * @param {string | null} iconKey
	 */
	function resolveSkillIconUrl(skillId, iconKey) {
		const folder = `/skills/${skillId}/sprites/`;

		for (const [path, url] of Object.entries(skillIconModules)) {
			if (!path.includes(folder)) continue;
			if (!iconKey) {
				return /** @type {string} */ (url);
			}
			if (path.endsWith(`/${iconKey}`) || path.endsWith(iconKey)) {
				return /** @type {string} */ (url);
			}
		}

		return null;
	}

	/**
	 * @param {string | null} skillId
	 */
	function getSlotDisplay(skillId) {
		if (!skillId) return null;

		try {
			const skill = new SkillFactory(skillId);
			return {
				id: skillId,
				name: skill.name,
				iconUrl: resolveSkillIconUrl(skillId, skill.icon)
			};
		} catch {
			return { id: skillId, name: skillId, iconUrl: null };
		}
	}

	/**
	 * @param {string} name
	 */
	function skillInitials(name) {
		const parts = name.trim().split(/\s+/);
		if (parts.length >= 2) {
			return (parts[0][0] + parts[1][0]).toUpperCase();
		}
		return name.slice(0, 2).toUpperCase();
	}

	const slotSize =
		'aspect-square size-11 rounded-sm border border-btn-border shadow-[0_1px_2px_rgba(12,30,46,0.1),inset_0_1px_0_rgba(255,255,255,0.7)]';

	const skillFace =
		'bg-[linear-gradient(180deg,var(--color-btn-top)_0%,var(--color-btn-mid)_48%,var(--color-btn-bottom)_100%)] enabled:cursor-pointer enabled:hover:border-title-mid enabled:hover:bg-[linear-gradient(180deg,var(--color-btn-hover-top)_0%,var(--color-btn-hover-mid)_48%,var(--color-btn-hover-bottom)_100%)] enabled:active:translate-y-px disabled:cursor-not-allowed disabled:border-border-strong disabled:bg-parchment-aside disabled:opacity-75';
</script>

<div class="border rounded-md bg-(--color-parchment-aside) p-3 grid grid-cols-5 gap-1.5" role="toolbar" aria-label="Equipped skills">
	{#each slots as skillId, index (index)}
		{@const slot = getSlotDisplay(skillId)}
		{#if slot}
			<button
				type="button"
				class="inline-flex items-center justify-center p-0 transition-[background,border-color,transform] duration-150 {slotSize} {skillFace}"
				{disabled}
				aria-label={slot.name}
				title={slot.name}
				onclick={() => onSkill?.(slot.id)}
			>
				{#if slot.iconUrl}
					<img src={slot.iconUrl} alt="" class="size-full object-contain p-1.5" />
				{:else}
					<span class="text-[10px] font-bold tracking-wide text-btn-text uppercase">
						{skillInitials(slot.name)}
					</span>
				{/if}
			</button>
		{:else}
			<div
				aria-hidden="true"
				class="{slotSize} border-dashed border-border/55 bg-bar-track/40"
			></div>
		{/if}
	{/each}
</div>
