<script lang="ts">
	export let user: string;
	export let error: string;
</script>

<h2>Who am I?</h2>

{#if user}
	{JSON.stringify(user)}
{/if}

{#if error}
	{JSON.stringify(error)}
{/if}
