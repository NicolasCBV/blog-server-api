import { Email } from "@entities/userTable/email";
import { Users } from "@entities/userTable/_users";

import { HttpProtocol } from "@errors/http/httpErrors";
import { ToDomainPropsCache, UserObject } from "@mappers/redisUser";
import {
  UsersCacheRepositories,
  UsersRepositories,
} from "@repositories/usersRepositories";

interface CatchUserDataInterface {
  usersRepositories: UsersRepositories;
  userCacheRepositories: UsersCacheRepositories;
  email: string;
}

export class DefaultPermClass {
  async catchUserData({
    usersRepositories,
    userCacheRepositories,
    email,
  }: CatchUserDataInterface): Promise<Users | ToDomainPropsCache> {
    const userOnCache = await userCacheRepositories.search(`user:${email}`);

    if (!userOnCache) {
      const userOnDB = await usersRepositories.search(new Email(email));

      if (!userOnDB)
        throw new HttpProtocol(
          "This user doesn't exist",
          process.env.CONFLICT as string
        );

      const userData = UserObject.toRedis(userOnDB);
      await userCacheRepositories.create({
        key: `user:${email}`,
        value: JSON.stringify(userData),
      });

      return userOnDB;
    }

    const user: ToDomainPropsCache = UserObject.toDomain(
      JSON.parse(userOnCache)
    );
    return user;
  }
}
