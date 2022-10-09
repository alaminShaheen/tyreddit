import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { ApolloServer } from "apollo-server-express";
import connectRedis from "connect-redis";
import express from "express";
import session from "express-session";
import { createServer } from "http";
import { createClient } from "redis";
import { buildSchema } from "type-graphql";
import { ApplicationConstants } from "./constants/application-constants";
import { AuthenticationConstants } from "./constants/authentication-constants";
import { DatabaseConstants } from "./constants/database-constants";
import { Database } from "./database/database";
import { HelloResolver } from "./resolvers/hello-resolver";
import { PostResolver } from "./resolvers/post-resolver";
import { UserResolver } from "./resolvers/user-resolver";
import { Context } from "./types/context";

async function main() {
	try {
		const databaseInstance = new Database();
		await databaseInstance.init();

		const app = express();

		const RedisStore = connectRedis(session);
		const redisClient: any = createClient({
			legacyMode: true,
			socket: {
				port: Number(DatabaseConstants.REDIS_PORT),
				host: DatabaseConstants.REDIS_HOST,
			},
		});
		await redisClient.connect().catch(console.error);

		app.use(
			session({
				name: AuthenticationConstants.COOKIE_NAME,
				store: new RedisStore({
					client: redisClient,
					disableTouch: true,
				}),
				cookie: {
					maxAge: AuthenticationConstants.COOKIE_MAX_AGE,
					httpOnly: true,
					sameSite: "lax",
					secure: ApplicationConstants.__prod__,
				},
				saveUninitialized: false,
				secret: AuthenticationConstants.COOKIE_SECRET,
				resave: false,
			}),
		);

		const apolloServer = new ApolloServer({
			schema: await buildSchema({
				resolvers: [HelloResolver, PostResolver, UserResolver],
				validate: false,
			}),
			context: ({ req, res }): Context => ({
				entityManager: databaseInstance.ormInstance.em,
				request: req,
				response: res,
			}),
			plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
		});

		await apolloServer.start();

		apolloServer.applyMiddleware({
			app,
			cors: {
				credentials: true,
				origin: "https://studio.apollographql.com",
			},
		});

		const httpServer = createServer(app);

		httpServer.listen(ApplicationConstants.PORT, () => {
			console.log(
				`Server running on localhost:${ApplicationConstants.PORT}`,
			);
		});
	} catch (error) {
		console.log(error);
	}
}

void main();
