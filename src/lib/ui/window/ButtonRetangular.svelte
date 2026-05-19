<script>
	import './window-theme.css';

	/**
	 * @typedef {{
	 *   label?: string,
	 *   children?: import('svelte').Snippet,
	 *   class?: string,
	 *   onclick?: (event: MouseEvent) => void,
	 *   type?: 'button' | 'submit' | 'reset',
	 *   disabled?: boolean,
	 *   'aria-label'?: string
	 * }} Props
	 */

	/** @type {Props} */
	let {
		label = '',
		children,
		class: className = '',
		onclick,
		type = 'button',
		disabled = false,
		'aria-label': ariaLabel = undefined
	} = $props();
</script>

<button {type} {disabled} {onclick} aria-label={ariaLabel} class="game-btn-rect {className}">
	<span class="game-btn-rect__face w-full">
		{#if children}
			{@render children()}
		{:else}
			{label}
		{/if}
	</span>
</button>
