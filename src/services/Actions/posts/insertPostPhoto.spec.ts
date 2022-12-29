import { Name } from "@entities/postTable/name";
import { HttpProtocol } from "@errors/http/httpErrors";
import { postsFactory } from "@tests/factories/postsFactory";
import { usersFactory } from "@tests/factories/userFactory";
import { PostsDatabase } from "@tests/inMemoryDatabases/posts/postsDatabase";
import { UsersDatabase } from "@tests/inMemoryDatabases/user/db/usersDatabase";
import { PostModel } from "@viewModel/postModel";
import { InsertPostPhotoService } from "./InsertPostPhotoService";

jest.mock("node:events");

describe("Get test", () => {
  it("should be able to insert photo on posts", async () => {
    const postsDatabase = new PostsDatabase();
    const userDatabase = new UsersDatabase();

    const user = await userDatabase.create(usersFactory({ admin: true }));
    const post = await postsDatabase.create(
      postsFactory({ creatorId: user.id, name: new Name("test name") })
    );

    const insertPostPhoto = new InsertPostPhotoService(postsDatabase);

    await insertPostPhoto.exec({
      admin: user.admin,
      post: PostModel.toHTTP(post),
      filename: "new filename",
      id: user.id,
    });

    const newPostData = await postsDatabase.search(post.name.value);

    expect(newPostData?.imageUrl).not.toEqual(post.imageUrl);
  });

  it("should throw one error: user is not authorized", async () => {
    const postsDatabase = new PostsDatabase();
    const userDatabase = new UsersDatabase();

    const user = await userDatabase.create(usersFactory({ admin: false }));
    const post = await postsDatabase.create(
      postsFactory({ creatorId: user.id, name: new Name("test name") })
    );

    const insertPostPhoto = new InsertPostPhotoService(postsDatabase);

    expect(
      insertPostPhoto.exec({
        admin: user.admin,
        post: PostModel.toHTTP(post),
        filename: "new filename",
        id: user.id,
      })
    ).rejects.toThrowError(HttpProtocol);
  });

  it("should throw one error: post doesn't exist", async () => {
    const postsDatabase = new PostsDatabase();
    const userDatabase = new UsersDatabase();

    const user = await userDatabase.create(usersFactory({ admin: true }));

    const insertPostPhoto = new InsertPostPhotoService(postsDatabase);

    expect(
      insertPostPhoto.exec({
        admin: user.admin,
        post: PostModel.toHTTP(postsFactory()),
        filename: "new filename",
        id: user.id,
      })
    ).rejects.toThrowError(HttpProtocol);
  });
});
