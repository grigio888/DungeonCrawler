<script>
	import './window-theme.css';

	let {
		class: className = 'size-3',
		onclick,
		type = /** @type {'button' | 'submit' | 'reset'} */ ('button'),
		'aria-label': ariaLabel = 'Window control'
	} = $props();

	const isClose = $derived(
		ariaLabel?.toLowerCase().includes('close') ?? false
	);
</script>

<button
	type={type}
	aria-label={ariaLabel}
	{onclick}
	class="game-btn-round {isClose ? 'game-btn-round--close' : ''} {className}"
>
	<span class="game-btn-round__face">
		{#if isClose}
			<span class="game-btn-round__icon game-btn-round__icon--close" aria-hidden="true"></span>
		{:else}
			<span class="game-btn-round__icon game-btn-round__icon--pin" aria-hidden="true"></span>
		{/if}
	</span>
</button>
