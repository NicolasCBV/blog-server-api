import { DefaultPermClass } from "../../defaultPermClass";

import { CryptAdapter } from "@adapters/cryptAdapter";
import { EncodeResult, TokenAdapter } from "@adapters/tokenAdapter";

import { inconsistentError } from "@errors/http/DefaultErrors";
import { HttpProtocol } from "@errors/http/httpErrors";
import { eventEmitterDB } from "@events/SyncDB";
import { randomUUID } from "node:crypto";
import {
  UsersCacheRepositories,
  UsersRepositories,
} from "@repositories/usersRepositories";
import { UserObject } from "@mappers/redisUser";
import { TokenMapper } from "@adapters/mappers/tokenMapper";

interface ValidateUserServiceInterface {
  email?: string;
  OTP?: string;
}

export class ValidateUserService extends DefaultPermClass {
  constructor(
    private cacheDB: UsersCacheRepositories,
    private user: UsersRepositories,
    private cryptography: CryptAdapter,
    private token: TokenAdapter
  ) {
    super();
  }

  /**
   * This class should be able to validate one user
   */

  async exec({
    email,
    OTP,
  }: ValidateUserServiceInterface): Promise<EncodeResult> {
    // Check incongruities and get user on cacheDB
    if (!email || !OTP) throw inconsistentError();

    const user = await this.catchUserData({
      usersRepositories: this.user,
      userCacheRepositories: this.cacheDB,
      email,
    });

    if (
      !user ||
      user.active ||
      !user.OTP ||
      !user.OTPexpires ||
      user.OTPexpires <= Date.now()
    ) {
      throw new HttpProtocol(
        "Impossible operation",
        process.env.CONFLICT as string
      );
    }

    // Checking the veracity of the OTP
    const result = await this.cryptography.compare({
      content: OTP,
      contentEncoded: user.OTP.value as string,
    });

    if (!result) throw inconsistentError();

    // Renewing the id token and making one new token
    const idToken = randomUUID();

    user.idToken = idToken;
    user.active = true;
    user.OTP = null;
    user.OTPissued = null;
    user.OTPexpires = null;

    await this.cacheDB.create({
      key: `user:${email}`,
      value: JSON.stringify(UserObject.toRedis(user)),
    });

    const token = this.token.encode({
      PartialSession: TokenMapper.toToken(user),
    });

    // Compare user data on cache and in database
    eventEmitterDB.emit("mergeUser", {
      email: user.email.value,
      userAdapter: this.user,
      cacheDB: this.cacheDB,
    });

    return token;
  }
}
