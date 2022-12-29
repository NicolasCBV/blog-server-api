import { HttpProtocol } from "@errors/http/httpErrors";
import { postsFactory } from "@tests/factories/postsFactory";
import { PostsDatabase } from "@tests/inMemoryDatabases/posts/postsDatabase";
import { CheckPostExistenceService } from "./CheckPostExistenceService";

describe("Check post test", () => {
  it("should be able to check posts", async () => {
    const postsDatabase = new PostsDatabase();

    const post = postsFactory();

    await postsDatabase.create(post);

    const checkPostExistence = new CheckPostExistenceService(postsDatabase);

    const checkedPost = await checkPostExistence.exec({ id: post.id });

    expect(checkedPost).toBeTruthy();
  });

  it("should throw one error: ", async () => {
    const postsDatabase = new PostsDatabase();

    const post = postsFactory();

    const checkPostExistence = new CheckPostExistenceService(postsDatabase);

    expect(checkPostExistence.exec({ id: post.id })).rejects.toThrowError(
      HttpProtocol
    );
  });
});
