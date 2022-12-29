import { DefaultPermClass } from "../../defaultPermClass";

import { CryptAdapter } from "@adapters/cryptAdapter";

import { inconsistentError } from "@errors/http/DefaultErrors";
import { HttpProtocol } from "@errors/http/httpErrors";
import {
  UsersCacheRepositories,
  UsersRepositories,
} from "@repositories/usersRepositories";
import { Email } from "@entities/userTable/email";
import { UserObject } from "@mappers/redisUser";

interface CancelCreationInterface {
  email?: string;
  password?: string;
}

export class CancelCreationService extends DefaultPermClass {
  constructor(
    private cacheDB: UsersCacheRepositories,
    private user: UsersRepositories,
    private cryptography: CryptAdapter
  ) {
    super();
  }

  /**
   * This class should cancel the process of creation user
   */

  async exec({ email, password }: CancelCreationInterface): Promise<void> {
    if (!email || !password) throw inconsistentError();

    // Get user
    const userOnDB = await this.user.search(new Email(email));
    if (userOnDB)
      throw new HttpProtocol(
        "User already exist",
        process.env.CONFLIC as string
      );

    const rawUser = await this.cacheDB.search(`user:${email}`);

    // Check incongruities
    if (!rawUser || UserObject.toDomain(JSON.parse(rawUser)).active)
      throw new HttpProtocol(
        "Impossible operation",
        process.env.CONFLICT as string,
        !rawUser ? "This user doesn't exist" : undefined
      );

    const user = UserObject.toDomain(JSON.parse(rawUser));

    // Check the password
    const checkPassword = await this.cryptography.compare({
      content: password,
      contentEncoded: user.password.value,
    });

    if (!checkPassword)
      throw new HttpProtocol(
        "Impossible operation",
        process.env.CONFLICT as string
      );

    // Delete user
    await this.cacheDB.delete(`user:${email}`);
  }
}
