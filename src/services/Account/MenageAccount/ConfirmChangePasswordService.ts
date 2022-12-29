import { eventEmitterDB } from "@events/SyncDB";
import { DefaultPermClass } from "../../defaultPermClass";

import { CryptAdapter } from "@adapters/cryptAdapter";

import { inconsistentError } from "@errors/http/DefaultErrors";
import {
  UsersCacheRepositories,
  UsersRepositories,
} from "@repositories/usersRepositories";
import { Password } from "@entities/userTable/password";
import { UserObject } from "@mappers/redisUser";

interface ProspReturn {
  email?: string;
  password?: string;
}

export class ConfirmChangePasswordService extends DefaultPermClass {
  constructor(
    private user: UsersRepositories,
    private cacheDB: UsersCacheRepositories,
    private crypt: CryptAdapter
  ) {
    super();
  }

  /**
   * This class should be able to confirm the request to change password user
   */

  async exec({ email, password }: ProspReturn) {
    if (!email || !password) throw inconsistentError();

    // Get user
    const user = await this.catchUserData({
      usersRepositories: this.user,
      userCacheRepositories: this.cacheDB,
      email,
    });

    // Update the password and idToken
    const passwordHashed = await this.crypt.hash({
      content: password,
    });
    user.password = new Password(passwordHashed);
    user.idToken = null;

    await this.cacheDB.create({
      key: `user:${email}`,
      value: JSON.stringify(UserObject.toRedis(user)),
    });

    // verify the diference on cacheDB and mysql
    eventEmitterDB.emit("refreshUserOnDB", {
      id: user.id,
      userAdapter: this.user,
      cacheDB: this.cacheDB,
    });
  }
}
