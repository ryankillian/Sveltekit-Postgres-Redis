<script lang="ts" context="module">
import { goto } from "$app/navigation";
import { session } from '$app/stores';
import { user as userStore } from '$src/stores';
import type { User } from "$src/types";
import type { Load } from "@sveltejs/kit";
import { onMount } from "svelte";

// main page goes to login if no cookie
// if cookie, go to user page

export const load: Load = async ({ fetch }) => {

	const response = await fetch('api/me');
	const data = await response.json();
	const user: User = data.user;
	
return {
  props: {
    user
  }
}}
</script>

<script lang="ts">
	export let user:User;

	onMount(async () => {
		if(!(Object.keys(user).length)) {
			await goto('/login');
		} else {
			$userStore = user;
			$session = user;
			await goto(`/${user.id}`);
		}
	});
</script>
