import { TAlgorithm, decode } from "jwt-simple";
import { DecodeResult } from "./types";
import { Session } from "@adapters/tokenAdapter";

export function decodeSession(tokenString: string): DecodeResult {
  const algorithm: TAlgorithm = "HS512";
  let result: Session = {
    id: "",
    idToken: "",
    name: "",
    email: "",
    photo: null,
    description: null,
    TFAStatus: false,
    admin: false,
    expires: 0,
    issued: 0,
  };

  try {
    result = decode(tokenString, String(process.env.SECRET), false, algorithm);
  } catch (err) {
    if (err instanceof Error) {
      if (
        err.message === "Unexpected end of JSON input" ||
        err.message === "Not enough or too many segments" ||
        err.message === "No token supplied" ||
        err.message.indexOf("Unexpected token") === 0
      )
        return {
          type: "invalid token",
        };
      if (
        err.message === "Signature verification failed" ||
        err.message === "Algorithm not supported"
      )
        return {
          type: "integrity error",
        };
      throw err;
    }
  }
  return {
    type: "valid",
    session: result,
  };
}
