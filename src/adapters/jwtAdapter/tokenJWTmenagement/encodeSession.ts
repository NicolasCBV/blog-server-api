import { TAlgorithm, encode } from "jwt-simple";
import { EncodeResult, PartialSession, Session } from "@adapters/tokenAdapter";

export function encodeSession(
  partialSession: PartialSession,
  expiresIn?: number
): EncodeResult {
  const algorithm: TAlgorithm = "HS512";

  const issued = Date.now();
  const timeToExpires = Number(process.env.TOKEN_TIME) || 18000000;
  const expires = expiresIn || issued + timeToExpires;

  const session: Session = {
    ...partialSession,
    issued,
    expires,
  };

  return {
    token: encode(session, String(process.env.SECRET), algorithm),
    issued,
    expires,
  };
}
