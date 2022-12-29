import { DefaultPermClass } from "../../defaultPermClass";

import { inconsistentError } from "@errors/http/DefaultErrors";
import { HttpProtocol } from "@errors/http/httpErrors";
import { eventEmitterDB } from "@events/SyncDB";
import {
  UsersCacheRepositories,
  UsersRepositories,
} from "@repositories/usersRepositories";
import { Name } from "@entities/userTable/name";
import { Description } from "@entities/userTable/description";
import { UserObject } from "@mappers/redisUser";

interface PropsReturn {
  name: string;
  description?: string | null;
}

interface Props {
  email?: string;
  name?: string;
  desc?: string | null;
}

export class UpdateNameOrDescService extends DefaultPermClass {
  constructor(
    private cacheDB: UsersCacheRepositories,
    private user: UsersRepositories
  ) {
    super();
  }

  /**
   * This class should be able to update the name or
   * description of user
   */

  async exec({ email, name, desc }: Props): Promise<PropsReturn> {
    if (
      !name ||
      name === "username" ||
      !email ||
      (desc && desc.length > 256) ||
      name.length > 64
    )
      throw inconsistentError();

    // Get user
    const user = await this.catchUserData({
      userCacheRepositories: this.cacheDB,
      usersRepositories: this.user,
      email,
    });

    if (!user)
      throw new HttpProtocol(
        "This user doesn't exist",
        process.env.CONFLICT as string
      );

    // Update user data
    user.name = new Name(name);
    user.description = new Description(desc || null);

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

    return {
      name: user.name.value,
      description: user.description.value,
    };
  }
}
