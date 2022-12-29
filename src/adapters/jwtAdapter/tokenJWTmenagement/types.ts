import { Session } from "@adapters/tokenAdapter";

export type DecodeResult =
  | {
      type: "valid";
      session: Session;
    }
  | {
      type: "integrity error";
    }
  | {
      type: "invalid token";
    };

export type twoFactorsResult = {
  code2FA: string;
  createdIn: number;
  expiresIn: number;
};

export type ExpiredStatus = "expired" | "active" | "grace";
