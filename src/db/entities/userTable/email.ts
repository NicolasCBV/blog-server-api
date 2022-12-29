import { LengthError } from "@errors/http/LengthError";

export class Email {
  private readonly email: string;

  get value(): string {
    return this.email;
  }

  private validateLength(email: string) {
    return email.length > 256;
  }

  constructor(email: string) {
    const result = this.validateLength(email);

    if (result) throw new LengthError();

    this.email = email;
  }
}
