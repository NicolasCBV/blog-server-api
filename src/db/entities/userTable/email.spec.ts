import { LengthError } from "@errors/http/LengthError";
import { Email } from "./email";

describe("Email test", () => {
  it("should be able to create one email", () => {
    expect(() => new Email("test")).toBeTruthy();
  });

  it("should throw one error", () => {
    expect(() => new Email("t".repeat(257))).toThrowError(LengthError);
  });
});
