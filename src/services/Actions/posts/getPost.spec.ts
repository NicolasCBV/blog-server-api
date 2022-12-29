import { HttpProtocol } from "@errors/http/httpErrors";
import { postsFactory } from "@tests/factories/postsFactory";
import { usersFactory } from "@tests/factories/userFactory";
import { PostsDatabase } from "@tests/inMemoryDatabases/posts/postsDatabase";
import { UsersDatabase } from "@tests/inMemoryDatabases/user/db/usersDatabase";
import { GetPostService } from "./GetPostService";

describe("Get test", () => {
  it("should be able to get one post", async () => {
    const postsDatabase = new PostsDatabase();
    const userDatabase = new UsersDatabase();

    const user = await userDatabase.create(usersFactory());
    const post = await postsDatabase.create(
      postsFactory({ creatorId: user.id })
    );

    const getPost = new GetPostService(userDatabase, postsDatabase);

    const data = await getPost.exec({ id: post.id });

    expect(data).toBeTruthy();
  });

  it("should throw one error: user doesn't exist", async () => {
    const postsDatabase = new PostsDatabase();
    const userDatabase = new UsersDatabase();

    const post = await postsDatabase.create(postsFactory());

    const getPost = new GetPostService(userDatabase, postsDatabase);

    expect(getPost.exec({ id: post.id })).rejects.toThrowError(HttpProtocol);
  });

  it("should throw one error: post doesn't exist", async () => {
    const postsDatabase = new PostsDatabase();
    const userDatabase = new UsersDatabase();

    await userDatabase.create(usersFactory());

    const getPost = new GetPostService(userDatabase, postsDatabase);

    expect(getPost.exec({ id: "fake post id" })).rejects.toThrowError(
      HttpProtocol
    );
  });
});
