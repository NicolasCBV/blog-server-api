import { Name } from "@entities/postTable/name";
import { HttpProtocol } from "@errors/http/httpErrors";
import { postsFactory } from "@tests/factories/postsFactory";
import { usersFactory } from "@tests/factories/userFactory";
import { PostsDatabase } from "@tests/inMemoryDatabases/posts/postsDatabase";
import { UsersDatabase } from "@tests/inMemoryDatabases/user/db/usersDatabase";
import fs from "fs";
import { UpdatePostService } from "./UpdatePostService";

jest.mock("fs");
jest.fn(fs.rename).mockImplementation(() => {});

describe("Get test", () => {
  it("should be able to update one posts", async () => {
    const postsDatabase = new PostsDatabase();
    const userDatabase = new UsersDatabase();

    const user = await userDatabase.create(usersFactory({ admin: true }));
    const { id, name, description, content } = await postsDatabase.create(
      postsFactory({ creatorId: user.id, name: new Name("test name") })
    );

    const updatePostService = new UpdatePostService(postsDatabase);

    await updatePostService.exec({
      id,
      admin: user.admin,
      name: "new name",
      description: "new description",
      content: "new content",
    });

    const newPostData = await postsDatabase.search("new name");

    expect(newPostData?.name.value).not.toEqual(name.value);
    expect(newPostData?.description.value).not.toEqual(description.value);
    expect(newPostData?.content).not.toEqual(content);
  });

  it("should throw one error: user is not authorized", async () => {
    const postsDatabase = new PostsDatabase();
    const userDatabase = new UsersDatabase();

    const user = await userDatabase.create(usersFactory({ admin: false }));
    const post = await postsDatabase.create(
      postsFactory({ creatorId: user.id, name: new Name("test name") })
    );

    const updatePostService = new UpdatePostService(postsDatabase);

    expect(
      updatePostService.exec({
        id: post.id,
        admin: user.admin,
        name: "new name",
        description: "new description",
        content: "new content",
      })
    ).rejects.toThrowError(HttpProtocol);
  });

  it("should throw one error: post doesn't exist", async () => {
    const postsDatabase = new PostsDatabase();
    const userDatabase = new UsersDatabase();

    const user = await userDatabase.create(usersFactory({ admin: true }));

    const updatePostService = new UpdatePostService(postsDatabase);

    expect(
      updatePostService.exec({
        id: "fake id",
        admin: user.admin,
        name: "fake name",
        description: "fake description",
        content: "fake content",
      })
    ).rejects.toThrowError(HttpProtocol);
  });
});
