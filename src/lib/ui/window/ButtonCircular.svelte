<script>
	let {
		class: className = 'size-3.5',
		onclick,
		type = /** @type {'button' | 'submit' | 'reset'} */ ('button'),
		'aria-label': ariaLabel = 'Window control'
	} = $props();

	const isClose = $derived(ariaLabel?.toLowerCase().includes('close') ?? false);

	const faceBase =
		"relative flex h-full w-full shrink-0 items-center justify-center rounded-full border border-btn-border shadow-[0_1px_2px_rgba(12,30,46,0.1),inset_0_1px_0_rgba(255,255,255,0.7)] transition-[background,box-shadow,transform,border-color] duration-[140ms,140ms,80ms,140ms] before:pointer-events-none before:absolute before:top-[15%] before:right-[20%] before:left-[20%] before:h-px before:bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.85),transparent)] before:content-['']";

	const faceDefault =
		'bg-[linear-gradient(180deg,var(--color-btn-top)_0%,var(--color-btn-mid)_48%,var(--color-btn-bottom)_100%)] group-enabled:group-hover:border-title-mid group-enabled:group-hover:bg-[linear-gradient(180deg,var(--color-btn-hover-top)_0%,var(--color-btn-hover-mid)_48%,var(--color-btn-hover-bottom)_100%)] group-enabled:group-hover:shadow-[0_1px_3px_rgba(42,109,173,0.2),inset_0_1px_0_rgba(255,255,255,0.85)] group-enabled:group-active:translate-y-px group-enabled:group-active:shadow-[inset_0_1px_3px_rgba(12,30,46,0.12)] group-focus-visible:outline-2 group-focus-visible:outline-offset-2 group-focus-visible:outline-title-mid';

	const faceCloseHover =
		'group-enabled:group-hover:border-red-400 group-enabled:group-hover:bg-[linear-gradient(180deg,#f8c8c8_0%,#e87878_48%,#c54a4a_100%)] group-enabled:group-hover:shadow-[0_1px_3px_rgba(180,60,60,0.25),inset_0_1px_0_rgba(255,255,255,0.85)]';
</script>

<button
	{type}
	aria-label={ariaLabel}
	{onclick}
	class="group relative cursor-pointer border-none bg-transparent p-0 {className}"
>
	<span class="{faceBase} {faceDefault} {isClose ? faceCloseHover : ''}">
		{#if isClose}
			<span class="relative block h-2 w-2 text-btn-text" aria-hidden="true">
				<span
					class="absolute top-1/2 left-1/2 h-[1.5px] w-2 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-sm bg-current"
				></span>
				<span
					class="absolute top-1/2 left-1/2 h-[1.5px] w-2 -translate-x-1/2 -translate-y-1/2 -rotate-45 rounded-sm bg-current"
				></span>
			</span>
		{:else}
			<span class="block h-0.5 w-1.5 rounded-sm bg-btn-text" aria-hidden="true"></span>
		{/if}
	</span>
</button>
