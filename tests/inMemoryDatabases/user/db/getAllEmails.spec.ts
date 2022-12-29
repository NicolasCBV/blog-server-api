import { Email } from "@entities/userTable/email";
import { usersFactory } from "@tests/factories/userFactory";
import { UsersDatabase } from "./usersDatabase";

describe("Create test", () => {
  it("should be able to create users", async () => {
    const usersDatabase = new UsersDatabase();

    await usersDatabase.create(
      usersFactory({ email: new Email("test1@email.com"), admin: false })
    );

    await usersDatabase.create(
      usersFactory({ email: new Email("test2@email.com"), admin: false })
    );

    await usersDatabase.create(
      usersFactory({ email: new Email("test3@email.com"), admin: false })
    );

    const users = await usersDatabase.GetAllEmailUsers();

    expect(users).toHaveLength(3);
  });
});
