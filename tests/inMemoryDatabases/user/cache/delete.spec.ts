import { Email } from "@entities/userTable/email";
import { UserObject } from "@mappers/redisUser";
import { usersFactory } from "@tests/factories/userFactory";
import { UsersCacheRepo } from "./usersCache";
import { UsersDatabase } from "../db/usersDatabase";

describe("Delete test", () => {
  it("should be able to delete users", async () => {
    const userCacheRepo = new UsersCacheRepo();
    const usersDatabase = new UsersDatabase();

    const userReturn = await usersDatabase.create(
      usersFactory({ email: new Email("test@email.com") })
    );

    const user = UserObject.toRedis(userReturn);

    userCacheRepo.create({
      key: "user:test@email.com",
      value: JSON.stringify(user),
    });

    userCacheRepo.delete("user:test@email.com");

    expect(userCacheRepo.UsersDatabase).toEqual([]);
  });
});
