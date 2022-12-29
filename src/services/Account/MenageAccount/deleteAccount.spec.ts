import { HttpProtocol } from "@errors/http/httpErrors";
import { usersFactory } from "@tests/factories/userFactory";
import { UsersCacheRepo } from "@tests/inMemoryDatabases/user/cache/usersCache";
import { UsersDatabase } from "@tests/inMemoryDatabases/user/db/usersDatabase";
import { DeleteAccountService } from "./DeleteAccountService";

describe("Delete accound", () => {
  it("should be delete one user", async () => {
    const userCacheRepositories = new UsersCacheRepo();
    const userDatabase = new UsersDatabase();

    const user = await userDatabase.create(usersFactory());

    const deleteAccount = new DeleteAccountService(
      userCacheRepositories,
      userDatabase
    );

    expect(
      deleteAccount.exec({ email: user.email.value })
    ).resolves.toBeUndefined();
  });

  it("should throw one error: user doesn't exist", async () => {
    const userCacheRepositories = new UsersCacheRepo();
    const userDatabase = new UsersDatabase();

    const deleteAccount = new DeleteAccountService(
      userCacheRepositories,
      userDatabase
    );

    expect(async () => {
      await deleteAccount.exec({ email: "test@email.com" });
    }).rejects.toThrowError(HttpProtocol);
  });
});
