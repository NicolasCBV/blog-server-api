import { createTransport } from "nodemailer";
import { MailAdapter, SendMailData } from "../mailAdapter";

export class NodemailerMailAdapter implements MailAdapter {
  async sendMail({ from, to, subject, body }: SendMailData): Promise<void> {
    const transport = createTransport({
      host: String(process.env.HOST_SENDER) ?? "smtp.emailexample.com",
      port: Number(process.env.HOST_PORT_SENDER) ?? 0,
      auth: {
        user: String(process.env.EMAIL_SENDER) ?? "user@email.com",
        pass: String(process.env.PASS_SENDER) ?? "password",
      },
    });

    await transport.sendMail({
      from,
      to,
      subject,
      html: body,
    });
  }
}
