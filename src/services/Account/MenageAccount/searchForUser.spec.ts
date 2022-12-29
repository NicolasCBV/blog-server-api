import { HttpProtocol } from "@errors/http/httpErrors";
import { usersFactory } from "@tests/factories/userFactory";
import { UsersCacheRepo } from "@tests/inMemoryDatabases/user/cache/usersCache";
import { UsersDatabase } from "@tests/inMemoryDatabases/user/db/usersDatabase";
import { SearchForUserService } from "./SearchForUserService";

describe("Delete accound", () => {
  it("should be delete one user", async () => {
    const userCacheRepositories = new UsersCacheRepo();
    const userDatabase = new UsersDatabase();

    const user = await userDatabase.create(usersFactory());

    const searchForUserService = new SearchForUserService(
      userCacheRepositories,
      userDatabase
    );

    expect(
      searchForUserService.exec({
        email: user.email.value,
      })
    ).resolves.toBeTruthy();
  });

  it("should throw one error: user doesn't exist", async () => {
    const userCacheRepositories = new UsersCacheRepo();
    const userDatabase = new UsersDatabase();

    const searchForUserService = new SearchForUserService(
      userCacheRepositories,
      userDatabase
    );

    expect(async () => {
      await searchForUserService.exec({
        email: "fake email",
      });
    }).rejects.toThrowError(HttpProtocol);
  });
});
