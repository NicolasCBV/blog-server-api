import { Description } from "@entities/userTable/description";
import { ToDomainPropsCache, UserObject } from "@mappers/redisUser";
import { usersFactory } from "@tests/factories/userFactory";
import { UsersDatabase } from "../db/usersDatabase";
import { UsersCacheRepo } from "./usersCache";

const userCacheRepo = new UsersCacheRepo();
const usersRepositories = new UsersDatabase();

describe("Create test", () => {
  it("should be able to create a user", async () => {
    const userOnDB = await usersRepositories.create(usersFactory());

    const userOnCache = UserObject.toRedis(userOnDB);
    await userCacheRepo.create({
      key: "user:test@email.com",
      value: JSON.stringify(userOnCache),
    });

    await userCacheRepo.search("user:test@email.com");

    expect(userCacheRepo.UsersDatabase).toHaveLength(1);
  });

  it("should be able to overlap the user", async () => {
    expect(userCacheRepo.UsersDatabase).toHaveLength(1);

    const rawUser = await userCacheRepo.search("user:test@email.com");

    if (!rawUser) throw new Error("User doesn't exist");

    const userOnCache: ToDomainPropsCache = UserObject.toDomain(
      JSON.parse(rawUser)
    );

    userOnCache.description = new Description("new description");

    await userCacheRepo.create({
      key: "user:test@email.com",
      value: JSON.stringify(UserObject.toRedis(userOnCache)),
    });

    const rawCheckUser = await userCacheRepo.search("user:test@email.com");
    const checkUser = UserObject.toDomain(JSON.parse(rawCheckUser as string));

    expect(checkUser?.description?.value).toEqual("new description");
  });
});
