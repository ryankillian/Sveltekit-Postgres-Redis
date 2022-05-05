export type FieldError = {
	field: string;
	message: string;
};

export interface User {
	id: string;
	username: string;
	email?: string;
}
