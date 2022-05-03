import type { RequestHandler } from '@sveltejs/kit';
import { Prisma } from '@prisma/client';
import argon2 from 'argon2';
import { serialize } from 'cookie';
import { v4 as uuidv4 } from 'uuid';

import prisma from '$lib/db';
import { redis } from '$lib/redis';
import { COOKIE_NAME, SESSION_PREFIX, USER_ID } from '$src/constants';
import type { FieldError } from 'src/types';

export const post: RequestHandler = async ({ request }) => {
	const { username, email, password } = await request.json();
	let user;

	// 1. severside validation
	if (username.length < 3 || username.length > 64) {
		return {
			body: {
				errors: [
					{
						field: 'username',
						message: 'user must be between 3 and 64 characters'
					}
				]
			}
		};
	}

	if (username.includes('@')) {
		return {
			body: {
				errors: [
					{
						field: 'username',
						message: 'username must not contain an @ symbol'
					}
				]
			}
		};
	}

	if (email.length < 3 || email.length > 64 || !email.includes('@')) {
		return {
			body: {
				errors: [
					{
						field: 'email',
						message: 'invalid email'
					}
				]
			}
		};
	}

	if (password.length < 3 || password.length > 128) {
		return {
			body: {
				errors: [
					{
						field: 'password',
						message: 'password must be between 3 and 128 characters'
					}
				]
			}
		};
	}

	// 2. Create user
	try {
		const hashedPassword = await argon2.hash(password);
		user = await prisma.user.create({
			data: {
				username,
				email,
				password: hashedPassword
			}
		});
		console.log(user);
	} catch (e) {
		// return if either email or username is already taken
		if (e instanceof Prisma.PrismaClientKnownRequestError) {
			if (e.code === 'P2002') {
				const field = e.meta?.target as string;
				const error: FieldError = {
					field,
					message: `${field} already taken`
				};
				return {
					body: {
						errors: [error]
					}
				};
			}
		}
		throw e;
	}
	// 3. create session id and add to Redis
	const uuid = uuidv4();
	const sessionId = `${SESSION_PREFIX}${uuid}`;
	await redis.hset(sessionId, USER_ID, user.id + '');

	// 4. Set cookie on client with session id
	return {
		headers: {
			'Set-Cookie': serialize(COOKIE_NAME, sessionId, {
				path: '/',
				httpOnly: true,
				sameSite: 'strict',
				secure: process.env.NODE_ENV === 'production',
				maxAge: 60 * 60 * 24 * 7 // one week
			})
		},
		body: {
			data: {
				id: user?.id,
				username,
				email
			}
		}
	};
};
