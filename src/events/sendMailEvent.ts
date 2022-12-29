import { MailAdapter, SendMailData } from "@adapters/mailAdapter";
import { EventEmitter } from "node:events";

class SendMailEvent extends EventEmitter {}

async function SendMailEventFunc(
  mailAdapter: MailAdapter,
  content: SendMailData
) {
  try {
    await mailAdapter.sendMail(content);
  } catch (err) {
    console.error(err);
  }
}

const sendMailEventEmitter = new SendMailEvent();

sendMailEventEmitter.on("send", async (mailAdapter, content) => {
  try {
    await SendMailEventFunc(mailAdapter, content);
  } catch (err) {
    console.error(err);
  }
});

export { sendMailEventEmitter };
