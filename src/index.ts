import { ApolloServer } from "apollo-server-express";
import express from "express";
import { buildSchema } from "type-graphql";
import { ApplicationConstants } from "./constants/application-constants";
import { Database } from "./database/database";
import { HelloResolver } from "./resolvers/hello-resolver";
import { PostResolver } from "./resolvers/post-resolver";

async function main() {
	try {
		const databaseInstance = new Database();
		await databaseInstance.init();

		const app = express();

		const apolloServer = new ApolloServer({
			schema: await buildSchema({
				resolvers: [HelloResolver, PostResolver],
				validate: false,
			}),
			context: () => ({ entityManager: databaseInstance.ormInstance.em }),
		});

		await apolloServer.start();

		apolloServer.applyMiddleware({ app });

		app.listen(ApplicationConstants.port, () => {
			console.log(
				`Server running on localhost:${ApplicationConstants.port}`,
			);
		});
	} catch (error) {
		console.log(error);
	}
}

void main();
