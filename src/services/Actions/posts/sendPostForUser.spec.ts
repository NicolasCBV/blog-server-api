import { NodemailerMailAdapter } from "@adapters/nodemailer/nodemailerAdapter";
import { Name } from "@entities/postTable/name";
import { Email } from "@entities/userTable/email";
import { HttpProtocol } from "@errors/http/httpErrors";
import { postsFactory } from "@tests/factories/postsFactory";
import { usersFactory } from "@tests/factories/userFactory";
import { PostsDatabase } from "@tests/inMemoryDatabases/posts/postsDatabase";
import { UsersDatabase } from "@tests/inMemoryDatabases/user/db/usersDatabase";
import { SendPostForUsersService } from "./SendPostForUsersService";

jest
  .spyOn(NodemailerMailAdapter.prototype, "sendMail")
  .mockImplementation(async () => {});

describe("Get test", () => {
  it("should be able to send post", async () => {
    const postsDatabase = new PostsDatabase();
    const userDatabase = new UsersDatabase();
    const nodemailer = new NodemailerMailAdapter();

    const user = usersFactory({ admin: true });

    await userDatabase.create(user);
    await userDatabase.create(
      usersFactory({ email: new Email("test1@email.com"), admin: false })
    );
    await userDatabase.create(
      usersFactory({ email: new Email("test2@email.com"), admin: false })
    );

    const post = await postsDatabase.create(
      postsFactory({ creatorId: user.id, name: new Name("post 1") })
    );
    const sendPostForUsers = new SendPostForUsersService(
      userDatabase,
      postsDatabase,
      nodemailer
    );

    await sendPostForUsers.exec({
      postId: post.id,
      admin: user.admin,
    });

    expect(nodemailer.sendMail).toBeCalled();
  });

  it("should throw one error: post doesn't exist", async () => {
    const postsDatabase = new PostsDatabase();
    const userDatabase = new UsersDatabase();
    const nodemailer = new NodemailerMailAdapter();

    const user = usersFactory({ admin: true });

    await userDatabase.create(user);
    await userDatabase.create(
      usersFactory({ email: new Email("test1@email.com") })
    );

    const sendPostForUsers = new SendPostForUsersService(
      userDatabase,
      postsDatabase,
      nodemailer
    );

    expect(
      sendPostForUsers.exec({
        postId: "fake id",
        admin: user.admin,
      })
    ).rejects.toThrowError(HttpProtocol);
  });

  it("should throw one error: user is not admin", async () => {
    const postsDatabase = new PostsDatabase();
    const userDatabase = new UsersDatabase();
    const nodemailer = new NodemailerMailAdapter();

    const user = usersFactory({ admin: false });

    await userDatabase.create(user);
    await userDatabase.create(
      usersFactory({ email: new Email("test1@email.com") })
    );

    const post = await postsDatabase.create(
      postsFactory({ creatorId: user.id, name: new Name("post 1") })
    );
    const sendPostForUsers = new SendPostForUsersService(
      userDatabase,
      postsDatabase,
      nodemailer
    );

    expect(
      sendPostForUsers.exec({
        postId: post.id,
        admin: user.admin,
      })
    ).rejects.toThrowError(HttpProtocol);
  });

  it("should throw one error: the service doesn't have users to send email", async () => {
    const postsDatabase = new PostsDatabase();
    const userDatabase = new UsersDatabase();
    const nodemailer = new NodemailerMailAdapter();

    const user = usersFactory({ admin: true });

    await userDatabase.create(user);

    const post = await postsDatabase.create(
      postsFactory({ creatorId: user.id, name: new Name("post 1") })
    );

    const sendPostForUsers = new SendPostForUsersService(
      userDatabase,
      postsDatabase,
      nodemailer
    );

    expect(
      sendPostForUsers.exec({
        postId: post.id,
        admin: user.admin,
      })
    ).rejects.toThrowError(HttpProtocol);
  });
});
