import { Arg, Ctx, Int, Mutation, Query, Resolver } from "type-graphql";
import { Post } from "../entities/Post";
import { Context } from "../types/context";

@Resolver()
export class PostResolver {
	@Query(() => [Post])
	posts(
		@Ctx()
		context: Context,
	): Promise<Post[]> {
		const { entityManager } = context;
		return entityManager.find(Post, {});
	}

	@Query(() => Post)
	post(
		@Arg("id", () => Int) id: number,
		@Ctx() context: Context,
	): Promise<Post | null> {
		const { entityManager } = context;
		return entityManager.findOne(Post, { id });
	}

	@Mutation(() => Post)
	async createPost(
		@Arg("title", () => String) title: string,
		@Ctx() context: Context,
	): Promise<Post | null> {
		try {
			const { entityManager } = context;
			const post = entityManager.create(Post, { title });
			await entityManager.persistAndFlush(post);
			return post;
		} catch (error) {
			console.log(error);
			return null;
		}
	}

	@Mutation(() => Post, { nullable: true })
	async updatePost(
		@Arg("id", () => Int) id: number,
		@Arg("title", () => String, { nullable: true }) title: string,
		@Ctx() context: Context,
	): Promise<Post | null> {
		try {
			const { entityManager } = context;
			const postToUpdate = await entityManager.findOne(Post, { id });

			if (!postToUpdate || title === undefined) {
				return null;
			}

			postToUpdate.title = title;
			await entityManager.persistAndFlush(postToUpdate);
			return postToUpdate;
		} catch (error) {
			console.log(error);
			return null;
		}
	}

	@Mutation(() => Boolean)
	async deletePost(
		@Arg("id", () => Int) id: number,
		@Ctx() context: Context,
	): Promise<boolean> {
		try {
			const { entityManager } = context;
			await entityManager.nativeDelete(Post, { id });
			return true;
		} catch (error) {
			console.log(error);
			return false;
		}
	}
}
