import { DefaultPermClass } from "../../defaultPermClass";

import { inconsistentError } from "@errors/http/DefaultErrors";
import { HttpProtocol } from "@errors/http/httpErrors";
import {
  UsersCacheRepositories,
  UsersRepositories,
} from "@repositories/usersRepositories";

export interface SearchUserUserData {
  id: string;
  name: string;
  email: string;
  description?: string | null;
  photo?: string | null;
}

interface SearchForUserServiceInterface {
  email?: string;
}

export class SearchForUserService extends DefaultPermClass {
  constructor(
    private cacheDB: UsersCacheRepositories,
    private user: UsersRepositories
  ) {
    super();
  }

  /**
   * This class should be able to search for users
   */

  async exec({
    email,
  }: SearchForUserServiceInterface): Promise<SearchUserUserData> {
    if (!email) throw inconsistentError();

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

    return {
      id: user.id,
      name: user.name.value,
      email: user.email.value,
      description: user.description?.value,
      photo: user.photo,
    };
  }
}
