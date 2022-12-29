import { usersFactory } from "../../../../tests/factories/userFactory";

describe("User test", () => {
  it("should be able to create one User", () => {
    expect(() => usersFactory()).toBeTruthy();
  });
});
