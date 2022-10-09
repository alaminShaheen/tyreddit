import { Field, ObjectType } from "type-graphql";
import { User } from "../../entities/User";
import { FieldError } from "../error/field-error";

@ObjectType()
export class UserResponseDto {
	@Field(() => [FieldError], { nullable: true })
	errors?: FieldError[];

	@Field(() => User, { nullable: true })
	user?: User;
}
