import { Migration } from "@mikro-orm/migrations";

export class Migration20221009060555 extends Migration {
	async up(): Promise<void> {
		this.addSql(
			'create table "user" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "username" text not null, "password" text not null);',
		);
		this.addSql(
			'alter table "user" add constraint "user_username_unique" unique ("username");',
		);

		this.addSql(
			'alter table "post" alter column "created_at" drop default;',
		);
		this.addSql(
			'alter table "post" alter column "created_at" type timestamptz(0) using ("created_at"::timestamptz(0));',
		);
		this.addSql(
			'alter table "post" alter column "updated_at" drop default;',
		);
		this.addSql(
			'alter table "post" alter column "updated_at" type timestamptz(0) using ("updated_at"::timestamptz(0));',
		);
	}

	async down(): Promise<void> {
		this.addSql('drop table if exists "user" cascade;');

		this.addSql(
			'alter table "post" alter column "created_at" type timestamptz using ("created_at"::timestamptz);',
		);
		this.addSql(
			'alter table "post" alter column "created_at" set default now();',
		);
		this.addSql(
			'alter table "post" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);',
		);
		this.addSql(
			'alter table "post" alter column "updated_at" set default now();',
		);
	}
}
