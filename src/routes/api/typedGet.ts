import type { RequestHandler } from '@sveltejs/kit';

import type { Typify, User } from '$src/types';
import { serialize } from 'cookie';
import { COOKIE_NAME, NINETY_DAYS } from '$src/constants';

// Typescript hack
type OutputType = Typify<{ user: User }>;
type Params = { id: string };

export const get: RequestHandler<Params, OutputType> = async ({ request }) => {
	const user = {
		id: '1',
		username: 'bob',
		email: ''
	};
	return {
		status: 200,
		body: {
			user
		},
		headers: {
			'Set-Cookie': serialize(COOKIE_NAME, '123', {
				path: '/',
				httpOnly: true,
				sameSite: 'strict',
				secure: process.env.NODE_ENV === 'production',
				maxAge: NINETY_DAYS
			})
		}
	};
};
