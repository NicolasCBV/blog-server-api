import { randomUUID } from "crypto";
import { DefaultPermClass } from "../../defaultPermClass";

import { MailAdapter } from "@adapters/mailAdapter";
import { TokenAdapter } from "@adapters/tokenAdapter";

import { inconsistentError } from "@errors/http/DefaultErrors";
import { eventEmitterDB } from "@events/SyncDB";
import {
  UsersCacheRepositories,
  UsersRepositories,
} from "@repositories/usersRepositories";
import { UserObject } from "@mappers/redisUser";
import { TokenMapper } from "@adapters/mappers/tokenMapper";
import { sendMailEventEmitter } from "@events/sendMailEvent";

interface ChangePasswordServiceInterface {
  email?: string;
}

export class TryChangePasswordService extends DefaultPermClass {
  constructor(
    private user: UsersRepositories,
    private token: TokenAdapter,
    private cacheDB: UsersCacheRepositories,
    private mail: MailAdapter
  ) {
    super();
  }

  /**
   * This class should be able to send one request for server to change
   * the password user
   */

  async exec({ email }: ChangePasswordServiceInterface): Promise<void> {
    if (!email) throw inconsistentError();

    // Get user
    const user = await this.catchUserData({
      usersRepositories: this.user,
      userCacheRepositories: this.cacheDB,
      email,
    });

    // Generate idToken
    const idToken = randomUUID();

    user.idToken = idToken;
    await this.cacheDB.create({
      key: `user:${email}`,
      value: JSON.stringify(UserObject.toRedis(user)),
    });

    const token = this.token.encode({
      PartialSession: TokenMapper.toToken(user),
    });

    // verify the diference on cacheDB and mysql
    eventEmitterDB.emit("refreshUserOnDB", {
      id: user.id,
      userAdapter: this.user,
      cacheDB: this.cacheDB,
    });

    // Send email
    const link = `${process.env.URL_CLIENT}/reset?token=${token.token}`;

    sendMailEventEmitter.emit("send", this.mail, {
      from: `${process.env.NAME_SENDER as string} 
              <${process.env.EMAIL_SENDER as string}>`,
      to: user.email.value,
      subject: `${process.env.PROJECT_NAME || ""} - Troca de senha`,
      body: [
        `<p>Olá, recebemos um pedido para troca de senha recentemente, se realmente foi você quem solicitou este pedido, acesse este link para terminar o processo, caso não tenha sido você, apenas ignore este email.</p>`,
        `<p style="color: red">ATENÇÃO:</p>`,
        `<p>Não compartilhe este link com ninguém</p>`,
        `
            <p>
              Para acessar o link <a href="${link}" target="_blank">clique aqui.</a>
            </p>
          `,
      ]
        .join("/n")
        .replaceAll("/n", ""),
    });
  }
}
