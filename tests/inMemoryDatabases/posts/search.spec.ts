import { Name } from "@entities/postTable/name";
import { Posts } from "@entities/postTable/_posts";
import { postsFactory } from "@tests/factories/postsFactory";
import { PostsDatabase } from "./postsDatabase";

describe("Search test", () => {
  it("should be able to search for posts", async () => {
    const postsDatabase = new PostsDatabase();

    await postsDatabase.create(postsFactory({ name: new Name("random name") }));

    const posts = await postsDatabase.search("random name");

    expect(posts).toBeInstanceOf(Posts);
  });
});
