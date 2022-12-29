import { randomUUID } from "crypto";
import { DefaultPermClass } from "../../defaultPermClass";

import { TwoFactors } from "./TwoFactors";
import { WatchIpService } from "../../watchIpService";

import { eventEmitterDB } from "@events/SyncDB";
import { eventEmitterRBFcounter } from "@events/resetBruteForceCounterEvent";

import { CryptAdapter } from "@adapters/cryptAdapter";
import { MailAdapter } from "@adapters/mailAdapter";
import { TokenAdapter, EncodeResult } from "@adapters/tokenAdapter";

import { inconsistentError } from "@errors/http/DefaultErrors";
import {
  UsersCacheRepositories,
  UsersRepositories,
} from "@repositories/usersRepositories";
import { UserObject } from "@mappers/redisUser";
import { HttpProtocol } from "@errors/http/httpErrors";

interface LoginUserServiceInterface {
  /**
   * @param ip insert the ip of user to prevent one atack using brute force
   * @param email insert the email of user
   * @param password insert the password of user
   */
  ip?: string;
  email?: string;
  password?: string;
}
export class LoginUserService extends DefaultPermClass {
  constructor(
    private criptography: CryptAdapter,
    private handleMail: MailAdapter,
    private user: UsersRepositories,
    private token: TokenAdapter,
    private cacheDB: UsersCacheRepositories
  ) {
    super();
  }

  /**
   * This class should be able to login one user, generating one jwt token
   */

  async exec({
    ip,
    email,
    password,
  }: LoginUserServiceInterface): Promise<EncodeResult | string> {
    if (!ip || !password) throw inconsistentError();

    if (!email)
      throw new HttpProtocol(
        "Inconsistent data's",
        process.env.CONFLICT as string,
        "Maybe you should check if the user is active or if the data is correct."
      );

    // search user data
    const user = await this.catchUserData({
      userCacheRepositories: this.cacheDB,
      usersRepositories: this.user,
      email,
    });

    // check incongruities
    if (
      !user ||
      !user.active ||
      !(await this.criptography.compare({
        content: password,
        contentEncoded: user?.password.value,
      }))
    ) {
      const expires = 1000 * 60 * 2;
      const timeout = 1000 * 60;

      const watchIpService = new WatchIpService(this.cacheDB);

      await watchIpService.exec({
        tag: "preventBruteForce",
        ip,
        limitCounter: 5,
        expiresIn: expires,
        timeout,
      });

      throw new HttpProtocol(
        "Inconsistent data's",
        process.env.CONFLICT as string,
        "Maybe you should check if the user is active"
      );
    }

    // if the user uses tfa authentication
    if (user.accept2FA) {
      const twoFactors = new TwoFactors(
        this.cacheDB,
        this.criptography,
        this.handleMail
      );

      await twoFactors.exec({ user });

      return user.id;
    }

    // mark the id token on user
    const idToken = randomUUID();

    user.idToken = idToken;
    await this.cacheDB.create({
      key: `user:${email}`,
      value: JSON.stringify(UserObject.toRedis(user)),
    });

    // generate token
    const token = this.token.encode({
      PartialSession: {
        id: user.id,
        idToken,
        admin: user.admin,
        email: user.email.value,
        name: user.name.value,
        photo: user.photo ?? undefined,
        TFAStatus: user.accept2FA,
        description: user?.description?.value,
      },
    });

    // verify the diference on cacheDB and mysql
    eventEmitterDB.emit("refreshUserOnDB", {
      id: user.id,
      userAdapter: this.user,
      cacheDB: this.cacheDB,
    });

    // reset the counter of prevent brute force
    eventEmitterRBFcounter.emit("reset", this.cacheDB, ip);

    return token;
  }
}
