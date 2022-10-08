import { Connection, EntityManager, IDatabaseDriver } from "@mikro-orm/core";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";

export type Context = {
	entityManager: EntityManager<PostgreSqlDriver> &
		EntityManager<IDatabaseDriver<Connection>>;
};
