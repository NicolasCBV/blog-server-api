import { NodemailerMailAdapter } from "@adapters/nodemailer/nodemailerAdapter";
import { Posts } from "@entities/postTable/_posts";
import { HttpProtocol } from "@errors/http/httpErrors";
import { PostsDatabase } from "@tests/inMemoryDatabases/posts/postsDatabase";
import { UsersDatabase } from "@tests/inMemoryDatabases/user/db/usersDatabase";
import { randomUUID } from "crypto";
import { CreatePostService } from "./CreatePostService";

jest.mock("node:events");

describe("Create test", () => {
  it("should be able to create posts", async () => {
    const postsDatabase = new PostsDatabase();
    const usersDatabase = new UsersDatabase();
    const nodemailer = new NodemailerMailAdapter();

    const postId = await new CreatePostService(
      postsDatabase,
      usersDatabase,
      nodemailer
    ).exec({
      admin: true,
      name: "new post",
      content: "new content",
      desc: "new description",
      creatorId: randomUUID(),
    });

    const post = await postsDatabase.searchForId(postId);

    expect(post).toBeInstanceOf(Posts);
  });

  it("should throw one error: name length to long", async () => {
    const postsDatabase = new PostsDatabase();
    const usersDatabase = new UsersDatabase();
    const nodemailer = new NodemailerMailAdapter();

    const createPost = new CreatePostService(
      postsDatabase,
      usersDatabase,
      nodemailer
    );

    expect(
      createPost.exec({
        admin: true,
        name: "a".repeat(33),
        content: "new content",
        desc: "new description",
        creatorId: randomUUID(),
      })
    ).rejects.toThrowError(HttpProtocol);
  });

  it("should throw one error: description length to long", async () => {
    const postsDatabase = new PostsDatabase();
    const usersDatabase = new UsersDatabase();
    const nodemailer = new NodemailerMailAdapter();

    const createPost = new CreatePostService(
      postsDatabase,
      usersDatabase,
      nodemailer
    );

    expect(
      createPost.exec({
        admin: true,
        name: "new post",
        content: "new content",
        desc: "a".repeat(47),
        creatorId: randomUUID(),
      })
    ).rejects.toThrowError(HttpProtocol);
  });

  it("should throw one error: creator id doesn't exist", async () => {
    const postsDatabase = new PostsDatabase();
    const usersDatabase = new UsersDatabase();
    const nodemailer = new NodemailerMailAdapter();

    const createPost = new CreatePostService(
      postsDatabase,
      usersDatabase,
      nodemailer
    );

    expect(
      createPost.exec({
        admin: true,
        name: "new post",
        content: "new content",
        desc: "new description",
        creatorId: "",
      })
    ).rejects.toThrowError(HttpProtocol);
  });
});
