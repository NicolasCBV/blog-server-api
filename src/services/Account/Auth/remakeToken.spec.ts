import { JwtAdapter } from "@adapters/jwtAdapter/jwtAdapter";
import { Email } from "@entities/userTable/email";
import { HttpProtocol } from "@errors/http/httpErrors";
import { usersFactory } from "@tests/factories/userFactory";
import { UsersCacheRepo } from "@tests/inMemoryDatabases/user/cache/usersCache";
import { UsersDatabase } from "@tests/inMemoryDatabases/user/db/usersDatabase";
import { RemakeTokenService } from "./RemakeTokenService";

jest.spyOn(JwtAdapter.prototype, "encode").mockReturnThis();
jest.mock("node:events");

describe("Remake token test", () => {
  it("should remake the token", async () => {
    const userCacheRepo = new UsersCacheRepo();
    const usersDatabase = new UsersDatabase();
    const jwtAdapter = new JwtAdapter();

    const user = await usersDatabase.create(
      usersFactory({ email: new Email("test@email.com") })
    );

    const remakeToken = new RemakeTokenService(
      userCacheRepo,
      usersDatabase,
      jwtAdapter
    );

    const token = await remakeToken.exec({ email: user.email.value });

    expect(token).toBeInstanceOf(JwtAdapter);
  });

  it("should throw one error: user doesn't exist", async () => {
    const userCacheRepo = new UsersCacheRepo();
    const usersDatabase = new UsersDatabase();
    const jwtAdapter = new JwtAdapter();

    const user = usersFactory();

    const remakeToken = new RemakeTokenService(
      userCacheRepo,
      usersDatabase,
      jwtAdapter
    );

    expect(async () => {
      await remakeToken.exec({ email: user.email.value });
    }).rejects.toThrowError(HttpProtocol);
  });

  it("should throw one error: email doesn't exist", async () => {
    const userCacheRepo = new UsersCacheRepo();
    const usersDatabase = new UsersDatabase();
    const jwtAdapter = new JwtAdapter();

    const remakeToken = new RemakeTokenService(
      userCacheRepo,
      usersDatabase,
      jwtAdapter
    );

    expect(async () => {
      await remakeToken.exec({ email: "" });
    }).rejects.toThrowError(HttpProtocol);
  });
});
