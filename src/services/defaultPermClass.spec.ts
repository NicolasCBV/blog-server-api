import { UsersDatabase } from "@tests/inMemoryDatabases/user/db/usersDatabase";
import { UsersCacheRepo } from "@tests/inMemoryDatabases/user/cache/usersCache";
import { usersFactory } from "@tests/factories/userFactory";
import { Email } from "@entities/userTable/email";
import { UserObject } from "@mappers/redisUser";
import { DefaultPermClass } from "./defaultPermClass";
import { Users } from "@entities/userTable/_users";
import { HttpProtocol } from "@errors/http/httpErrors";

describe("DefaultPermClass test", () => {
  it("should be able to catch users on cache", async () => {
    const usersRepositories = new UsersDatabase();
    const userCacheRepo = new UsersCacheRepo();

    const userOnDB = usersFactory({ email: new Email("test@email.com") });
    await usersRepositories.create(userOnDB);

    await userCacheRepo.create({
      key: "user:test@email.com",
      value: JSON.stringify(UserObject.toRedis(userOnDB)),
    });

    const defaultPermClass = new DefaultPermClass();

    const user = await defaultPermClass.catchUserData({
      usersRepositories,
      userCacheRepositories: userCacheRepo,
      email: "test@email.com",
    });

    expect(user).toBeTruthy();
  });

  it("should be able to catch users on database", async () => {
    const usersRepositories = new UsersDatabase();
    const userCacheRepo = new UsersCacheRepo();

    const userOnDB = usersFactory({ email: new Email("test@email.com") });
    await usersRepositories.create(userOnDB);

    const defaultPermClass = new DefaultPermClass();

    const user = await defaultPermClass.catchUserData({
      usersRepositories,
      userCacheRepositories: userCacheRepo,
      email: "test@email.com",
    });

    expect(user).toBeInstanceOf(Users);
    expect(userCacheRepo.UsersDatabase).toHaveLength(1);
  });

  it("should throw one error", async () => {
    const usersRepositories = new UsersDatabase();
    const userCacheRepo = new UsersCacheRepo();

    const defaultPermClass = new DefaultPermClass();

    expect(
      defaultPermClass.catchUserData({
        usersRepositories,
        userCacheRepositories: userCacheRepo,
        email: "test@email.com",
      })
    ).rejects.toThrowError(HttpProtocol);
  });
});
