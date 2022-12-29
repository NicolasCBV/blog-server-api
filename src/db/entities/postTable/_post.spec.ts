import { postsFactory } from "@tests/factories/postsFactory";

describe("User test", () => {
  it("should be able to create one User", () => {
    expect(() => postsFactory()).toBeTruthy();
  });
});
