import { DefaultPermClass } from "../../defaultPermClass";
import { generateRandomString } from "@utils/generateRandomString";

import { CryptAdapter } from "@adapters/cryptAdapter";
import { MailAdapter } from "@adapters/mailAdapter";
import { UsersCacheRepositories } from "@repositories/usersRepositories";
import { Users } from "@entities/userTable/_users";
import { ToDomainPropsCache, UserObject } from "@mappers/redisUser";
import { OTP } from "@entities/userTable/OTP";
import { sendMailEventEmitter } from "@events/sendMailEvent";

interface TwoFactorInterface {
  user: Users | ToDomainPropsCache;
}

export class TwoFactors extends DefaultPermClass {
  constructor(
    private cacheDB: UsersCacheRepositories,
    private criptography: CryptAdapter,
    private mail: MailAdapter
  ) {
    super();
  }

  /**
   * This class should be able to send one email and complete the 2FA.
   */

  async exec({ user }: TwoFactorInterface): Promise<void> {
    // Define main variables
    const code = generateRandomString();
    const codeHashed = await this.criptography.hash({
      content: code as string,
    });

    const time = Number(process.env.OTP_TIME) || 120000;
    const expiresIn = Date.now() + time;

    // // Define OTP status
    user.OTP = new OTP(codeHashed);
    user.OTPexpires = expiresIn;
    user.OTPissued = Date.now();

    await this.cacheDB.create({
      key: `user:${user.email.value}`,
      value: JSON.stringify(UserObject.toRedis(user)),
    });

    // Send email
    sendMailEventEmitter.emit("send", this.mail, {
      from: `${process.env.NAME_SENDER as string}
            <${process.env.EMAIL_SENDER as string}>`,
      to: user.email.value,
      subject: `${
        (process.env.PROJECT_NAME as string) ?? ""
      } - Verificação de duas etapas`,
      body: [
        `<p>Olá, alguém tentou acessar a sua conta recentemente (ou criar uma conta em seu nome) e acabou acionando a verificação de dois fatores, caso não tenha sido você, recomendamos a troca imediata da sua senha.</p>`,
        `<p style="color: red">ATENÇÃO:</p>`,
        `<p>Não compartilhe este código com ninguém</p>`,
        `<p>${code}</p>`,
      ]
        .join("/n")
        .replaceAll("/n", ""),
    });
  }
}
