import { BcryptAdapter } from "@adapters/bcryptAdapter/bcryptAdapter";
import { Email } from "@entities/userTable/email";
import { Password } from "@entities/userTable/password";
import { UserObject } from "@mappers/redisUser";
import { usersFactory } from "@tests/factories/userFactory";
import { UsersCacheRepo } from "@tests/inMemoryDatabases/user/cache/usersCache";
import { UsersDatabase } from "@tests/inMemoryDatabases/user/db/usersDatabase";
import { ConfirmChangePasswordService } from "./ConfirmChangePasswordService";

jest.mock("node:events");

jest.mock("bcrypt", () => ({
  compare: jest.fn().mockReturnValue(true),
  hash: jest.fn().mockReturnValue("password"),
}));

describe("Confirm change password test", () => {
  it("should be able to change password of users", async () => {
    const userCacheRepositories = new UsersCacheRepo();
    const userDatabase = new UsersDatabase();
    const bcrypt = new BcryptAdapter();

    const user = await userDatabase.create(
      usersFactory({
        email: new Email("test@email.com"),
        password: new Password("random password"),
      })
    );

    const confirmChangePassoword = new ConfirmChangePasswordService(
      userDatabase,
      userCacheRepositories,
      bcrypt
    );

    await confirmChangePassoword.exec({
      email: user.email.value,
      password: user.password.value,
    });

    const rawNewUser = await userCacheRepositories.search(
      "user:test@email.com"
    );

    const { password: newPassord } = UserObject.toDomain(
      JSON.parse(rawNewUser as string)
    );

    expect(newPassord.value).toEqual("password");
  });
});
