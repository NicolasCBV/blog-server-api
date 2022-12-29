import { randomUUID } from "crypto";
import { DefaultPermClass } from "../../defaultPermClass";

import { eventEmitterDB } from "@events/SyncDB";
import { eventEmitterRBFcounter } from "@events/resetBruteForceCounterEvent";

import { CryptAdapter } from "@adapters/cryptAdapter";
import { TokenAdapter, EncodeResult } from "@adapters/tokenAdapter";

import { HttpProtocol } from "@errors/http/httpErrors";
import { inconsistentError } from "@errors/http/DefaultErrors";
import {
  UsersCacheRepositories,
  UsersRepositories,
} from "@repositories/usersRepositories";
import { UserObject } from "@mappers/redisUser";

interface GetTokenServiceInterface {
  ip?: string;
  email?: string;
  OTP?: string | null;
}

export class GetTokenService extends DefaultPermClass {
  constructor(
    private cacheDB: UsersCacheRepositories,
    private criptography: CryptAdapter,
    private user: UsersRepositories,
    private token: TokenAdapter
  ) {
    super();
  }

  /**
   * When user finish the 2FA, this class should provide
   * the token
   */

  async exec({
    ip,
    email,
    OTP,
  }: GetTokenServiceInterface): Promise<EncodeResult> {
    if (!ip || !email || !OTP) throw inconsistentError();

    // Get user
    const user = await this.catchUserData({
      userCacheRepositories: this.cacheDB,
      usersRepositories: this.user,
      email,
    });

    // Check incongruities
    if (
      !user ||
      !user.OTP?.value ||
      !user.OTPexpires ||
      user.OTPexpires <= Date.now() ||
      !user.accept2FA
    ) {
      throw new HttpProtocol(
        "2FA error",
        process.env.CONFLICT as string,
        "Reason: This user could not do the 2FA authentication"
      );
    }

    // Checking the veracity of the OTP
    const result = await this.criptography.compare({
      content: OTP,
      contentEncoded: user.OTP.value as string,
    });

    if (!result)
      throw new HttpProtocol(
        "2FA error",
        process.env.UNAUTHORIZED as string,
        `Reason: bad code`
      );

    // Create new token and generate new id token
    const idToken = randomUUID();
    const token = this.token.encode({
      PartialSession: {
        id: user.id,
        idToken,
        admin: user.admin,
        email: user.email.value,
        name: user.name.value,
        description: user?.description?.value,
        TFAStatus: user.accept2FA,
        photo: user.photo,
      },
    });

    user.idToken = idToken;
    await this.cacheDB.create({
      key: `user:${email}`,
      value: JSON.stringify(UserObject.toRedis(user)),
    });

    // Compare user data on cache and in database
    eventEmitterDB.emit("refreshUserOnDB", {
      id: user.id,
      userAdapter: this.user,
      cacheDB: this.cacheDB,
    });

    // Restart the counter of "prevent brute force"
    eventEmitterRBFcounter.emit("reset", this.cacheDB, ip);

    return token;
  }
}
