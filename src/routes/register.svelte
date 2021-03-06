<script lang="ts">
	import { goto } from '$app/navigation';
	import { session } from '$app/stores';
	import { registerSchema } from '$lib/schema';
	import { toErrorMap } from '$lib/utils/toErrorMap';
	import { createForm } from 'svelte-forms-lib';

	const { form, errors, state, handleChange, handleSubmit } = createForm({
		initialValues: {
			username: '',
			email: '',
			password: ''
		},
		validationSchema: registerSchema,
		onSubmit: async (values) => {
			const result = await fetchData(values);

			if (result.status === 400) {
				$errors = toErrorMap(result.errors);
			} else {
				// set session here because GetSession called before endpoint
				$session = result.user;
				goto(`/${result.user.id}`);
			}
		}
	});

	async function fetchData(values) {
		const response = await fetch(`api/register`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(values)
		});
		return await response.json();
	}
</script>

<h1>Register</h1>
<form on:submit={handleSubmit}>
	<label for="username">User Name</label>
	<input
		id="username"
		name="username"
		on:change={handleChange}
		on:blur={handleChange}
		bind:value={$form.username}
	/>
	{#if $errors.username}
		<small>{$errors.username}</small>
	{/if}

	<label for="email">email</label>
	<input
		id="email"
		name="email"
		on:change={handleChange}
		on:blur={handleChange}
		bind:value={$form.email}
	/>
	{#if $errors.email}
		<small>{$errors.email}</small>
	{/if}

	<label for="password">password</label>
	<input
		id="password"
		name="password"
		on:change={handleChange}
		on:blur={handleChange}
		bind:value={$form.password}
	/>
	{#if $errors.password}
		<small>{$errors.password}</small>
	{/if}

	<button type="submit">submit</button>
</form>

<style>
	input,
	select,
	textarea {
		font-family: inherit;
		font-size: inherit;
		max-width: 400px;
		width: 100%;
		padding: 12px;
		box-sizing: border-box;
		border: 1px solid var(--grey);
		border-radius: 4px;
		transition: all 150ms ease;
		background: var(--white);
	}

	select {
		height: 45px;
	}

	input:focus,
	select:focus,
	textarea:focus {
		outline: none;
		box-shadow: 0 0 0 4px rgb(227, 227, 245);
		border-color: var(--grey);
	}

	input:disabled,
	select:disabled,
	textarea:disabled {
		color: #ccc;
	}

	button {
		color: #fff;
		background-color: var(--primary);
		border: none;
		text-transform: uppercase;
		letter-spacing: 1.8px;
		outline: none;
		border-radius: 4px;
		display: block;
		margin-top: 12px;
		line-height: 1.8;
		font-size: 12px;
		padding: 10px 18px;
		min-width: 120px;
		transition: all 150ms ease;
		cursor: pointer;
	}

	button:disabled {
		background-color: var(--grey);
	}

	button:focus:not(:disabled) {
		box-shadow: 0 0 0 4px var(--primary-light);
	}

	button:hover:not(:disabled) {
		background-color: var(--primary-dark);
	}

	label {
		display: block;
		color: var(--grey-dark);
		font-weight: bold;
		margin-top: 20px;
		margin-bottom: 4px;
		text-transform: uppercase;
		font-size: 12px;
		letter-spacing: 1.9px;
		line-height: 2;
	}

	/* used for errors */
	small {
		display: block;
		font-size: 12px;
		color: var(--red);
		margin-top: 10px;
	}
</style>
