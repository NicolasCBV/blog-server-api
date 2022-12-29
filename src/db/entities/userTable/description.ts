import { LengthError } from "@errors/http/LengthError";

export class Description {
  private readonly description: string | null;

  get value(): string | null {
    return this.description;
  }

  private validateLength(description: string | null): boolean {
    return (description && description.length > 256) as boolean;
  }

  constructor(description: string | null) {
    const result = this.validateLength(description);

    if (result) throw new LengthError();
    this.description = description;
  }
}
