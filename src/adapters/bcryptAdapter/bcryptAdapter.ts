import { hash, compare } from "bcrypt";
import * as adapter from "../cryptAdapter";

export class BcryptAdapter implements adapter.CryptAdapter {
  async hash({ content }: adapter.EncodeData) {
    const contentHashed = await hash(content, 10);
    return contentHashed;
  }

  async compare({ content, contentEncoded }: adapter.CompareData) {
    const result = await compare(content, contentEncoded);
    return result;
  }
}
