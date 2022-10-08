import { Entity, OptionalProps, PrimaryKey, Property } from "@mikro-orm/core";

@Entity()
export class Post {
	[OptionalProps]?: "updatedAt" | "createdAt";

	@PrimaryKey({ autoincrement: true })
	id!: number;

	@Property({ onCreate: () => new Date() })
	createdAt: Date;

	@Property({ onUpdate: () => new Date(), onCreate: () => new Date() })
	updatedAt: Date;

	@Property({ type: "text" })
	title!: string;

	constructor(title: string) {
		this.title = title;
	}
}
