import { LengthError } from "@errors/http/LengthError";

export class Description {
  private readonly description: string;

  get value(): string {
    return this.description;
  }

  private validateLength(description: string): boolean {
    return description.length > 46;
  }

  constructor(description: string) {
    const result = this.validateLength(description);

    if (result) throw new LengthError();
    this.description = description;
  }
}
