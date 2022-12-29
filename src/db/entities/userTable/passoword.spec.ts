import { LengthError } from "@errors/http/LengthError";
import { Password } from "./password";

describe("Password test", () => {
  it("should be able to create one password", () => {
    expect(() => new Password("test")).toBeTruthy();
  });

  it("should throw one error", () => {
    expect(() => new Password("t".repeat(257))).toThrowError(LengthError);
  });
});
