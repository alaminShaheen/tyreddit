import { Field, InputType } from "type-graphql";

@InputType()
export class RegisterRequestDto {
	@Field(() => String)
	username!: string;

	@Field(() => String)
	password!: string;
}
