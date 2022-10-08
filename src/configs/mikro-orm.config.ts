import { Options } from "@mikro-orm/core";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import * as dotenv from "dotenv";
import path from "path";
import { ApplicationConstants } from "../constants/application-constants";
import { DatabaseConstants } from "../constants/database-constants";

dotenv.config();

export default {
	dbName: DatabaseConstants.DB_NAME,
	type: "postgresql",
	debug: !ApplicationConstants.__prod__,
	entities: ["./dist/entities/*.js"],
	entitiesTs: ["./src/entities/*.ts"],
	port: Number(DatabaseConstants.DB_PORT),
	user: DatabaseConstants.DB_USER,
	password: DatabaseConstants.DB_PASSWORD,
	allowGlobalContext: true,
	migrations: {
		path: path.join(__dirname, "./migrations"), // path to the folder with migrations
		pathTs: "./src/migrations", // path to the folder with TS migrations (if used, we should put path to compiled files in `path`)
	},
} as Options<PostgreSqlDriver>;
