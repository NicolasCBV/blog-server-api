import { LengthError } from "@errors/http/LengthError";

export class Name {
  private readonly name: string;

  get value(): string {
    return this.name;
  }

  private validateLength(name: string) {
    return name.length < 2 || name.length > 64;
  }

  constructor(name: string) {
    const result = this.validateLength(name);

    if (result) throw new LengthError();

    this.name = name;
  }
}
