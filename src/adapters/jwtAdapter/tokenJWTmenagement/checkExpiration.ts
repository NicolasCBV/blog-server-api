import { ExpiredStatus } from "./types";
import { Session } from "@adapters/tokenAdapter";

export function checkExpirationStatus(token: Session): ExpiredStatus {
  const now = Date.now();
  if (token.expires > now) return "active";

  const graceTime = Number(process.env.GRACE_TIME) || 5000000;
  const afterExpiration = token.expires + graceTime;

  if (afterExpiration > now) return "grace";

  return "expired";
}
