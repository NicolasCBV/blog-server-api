import { randomUUID } from "crypto";
import { DefaultPermClass } from "../../defaultPermClass";

import { TokenAdapter } from "@adapters/tokenAdapter";

import { inconsistentError } from "@errors/http/DefaultErrors";
import { HttpProtocol } from "@errors/http/httpErrors";
import { eventEmitterDB } from "@events/SyncDB";
import {
  UsersCacheRepositories,
  UsersRepositories,
} from "@repositories/usersRepositories";
import { TokenMapper } from "@adapters/mappers/tokenMapper";
import { UserObject } from "@mappers/redisUser";

type Result = {
  token: string;
  expires: number;
  issued: number;
};

interface Modify2FAServiceInterface {
  email?: string;
  newStatus?: boolean;
}
export class Modify2FAService extends DefaultPermClass {
  constructor(
    private cacheDB: UsersCacheRepositories,
    private user: UsersRepositories,
    private token: TokenAdapter
  ) {
    super();
  }

  /**
   * This class should be able to modufy the 2FA field in user table on database
   */

  async exec({ email, newStatus }: Modify2FAServiceInterface): Promise<Result> {
    // Check incongruities
    if (!email || newStatus === null || newStatus === undefined)
      throw inconsistentError();

    // Catch user data
    const user = await this.catchUserData({
      userCacheRepositories: this.cacheDB,
      usersRepositories: this.user,
      email,
    });

    if (!user)
      throw new HttpProtocol(
        "This user not exist's",
        process.env.UNAUTHORIZED as string
      );

    // Update user
    const idToken = randomUUID();

    user.idToken = idToken;
    user.accept2FA = newStatus;

    await this.cacheDB.create({
      key: `user:${email}`,
      value: JSON.stringify(UserObject.toRedis(user)),
    });

    // Generate id token using UUID
    const token = this.token.encode({
      PartialSession: TokenMapper.toToken(user),
    });

    // Emit event to refresh user data on database
    eventEmitterDB.emit("refreshUserOnDB", {
      id: user.id,
      userAdapter: this.user,
      cacheDB: this.cacheDB,
    });
    return token;
  }
}
