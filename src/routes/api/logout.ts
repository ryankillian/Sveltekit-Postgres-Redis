import type { RequestHandler } from '@sveltejs/kit';
import { parse, serialize } from 'cookie';

import { redis } from '$src/lib/redis';
import { COOKIE_NAME } from '$src/constants';

// 1. Remove session from redis
// 2. Remove cookie from browser
// Note:  Reset of client session happens on the client
export const get: RequestHandler = async ({ request }) => {
	const cookies = request.headers.get('cookie');

	if (cookies) {
		const parsedCookies = parse(cookies);
		const sessionId = parsedCookies[COOKIE_NAME];
		await redis.del(sessionId);
	}

	return {
		status: 303,
		headers: {
			'Set-Cookie': serialize(COOKIE_NAME, '', {
				path: '/',
				expires: new Date(0)
			}),
			location: '/login'
		}
	};
};
