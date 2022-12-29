import { LengthError } from "@errors/http/LengthError";
import { Description } from "./description";

describe("Description test", () => {
  it("should be able to create one description", () => {
    expect(() => new Description("test")).toBeTruthy();
  });

  it("should throw one error", () => {
    expect(() => new Description("t".repeat(47))).toThrowError(LengthError);
  });
});
