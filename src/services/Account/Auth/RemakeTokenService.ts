import { randomUUID } from "crypto";
import { DefaultPermClass } from "../../defaultPermClass";

import { EncodeResult, TokenAdapter } from "@adapters/tokenAdapter";

import { HttpProtocol } from "@errors/http/httpErrors";
import { eventEmitterDB } from "@events/SyncDB";
import { inconsistentError } from "@errors/http/DefaultErrors";
import {
  UsersCacheRepositories,
  UsersRepositories,
} from "@repositories/usersRepositories";
import { TokenMapper } from "@adapters/mappers/tokenMapper";
import { UserObject } from "@mappers/redisUser";

interface RemakeTokenServiceInterface {
  email?: string;
}

export class RemakeTokenService extends DefaultPermClass {
  constructor(
    private cacheDB: UsersCacheRepositories,
    private user: UsersRepositories,
    private tokenAdapter: TokenAdapter
  ) {
    super();
  }

  /**
   * This class should be able to renew jwt token
   * in valid stage
   */

  async exec({ email }: RemakeTokenServiceInterface): Promise<EncodeResult> {
    // Get incongruities
    if (!email) throw inconsistentError();

    // Get user
    const user = await this.catchUserData({
      userCacheRepositories: this.cacheDB,
      usersRepositories: this.user,
      email,
    });

    if (!user)
      throw new HttpProtocol(
        "This user doen't exist",
        process.env.CONFLICT as string
      );

    // Generate new token and new id token
    const idToken = randomUUID();

    user.idToken = idToken;

    const newToken = this.tokenAdapter.encode({
      PartialSession: TokenMapper.toToken(user),
    });

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

    return newToken;
  }
}
