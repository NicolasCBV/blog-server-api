import { Description } from "@entities/userTable/description";
import { Email } from "@entities/userTable/email";
import { usersFactory } from "@tests/factories/userFactory";
import { UsersDatabase } from "./usersDatabase";

describe("Create test", () => {
  it("should be able to create users", async () => {
    const usersDatabase = new UsersDatabase();

    const user = usersFactory({
      email: new Email("test@email.com"),
      description: new Description("test"),
    });

    await usersDatabase.create(user);

    user.description = new Description("new test");

    await usersDatabase.update(user);

    const userOnStorage = await usersDatabase.search(
      new Email("test@email.com")
    );

    expect(userOnStorage?.description?.value).toEqual("new test");
  });
});
