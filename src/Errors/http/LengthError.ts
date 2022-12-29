import BaseError from "..";

export class LengthError extends BaseError {
  constructor(
    name = "Length error",
    status = process.env.CONFLICT as string,
    desc = "Incorrect length on string variable"
  ) {
    super(name, status, desc);
  }
}
