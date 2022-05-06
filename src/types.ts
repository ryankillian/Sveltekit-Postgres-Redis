export type Typify<T> = { [K in keyof T]: Typify<T[K]> };
export interface ApiResponse<T> {
	status: number;
	body: {
		user?: T;
		errors?: FieldError[];
	};
	headers?: IncomingHttpHeaders;
}

export interface IncomingHttpHeaders {
	'cache-control'?: string | undefined;
	'Set-Cookie'?: string | undefined;
}
export interface ErrorResponse {
	success: false;
	data: undefined;
	error: Error;
}

export type FieldError = {
	field: string;
	message: string;
};

export interface User {
	id: string;
	username: string;
	email?: string;
}
