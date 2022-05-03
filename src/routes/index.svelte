<script lang="ts">
	async function sendEmail() {
		const response = await fetch(`api/email`);
		returnregisterSchema response.json();
	}
</script>

<h1>Main page for unlogged in folk</h1>
<h2>Logout page goes to Login page.</h2>
<button on:click={sendEmail}>Send email</button>
registerSchema
