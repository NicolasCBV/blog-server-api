import * as TokenAdapterInterfaces from "../tokenAdapter";
import { decodeSession } from "./tokenJWTmenagement/decodeSession";
import { encodeSession } from "./tokenJWTmenagement/encodeSession";
import { checkExpirationStatus } from "./tokenJWTmenagement/checkExpiration";

export class JwtAdapter implements TokenAdapterInterfaces.TokenAdapter {
  decode(tokenString: TokenAdapterInterfaces.DecodeTokenData) {
    const result = decodeSession(tokenString);
    return result;
  }

  encode({
    PartialSession,
    expiresIn,
  }: TokenAdapterInterfaces.EncodeTokenData) {
    const result = encodeSession(PartialSession, expiresIn);
    return result;
  }

  validate(token: TokenAdapterInterfaces.Session) {
    const sessionStatus = checkExpirationStatus(token);
    return sessionStatus;
  }
}
