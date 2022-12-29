import { LengthError } from "@errors/http/LengthError";

export class OTP {
  private readonly OTP: string | null;

  get value(): string | null {
    return this.OTP;
  }

  private validateLength(OTP: string | null): boolean {
    return (OTP && OTP.length > 256) as boolean;
  }

  constructor(OTP: string | null) {
    const result = this.validateLength(OTP);

    if (result) throw new LengthError();
    this.OTP = OTP;
  }
}
