/// <reference types="@sveltejs/kit" />

import type { User } from './types';

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	declare namespace App {
		interface Locals {
			user: User;
		}
		// interface Platform {}
		interface Session {
			user?: User;
		}
		// interface Stuff {}
	}
}
