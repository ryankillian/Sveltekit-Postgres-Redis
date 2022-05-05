<script>
	import { onMount } from 'svelte';
	import { draw } from 'svelte/transition';
	let visible = false;
	onMount(() => {
		visible = true;
	});
</script>

<div>
	<svg
		class="w-6 h-6"
		fill="none"
		stroke="currentColor"
		viewBox="0 0 24 24"
		xmlns="http://www.w3.org/2000/svg"
	>
		{#if visible}
			<path
				in:draw={{ duration: 10000 }}
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				stroke="orange"
				d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
			/>
		{/if}
	</svg>
</div>

<style>
	div {
		display: grid;
		place-items: center;
		height: 40em;
		width: 40em;
		color: radial-gradient(#e66465, #9198e5);
	}
</style>