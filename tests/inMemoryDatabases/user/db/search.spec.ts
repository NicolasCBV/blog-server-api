import { Email } from "@entities/userTable/email";
import { Users } from "@entities/userTable/_users";
import { usersFactory } from "@tests/factories/userFactory";
import { UsersDatabase } from "./usersDatabase";

describe("Search test", () => {
  it("should be able to search for users", async () => {
    const usersDatabase = new UsersDatabase();

    await usersDatabase.create(
      usersFactory({ email: new Email("test@email.com") })
    );

    const user = await usersDatabase.search(new Email("test@email.com"));

    expect(user).toBeInstanceOf(Users);
  });
});
