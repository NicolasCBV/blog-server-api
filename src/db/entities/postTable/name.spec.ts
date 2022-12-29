import { LengthError } from "@errors/http/LengthError";
import { Name } from "./name";

describe("Name test", () => {
  it("should be able to create one name", () => {
    expect(() => new Name("test")).toBeTruthy();
  });

  it("should throw one error - less characters", () => {
    expect(() => new Name("t".repeat(33))).toThrowError(LengthError);
  });
});
