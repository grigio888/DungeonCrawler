<script>
	import './window-theme.css';
	import ButtonCircular from './ButtonCircular.svelte';

	/**
	 * @typedef {{
	 *   children: import('svelte').Snippet,
	 *   aside?: import('svelte').Snippet,
	 *   footer?: import('svelte').Snippet,
	 *   title?: string,
	 *   class?: string,
	 *   onTitleLeftClick?: (() => void) | undefined,
	 *   onTitleRightClick?: (() => void) | undefined
	 * }} Props
	 */

	/** @type {Props} */
	let {
		children,
		aside,
		footer,
		title = 'Basic Info',
		class: className = 'm-4 w-[21.5rem]',
		onTitleLeftClick = undefined,
		onTitleRightClick = undefined
	} = $props();
</script>

<div
	class="game-window relative flex min-w-0 flex-col overflow-hidden rounded-sm {className}"
>
	<header
		class="game-window__header relative flex items-center gap-1.5 px-1.5 py-1"
	>
		<ButtonCircular class="size-3.5" aria-label="Pin window" onclick={onTitleLeftClick} />
		<h2 class="game-window__title min-w-0 flex-1 truncate text-center text-[11px] uppercase">
			{title}
		</h2>
		<ButtonCircular class="size-3.5" aria-label="Close window" onclick={onTitleRightClick} />
	</header>

	<main class="flex min-h-0 flex-1">
		<section class="game-window__body flex min-w-0 flex-1 flex-col gap-1 p-4 text-stone-900">
			{@render children()}
		</section>

		{#if aside}
			<aside class="game-window__aside flex w-[5.75rem] shrink-0 flex-col p-1.5">
				{@render aside()}
			</aside>
		{/if}
	</main>

	{#if footer}
		<footer class="game-window__footer flex w-full flex-col gap-1 px-4 py-3 text-xs text-stone-800">
			{@render footer()}
		</footer>
	{/if}
</div>
