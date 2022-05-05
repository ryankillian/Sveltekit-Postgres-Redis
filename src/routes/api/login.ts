import type { RequestHandler } from '@sveltejs/kit';
import argon2 from 'argon2';
import { v4 as uuidv4 } from 'uuid';

import prisma from '$lib/db';
import { redis } from '$src/lib/redis';
import type { FieldError } from 'src/types';
import { COOKIE_NAME, NINETY_DAYS, SESSION_PREFIX, USER_ID } from '$src/constants';
import { serialize } from 'cookie';

export const post: RequestHandler = async (event) => {
	const { usernameOrEmail, password } = await event.request.json();
	let errors: FieldError[] = [];
	let user;
	console.log('usernameOrEmail', usernameOrEmail);
	//0. serverside validation
	if (usernameOrEmail.length < 3 || usernameOrEmail.length > 128) {
		return {
			body: {
				errors: [
					{
						field: 'username or ',
						message: 'user or email must be between 3 and 128 characters'
					}
				]
			}
		};
	}
	try {
		//	1. look for user, return error if not found
		user = await prisma.user.findUnique({
			where: usernameOrEmail.includes('@')
				? { email: usernameOrEmail }
				: { username: usernameOrEmail }
		});
	} catch (e) {
		console.log(e);
	}

	if (!user) {
		return {
			body: {
				errors: [
					{
						field: 'usernameOrEmail',
						message: 'user is not found'
					}
				]
			}
		};
	}
	// 2. compare password, return error if not match
	const valid = await argon2.verify(user.password, password);
	if (!valid) {
		return {
			body: {
				errors: [
					{
						field: 'password',
						message: 'password is not valid'
					}
				]
			}
		};
	}
	//3. set session id to redis
	const uuid = uuidv4();
	const sessionId = `${SESSION_PREFIX}${uuid}`;
	await redis.set(sessionId, user.id + '', 'EX', NINETY_DAYS);

	// 4. set user in session for use in frontend
	event.locals.user = { id: user?.id + '', username: user?.username, email: user?.email };

	// 5 return cookie with session id to client
	return {
		headers: {
			'Set-Cookie': serialize(COOKIE_NAME, sessionId, {
				path: '/',
				httpOnly: true,
				sameSite: 'strict',
				secure: process.env.NODE_ENV === 'production',
				maxAge: NINETY_DAYS
			})
		},
		body: {
			data: {
				id: user?.id,
				username: user?.username,
				email: user?.email
			}
		}
	};
};
