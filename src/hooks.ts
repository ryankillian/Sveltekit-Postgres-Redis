import type { GetSession, Handle } from '@sveltejs/kit';

export const getSession: GetSession = (event) => {
	console.log('getSession', event.locals.user);
	return event.locals.user
		? {
				user: {
					id: event.locals.user.id,
					name: event.locals.user.username,
					email: event.locals.user.email
				}
		  }
		: {};
};

export const handle: Handle = async ({ event, resolve }) => {
	console.log('handle', event.locals.user);

	const response = await resolve(event);

	return response;
};
