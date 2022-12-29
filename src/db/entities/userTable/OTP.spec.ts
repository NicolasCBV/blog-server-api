import { LengthError } from "@errors/http/LengthError";
import { OTP } from "./OTP";

describe("OTP test", () => {
  it("should be able to create one description", () => {
    expect(() => new OTP("test")).toBeTruthy();
  });

  it("should be able to create one OTP", () => {
    expect(() => new OTP(null)).toBeTruthy();
  });

  it("should throw one error", () => {
    expect(() => new OTP("t".repeat(257))).toThrowError(LengthError);
  });
});
