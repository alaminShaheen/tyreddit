import { MikroORM } from "@mikro-orm/core";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import mikroOrmConfig from "../configs/mikro-orm.config";
import { Post } from "../entities/Post";

export class Database {
	public ormInstance: MikroORM<PostgreSqlDriver>;

	public async init() {
		try {
			this.ormInstance = await MikroORM.init<PostgreSqlDriver>(
				mikroOrmConfig,
				true,
			);
			await this.ormInstance.getMigrator().up();
		} catch (error) {
			console.log(error);
		}
	}

	public async check() {
		try {
			if (this.ormInstance) {
				const posts = await this.ormInstance.em.find(Post, {});
				console.log(posts);
			}
		} catch (error) {
			console.log(error);
		}
	}
}
