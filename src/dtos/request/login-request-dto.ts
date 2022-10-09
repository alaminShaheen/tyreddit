import { Field, InputType } from "type-graphql";

@InputType()
export class LoginRequestDto {
	@Field(() => String)
	username!: string;

	@Field(() => String)
	password!: string;
}