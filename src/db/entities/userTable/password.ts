import { LengthError } from "@errors/http/LengthError";

export class Password {
  private readonly password: string;

  get value(): string {
    return this.password;
  }

  private validateLength(password: string) {
    return password.length > 256;
  }

  constructor(password: string) {
    const result = this.validateLength(password);

    if (result) throw new LengthError();

    this.password = password;
  }
}
