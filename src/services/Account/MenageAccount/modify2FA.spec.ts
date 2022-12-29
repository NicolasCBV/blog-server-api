import { JwtAdapter } from "@adapters/jwtAdapter/jwtAdapter";
import { Email } from "@entities/userTable/email";
import { HttpProtocol } from "@errors/http/httpErrors";
import { UserObject } from "@mappers/redisUser";
import { usersFactory } from "@tests/factories/userFactory";
import { UsersCacheRepo } from "@tests/inMemoryDatabases/user/cache/usersCache";
import { UsersDatabase } from "@tests/inMemoryDatabases/user/db/usersDatabase";
import { Modify2FAService } from "./Modify2FAService";

jest.spyOn(JwtAdapter.prototype, "encode").mockReturnThis();

jest.spyOn(UsersCacheRepo.prototype, "create");

jest.mock("node:events");

describe("Modify 2FA test", () => {
  it("should be able to modify a TFA status of one user", async () => {
    const userCacheRepositories = new UsersCacheRepo();
    const userDatabase = new UsersDatabase();
    const jwtAdapter = new JwtAdapter();

    const user = usersFactory({
      email: new Email("test@email.com"),
      accept2FA: false,
    });

    await userDatabase.create(user);

    const modify2FAService = new Modify2FAService(
      userCacheRepositories,
      userDatabase,
      jwtAdapter
    );

    await modify2FAService.exec({
      email: user.email.value,
      newStatus: true,
    });

    expect(userCacheRepositories.create).toBeCalled();

    const rawNewUser = await userCacheRepositories.search(
      "user:test@email.com"
    );
    const newUser = UserObject.toDomain(JSON.parse(rawNewUser as string));

    expect(newUser.accept2FA).toEqual(true);
  });

  it("should throw one error: user doesn't exist", async () => {
    const userCacheRepositories = new UsersCacheRepo();
    const userDatabase = new UsersDatabase();
    const jwtAdapter = new JwtAdapter();

    const modify2FAService = new Modify2FAService(
      userCacheRepositories,
      userDatabase,
      jwtAdapter
    );

    expect(async () => {
      await modify2FAService.exec({
        email: "fake email",
        newStatus: true,
      });
    }).rejects.toThrowError(HttpProtocol);
  });
});
