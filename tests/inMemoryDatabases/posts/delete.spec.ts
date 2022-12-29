import { postsFactory } from "@tests/factories/postsFactory";
import { PostsDatabase } from "./postsDatabase";

describe("Delete test", () => {
  it("should be able to delete posts", async () => {
    const postsDatabase = new PostsDatabase();

    const postReturn = await postsDatabase.create(postsFactory());

    await postsDatabase.delete(postReturn.id);
    const post = await postsDatabase.searchForId(postReturn.id);

    expect(post).toBeNull();
  });
});
