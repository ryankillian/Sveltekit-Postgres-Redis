import * as yup from 'yup';

export const registerSchema = yup.object().shape({
	username: yup.string().required(),
	email: yup.string().email().required(),
	password: yup.string().required()
});

export const loginSchema = yup.object().shape({
	usernameOrEmail: yup.string().required(),
	password: yup.string().required()
});

export const emailSchema = yup.object().shape({
	email: yup.string().email().required()
});

export const newPasswordSchema = yup.object().shape({
	newPassword: yup.string().required()
});
