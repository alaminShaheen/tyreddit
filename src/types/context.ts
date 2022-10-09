import { Connection, EntityManager, IDatabaseDriver } from "@mikro-orm/core";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { Request, Response } from "express";

export type Context = {
	entityManager: EntityManager<PostgreSqlDriver> &
		EntityManager<IDatabaseDriver<Connection>>;
	request: Request;
	response: Response;
};

declare module "express-session" {
	export interface SessionData {
		userId?: number;
	}
}
