import { serialize } from 'cookie';
import argon2 from 'argon2';
import { v4 as uuidv4 } from 'uuid';

import type { RequestHandler } from '@sveltejs/kit';

import prisma from '$lib/db';
import { redis } from '$src/lib/redis';
import type { FieldError } from '$src/types';
import { COOKIE_NAME, FORGOT_PASSWORD_PREFIX, NINETY_DAYS, SESSION_PREFIX } from '$src/constants';

export const post: RequestHandler = async (event) => {
	const { newPassword, token } = await event.request.json();
	let errors: FieldError[] = [];
	let user;

	//0. serverside validation
	if (newPassword.length > 128) {
		return {
			status: 400,
			body: {
				errors: [
					{
						field: 'newPassword',
						message: 'newPassword must be less than 128 characters'
					}
				]
			}
		};
	}
	if (token.length > 64) {
		return {
			status: 400,
			body: {
				errors: [
					{
						field: 'newPassword',
						message: 'invalid token'
					}
				]
			}
		};
	}

	// get user from redis by token, then delete token
	const key = FORGOT_PASSWORD_PREFIX + token;
	const userId = await redis.get(key);

	if (!userId) {
		return {
			status: 400,
			body: {
				errors: [
					{
						field: 'newPassword',
						message: 'No user found for this token'
					}
				]
			}
		};
	}

	await redis.del(key);

	// look for user in db, return error if not found
	try {
		user = await prisma.user.findUnique({
			where: { id: parseInt(userId) }
		});
	} catch (e) {
		console.log(e);
	}

	if (!user) {
		return {
			status: 400,
			body: {
				errors: [
					{
						field: 'newPassword',
						message: 'No user found for this token'
					}
				]
			}
		};
	}

	// update password in db
	try {
		user = await prisma.user.update({
			where: { id: parseInt(userId) },
			data: { password: await argon2.hash(newPassword) }
		});
	} catch (e) {
		console.log(e);
	}

	// Create session id and add to Redis
	const uuid = uuidv4();
	const sessionId = `${SESSION_PREFIX}${uuid}`;
	await redis.set(sessionId, user.id + '', 'EX', NINETY_DAYS);

	// set user in session for use in frontend
	// event.locals.user = { id: user?.id + '', username: user?.username, email: user?.email };

	// return cookie with session id to client
	return {
		status: 201,
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
			user: {
				id: user?.id,
				username: user?.username
			}
		}
	};
};
