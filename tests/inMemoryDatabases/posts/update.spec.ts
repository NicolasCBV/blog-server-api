import { Description } from "@entities/postTable/description";
import { postsFactory } from "@tests/factories/postsFactory";
import { PostsDatabase } from "./postsDatabase";

describe("Create test", () => {
  it("should be able to update posts", async () => {
    const postsDatabase = new PostsDatabase();

    const post = postsFactory();

    const { name, description } = await postsDatabase.create(post);

    post.description = new Description("new test");

    await postsDatabase.update(post);

    const postOnStorage = await postsDatabase.search(name.value);

    expect(postOnStorage?.description?.value).not.toEqual(description?.value);
  });
});
