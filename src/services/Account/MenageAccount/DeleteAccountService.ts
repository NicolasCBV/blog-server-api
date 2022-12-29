import { DefaultPermClass } from "../../defaultPermClass";
import path from "path";
import fs from "fs";

import { inconsistentError } from "@errors/http/DefaultErrors";
import { HttpProtocol } from "@errors/http/httpErrors";
import {
  UsersCacheRepositories,
  UsersRepositories,
} from "@repositories/usersRepositories";

interface DeleteAccountServiceInterface {
  email?: string;
}
export class DeleteAccountService extends DefaultPermClass {
  constructor(
    private cacheDB: UsersCacheRepositories,
    private usersAdapter: UsersRepositories
  ) {
    super();
  }

  /**
   * This class should be able to delete one user
   */

  async exec({ email }: DeleteAccountServiceInterface): Promise<void> {
    if (!email) throw inconsistentError();

    const user = await this.catchUserData({
      userCacheRepositories: this.cacheDB,
      usersRepositories: this.usersAdapter,
      email,
    });

    if (!user)
      throw new HttpProtocol(
        "User doesn't exist's",
        process.env.UNAUTHORIZED as string
      );

    const url = path.resolve(
      __dirname,
      "..",
      "..",
      "..",
      "..",
      "public",
      "uploads",
      email
    );

    fs.access(url, (err) => {
      if (err && !err.message.includes("no such file or directory")) {
        throw err;
      }

      fs.rmSync(url, { recursive: true, force: true });
    });

    await this.cacheDB.delete(`user:${email}`);
    await this.usersAdapter.delete(user!.id);
  }
}
