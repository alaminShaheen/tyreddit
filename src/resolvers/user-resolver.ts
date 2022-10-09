import argon2 from "argon2";
import { Arg, Ctx, Mutation } from "type-graphql";
import { AuthenticationConstants } from "../constants/authentication-constants";
import { LoginRequestDto } from "../dtos/request/login-request-dto";
import { RegisterRequestDto } from "../dtos/request/register-request-dto";
import { UserResponseDto } from "../dtos/response/user-response-dto";
import { User } from "../entities/User";
import { Context } from "../types/context";

export class UserResolver {
	@Mutation(() => UserResponseDto)
	async register(
		@Arg("body", () => RegisterRequestDto) body: RegisterRequestDto,
		@Ctx() context: Context,
	): Promise<UserResponseDto> {
		try {
			const { entityManager } = context;
			const { username, password } = body;

			if (username.length < AuthenticationConstants.usernameMinLength) {
				return {
					errors: [
						{
							field: "username",
							message: `Username cannot be less than ${AuthenticationConstants.usernameMinLength}`,
						},
					],
				};
			} else if (
				password.length < AuthenticationConstants.passwordMinlength
			) {
				return {
					errors: [
						{
							field: "password",
							message: `Password cannot be less than ${AuthenticationConstants.passwordMinlength}`,
						},
					],
				};
			}

			const userExists = await entityManager.findOne(User, { username });

			if (userExists) {
				return {
					errors: [
						{
							field: "username",
							message: "Username already taken",
						},
					],
				};
			}

			const hashedPassword = await argon2.hash(password);

			const user = entityManager.create(User, {
				username,
				password: hashedPassword,
			});

			await entityManager.persistAndFlush(user);

			return {
				user,
			};
		} catch (error) {
			console.log(error);

			return {
				errors: [
					{
						field: "",
						message: "Internal server error",
					},
				],
			};
		}
	}

	@Mutation(() => UserResponseDto)
	async login(
		@Arg("body", () => LoginRequestDto) body: LoginRequestDto,
		@Ctx() context: Context,
	): Promise<UserResponseDto> {
		try {
			const { entityManager } = context;
			const { username, password } = body;

			const user = await entityManager.findOne(User, { username });

			if (!user) {
				return {
					errors: [
						{
							field: "username",
							message: "Username does not exist",
						},
					],
				};
			}

			const validPassword = await argon2.verify(user.password, password);

			if (!validPassword) {
				return {
					errors: [
						{
							field: "password",
							message: "Invalid username or password",
						},
					],
				};
			}

			return { user };
		} catch (error) {
			console.log(error);

			return {
				errors: [
					{
						field: "",
						message: "Internal server error",
					},
				],
			};
		}
	}
}
