import { Posts } from "@entities/postTable/_posts";
import { postsFactory } from "@tests/factories/postsFactory";
import { PostsDatabase } from "./postsDatabase";

describe("Search test", () => {
  it("should be able to search for posts using id", async () => {
    const postsDatabase = new PostsDatabase();

    const post = await postsDatabase.create(postsFactory());

    const newPost = await postsDatabase.searchForId(post.id);

    expect(newPost).toBeInstanceOf(Posts);
  });
});
