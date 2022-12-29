import { Email } from "@entities/userTable/email";
import { Users } from "@entities/userTable/_users";
import { usersFactory } from "@tests/factories/userFactory";
import { UsersDatabase } from "./usersDatabase";

describe("Create test", () => {
  it("should be able to create users", async () => {
    const usersDatabase = new UsersDatabase();

    const userReturn = await usersDatabase.create(
      usersFactory({ email: new Email("test@email.com") })
    );

    const user = await usersDatabase.searchForId(userReturn.id);

    expect(user).toBeInstanceOf(Users);
  });
});
