import { TwoFactors } from "../Auth/TwoFactors";

import { CryptAdapter } from "@adapters/cryptAdapter";
import { MailAdapter } from "@adapters/mailAdapter";

import { inconsistentError } from "@errors/http/DefaultErrors";
import { HttpProtocol } from "@errors/http/httpErrors";
import {
  UsersCacheRepositories,
  UsersRepositories,
} from "@repositories/usersRepositories";
import { Email } from "@entities/userTable/email";
import { Name } from "@entities/userTable/name";
import { Password } from "@entities/userTable/password";
import { UserObject } from "@mappers/redisUser";
import { Users } from "@entities/userTable/_users";

interface CreateUserServiceInterface {
  name?: string;
  email?: string;
  password?: string;
}
export class CreateUserService {
  constructor(
    private cacheDB: UsersCacheRepositories,
    private cryptography: CryptAdapter,
    private users: UsersRepositories,
    private mail: MailAdapter
  ) {}

  /**
   * This class should be able to create one user in cacheDB. To finish the process,
   * the user needs to access the end point "/users/validate", else if user wish cancel the process
   * its necessary acces "/users/cancel"
   */

  prepareDeletion(userObjt: Users, time: number) {
    setTimeout(async () => {
      const user = await this.users.searchForId(userObjt.id);

      if (!user) await this.cacheDB.delete(`user:${userObjt.email.value}`);
    }, time);
  }

  async exec({
    email,
    name,
    password,
  }: CreateUserServiceInterface): Promise<void> {
    // Verify the incongruities
    if (
      !name ||
      name === "username" ||
      !password ||
      !email ||
      name.length < 2 ||
      name.length > 64 ||
      email.length > 256 ||
      password.length > 256
    )
      throw inconsistentError();

    const userOnCache = await this.cacheDB.search(`user:${email}`);
    const userOnDB = await this.users.search(new Email(email));

    if (userOnCache || userOnDB)
      throw new HttpProtocol(
        "User already exist`s",
        process.env.UNAUTHORIZED as string
      );

    // Create user on cacheDB
    const passwordEncrypted = await this.cryptography.hash({
      content: password,
    });

    const userObjt = new Users({
      accept2FA: false,
      admin: false,
      name: new Name(name),
      email: new Email(email),
      password: new Password(passwordEncrypted),
      active: false,
    });

    await this.cacheDB.create({
      key: `user:${email}`,
      value: JSON.stringify(UserObject.toRedis(userObjt)),
    });

    // Send email for user
    const twoFactor = new TwoFactors(
      this.cacheDB,
      this.cryptography,
      this.mail
    );
    await twoFactor.exec({ user: userObjt });

    // Prepare user to deletion
    this.prepareDeletion(userObjt, 120000);
  }
}
