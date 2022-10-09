import { Entity, OptionalProps, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, Int, ObjectType } from "type-graphql";

@ObjectType()
@Entity()
export class User {
	[OptionalProps]?: "updatedAt" | "createdAt";

	@PrimaryKey({ autoincrement: true })
	@Field(() => Int)
	id!: number;

	@Property({ onCreate: () => new Date() })
	@Field(() => String)
	createdAt: Date;

	@Property({ onUpdate: () => new Date(), onCreate: () => new Date() })
	@Field(() => String)
	updatedAt: Date;

	@Property({ type: "text", unique: true })
	@Field(() => String)
	username!: string;

	@Property({ type: "text" })
	password!: string;

	constructor(username: string, password: string) {
		this.username = username;
		this.password = password;
	}
}
