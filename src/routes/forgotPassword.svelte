

<script lang="ts">
	// @ts-nocheck
  import { emailSchema } from '$lib/schema';
  import { toErrorMap } from '$lib/utils/toErrorMap';
  import { createForm } from 'svelte-forms-lib';

  let isComplete: boolean = false;
  let email: string = '';

	const { form, errors, handleChange, handleSubmit } = createForm({
		initialValues: {
			email: ''
		},
		validationSchema: emailSchema,
		onSubmit: async (values) => {
			const result = await fetchData(values);

			if (result.errors) {
				$errors = toErrorMap(result.errors);
			} else {
        email = values.email;
				isComplete = true;
			}
		}
	});

	async function fetchData(values) {
		const response = await fetch(`api/forgotPassword`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(values)
		});
		return await response.json();
	}
</script>

<h1>Forgot Password</h1>
{#if isComplete}
  <p>
      An email has been sent to {email} with a link to reset your password.
  </p>
{:else}
<form on:submit={handleSubmit}>
	<label for="email">Email</label>
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

	<button type="submit">submit</button>
</form>
{/if}

<style>
	input{
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

	input:focus {
		outline: none;
		box-shadow: 0 0 0 4px rgb(227, 227, 245);
		border-color: var(--grey);
	}

	input:disabled{
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
