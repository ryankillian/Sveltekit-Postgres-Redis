import { v4 as uuidv4 } from 'uuid';
import type { RequestHandler } from '@sveltejs/kit';

import prisma from '$lib/db';
import { redis } from '$src/lib/redis';
import type { FieldError } from 'src/types';
import { FORGOT_PASSWORD_PREFIX, THREE_DAYS } from '$src/constants';
import { sendEmail } from '$src/lib/utils/sendEmail';

export const post: RequestHandler = async (event) => {
	const { email } = await event.request.json();
	let errors: FieldError[] = [];
	let user;

	// serverside validation
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

	try {
		//	look for user, return if not found
		user = await prisma.user.findUnique({
			where: { email }
		});
	} catch (e) {
		console.log(e);
	}

	if (user) {
		// token to redis + send email to user
		const uuid = uuidv4();
		const forgotPasswordToken = `${FORGOT_PASSWORD_PREFIX}${uuid}`;
		await redis.set(forgotPasswordToken, user.id + '', 'EX', THREE_DAYS);

		await sendEmail(
			email,
			`<a href="http://localhost:3000/change-password/${uuid}">Reset Password</a>`
		);
	}

	return {
		body: {
			data: {
				email
			}
		}
	};
};
