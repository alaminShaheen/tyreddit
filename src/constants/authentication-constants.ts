export const AuthenticationConstants = {
	USERNAME_MIN_LENGTH: 2,
	PASSWORD_MIN_LENGTH: 3,
	COOKIE_NAME: "qid",
	COOKIE_SECRET: process.env.COOKIE_SECRET || "keyboard warrior",
	COOKIE_MAX_AGE: 1000 * 60 * 60 * 24 * 365 * 10,
};
