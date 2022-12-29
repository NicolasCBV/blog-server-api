import { HttpProtocol } from "@errors/http/httpErrors";
import { postsFactory } from "@tests/factories/postsFactory";
import { PostsDatabase } from "@tests/inMemoryDatabases/posts/postsDatabase";
import { DeletePostService } from "./DeletePostService";

jest.mock("node:events");

describe("Delete test", () => {
  it("should be able to delete posts", async () => {
    const postsDatabase = new PostsDatabase();

    const post = postsFactory();

    await postsDatabase.create(post);

    const deletePost = new DeletePostService(postsDatabase);

    await deletePost.exec({
      id: post.id,
      admin: true,
    });

    const searchPost = await postsDatabase.searchForId(post.id);

    expect(searchPost).toEqual(null);
  });

  it("should throw one error: post doesn't exist", async () => {
    const postsDatabase = new PostsDatabase();

    const post = postsFactory();

    const deletePost = new DeletePostService(postsDatabase);

    expect(
      deletePost.exec({
        id: post.id,
        admin: true,
      })
    ).rejects.toThrowError(HttpProtocol);
  });

  it("should throw one error: user is not admin", async () => {
    const postsDatabase = new PostsDatabase();

    const post = postsFactory();

    const deletePost = new DeletePostService(postsDatabase);

    expect(
      deletePost.exec({
        id: post.id,
        admin: false,
      })
    ).rejects.toThrowError(HttpProtocol);
  });
});
