import { usersFactory } from "@tests/factories/userFactory";
import { UsersDatabase } from "./usersDatabase";

describe("Delete test", () => {
  it("should be able to delete users", async () => {
    const usersDatabase = new UsersDatabase();

    const userReturn = await usersDatabase.create(usersFactory());

    await usersDatabase.delete(userReturn.id);
    const user = await usersDatabase.searchForId(userReturn.id);

    expect(user).toBeNull();
  });
});
