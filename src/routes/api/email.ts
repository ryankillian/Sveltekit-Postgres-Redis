import type { RequestHandler } from '@sveltejs/kit';
import { sendEmail } from '$lib/utils/sendEmail';

export const get: RequestHandler = async ({ request }) => {
	await sendEmail('bob@bob.com', 'Hello friend');
	return {
		status: 200
	};
};
