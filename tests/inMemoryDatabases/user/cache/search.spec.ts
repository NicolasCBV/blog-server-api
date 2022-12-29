import { Email } from "@entities/userTable/email";
import { UserObject } from "@mappers/redisUser";
import { usersFactory } from "@tests/factories/userFactory";
import { UsersDatabase } from "../db/usersDatabase";
import { UsersCacheRepo } from "./usersCache";

describe("Search test", () => {
  it("should be able to search for users", async () => {
    const usersDatabase = new UsersDatabase();
    const userCacheRepo = new UsersCacheRepo();

    const userOnDB = await usersDatabase.create(
      usersFactory({ email: new Email("test@email.com") })
    );

    const prepareUserToBeCached = JSON.stringify(UserObject.toRedis(userOnDB));

    await userCacheRepo.create({
      key: "user:test@email.com",
      value: prepareUserToBeCached,
    });

    await userCacheRepo.search("user:test@email.com");

    expect(userCacheRepo.UsersDatabase).toHaveLength(1);
  });
});
