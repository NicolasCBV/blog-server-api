import { DecodeResult } from "./jwtAdapter/tokenJWTmenagement/types";
export interface Session {
  id: string;
  idToken: string | null;
  email: string;
  name: string;
  photo?: string | null;
  description?: string | null;
  TFAStatus: boolean;
  admin: boolean;
  issued: number;
  expires: number;
}

export type PartialSession = Omit<Session, "issued" | "expires">;

export interface EncodeResult {
  token: string;
  expires: number;
  issued: number;
}

export interface EncodeTokenData {
  PartialSession: Omit<Session, "issued" | "expires">;
  expiresIn?: number;
}

export type DecodeTokenData = string;
type ExpiredStatus = "expired" | "active" | "grace";

export interface TokenAdapter {
  encode: (data: EncodeTokenData) => EncodeResult;
  decode: (tokenString: DecodeTokenData) => DecodeResult;
  validate: (token: Session) => ExpiredStatus;
}
