import { parse } from 'cookie';
import type { RequestHandler } from '@sveltejs/kit';

import prisma from '$lib/db';
import { redis } from '$lib/redis';

import { COOKIE_NAME } from '$src/constants';

// 1. get session id from the cookie
// 2. get the userid from redis
// 3. get the user from the db
// 4. return the user for frontend use
export const get: RequestHandler = async ({ request }) => {
	const cookies = request.headers.get('cookie');

	if (cookies) {
		const parsedCookies = parse(cookies);
		const sessionId = parsedCookies[COOKIE_NAME];

		const userId = await redis.get(sessionId);
		if (userId) {
			const user = await prisma.user.findUnique({
				where: { id: parseInt(userId) }
			});
			if (user) {
				const { password, createdAt, updatedAt, email, ...cleanUser } = user;
				return {
					body: {
						user: cleanUser
					}
				};
			}
		}
	}

	return {
		body: {}
	};
};
