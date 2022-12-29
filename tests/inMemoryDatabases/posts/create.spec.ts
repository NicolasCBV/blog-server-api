import { Posts } from "@entities/postTable/_posts";
import { postsFactory } from "@tests/factories/postsFactory";
import { PostsDatabase } from "./postsDatabase";

describe("Create test", () => {
  it("should be able to create posts", async () => {
    const postsDatabase = new PostsDatabase();

    const postReturn = await postsDatabase.create(postsFactory());

    const post = await postsDatabase.searchForId(postReturn.id);

    expect(post).toBeInstanceOf(Posts);
  });
});
