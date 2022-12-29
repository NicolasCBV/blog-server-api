import { Name } from "@entities/postTable/name";
import { postsFactory } from "@tests/factories/postsFactory";
import { PostsDatabase } from "./postsDatabase";

describe("Search test", () => {
  it("should be able to search for one group of posts", async () => {
    const postsDatabase = new PostsDatabase();

    for (let i = 0; i < 10; i++) {
      await postsDatabase.create(
        postsFactory({ name: new Name("a".repeat(i)) })
      );
    }

    const posts = await postsDatabase.getGroup();

    expect(posts).toHaveLength(5);
  });
});
