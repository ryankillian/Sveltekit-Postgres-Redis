<script lang="ts">
	// ts-nocheck
	import { session } from '$app/stores';
	import { user } from '$src/stores';

	async function logout() {
		const response = await fetch(`api/logout`);
		// setting client session store to {}. Not able in endpoint.
		$user = {};
		$session = {};
	}
</script>

<nav>
	{#if JSON.stringify($session) !== JSON.stringify({})}
		<a href="/{$session.id}">{$session.username}</a>
		<a href="/login" on:click={logout}>Logout</a>
	{:else}
		<a href="/register">Register</a>
		<a href="/login">Login</a>
	{/if}
</nav>
Session: {JSON.stringify($session)}
User: {JSON.stringify($user)}
<main>
	<slot />
</main>

<style>
	:root {
		--primary-light: #a6f9d6;
		--primary: #5be2a9;
		--primary-dark: #53ce9a;
		--secondary: #1e2145;
		--white: #fff;
		--grey: #e6e6ff;
		--grey-dark: #6d7098;
		--red: #ff6b6b;
	}
	:global(body) {
		margin: 0;
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
	}

	nav {
		display: flex;
		justify-content: right;
		padding: 1rem;
		background-color: lemonchiffon;
	}
	nav a {
		text-decoration: none;
		color: #333;
		padding: 0.5rem;
	}
	main {
		width: 100%;
		max-width: 40em;
		margin: 0 auto;
		padding: 2em 1em;
		box-sizing: border-box;
	}
</style>
