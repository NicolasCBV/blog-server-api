import { JwtAdapter } from "@adapters/jwtAdapter/jwtAdapter";
import { NodemailerMailAdapter } from "@adapters/nodemailer/nodemailerAdapter";
import { UsersCacheRepo } from "@tests/inMemoryDatabases/user/cache/usersCache";
import { UsersDatabase } from "@tests/inMemoryDatabases/user/db/usersDatabase";
import { BcryptAdapter } from "@adapters/bcryptAdapter/bcryptAdapter";
import { LoginUserService } from "./LoginUserService";
import { usersFactory } from "@tests/factories/userFactory";
import { HttpProtocol } from "@errors/http/httpErrors";

jest.spyOn(JwtAdapter.prototype, "encode").mockReturnThis();

jest.mock("node:events");

describe("Login user test", () => {
  it("should be able to login the user", async () => {
    jest
      .spyOn(BcryptAdapter.prototype, "compare")
      .mockImplementation(async () => true);

    const userCacheRepo = new UsersCacheRepo();
    const userDatabase = new UsersDatabase();
    const jwt = new JwtAdapter();
    const bcryptAdapter = new BcryptAdapter();
    const nodemailer = new NodemailerMailAdapter();

    const user = await userDatabase.create(usersFactory());

    const loginUser = new LoginUserService(
      bcryptAdapter,
      nodemailer,
      userDatabase,
      jwt,
      userCacheRepo
    );

    expect(
      loginUser.exec({
        ip: "test/0.0.0.0/0",
        email: user.email.value,
        password: user.password.value,
      })
    ).resolves.toBeTruthy();
  });

  it("wrong password", async () => {
    const userCacheRepo = new UsersCacheRepo();
    const userDatabase = new UsersDatabase();
    const jwt = new JwtAdapter();
    const bcryptAdapter = new BcryptAdapter();
    const nodemailer = new NodemailerMailAdapter();

    const user = await userDatabase.create(usersFactory());

    const loginUser = new LoginUserService(
      bcryptAdapter,
      nodemailer,
      userDatabase,
      jwt,
      userCacheRepo
    );

    jest
      .spyOn(BcryptAdapter.prototype, "compare")
      .mockImplementation(async () => user.password.value === "wrong password");

    expect(async () => {
      await loginUser.exec({
        ip: "test/0.0.0.0/0",
        email: user.email.value,
        password: "wrong password",
      });
    }).rejects.toThrowError(HttpProtocol);
  });

  it("user disabled", async () => {
    const userCacheRepo = new UsersCacheRepo();
    const userDatabase = new UsersDatabase();
    const jwt = new JwtAdapter();
    const bcryptAdapter = new BcryptAdapter();
    const nodemailer = new NodemailerMailAdapter();

    const user = await userDatabase.create(usersFactory({ active: false }));

    const loginUser = new LoginUserService(
      bcryptAdapter,
      nodemailer,
      userDatabase,
      jwt,
      userCacheRepo
    );

    expect(async () => {
      await loginUser.exec({
        ip: "test/0.0.0.0/0",
        email: user.email.value,
        password: user.password.value,
      });
    }).rejects.toThrowError(HttpProtocol);
  });

  it("user doesn't exist", async () => {
    const userCacheRepo = new UsersCacheRepo();
    const userDatabase = new UsersDatabase();
    const jwt = new JwtAdapter();
    const bcryptAdapter = new BcryptAdapter();
    const nodemailer = new NodemailerMailAdapter();

    const loginUser = new LoginUserService(
      bcryptAdapter,
      nodemailer,
      userDatabase,
      jwt,
      userCacheRepo
    );

    expect(async () => {
      await loginUser.exec({
        ip: "test/0.0.0.0/0",
        email: "test@email.com",
        password: "1234",
      });
    }).rejects.toThrowError(HttpProtocol);
  });
});
