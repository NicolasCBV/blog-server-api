import path from "path";

import { DefaultPermClass } from "../../defaultPermClass";

import { eventEmitterCleanPhotosUser } from "@events/cleanPhotosUserEvent";
import { eventEmitterDB } from "@events/SyncDB";

import { inconsistentError } from "@errors/http/DefaultErrors";
import { HttpProtocol } from "@errors/http/httpErrors";
import {
  UsersCacheRepositories,
  UsersRepositories,
} from "@repositories/usersRepositories";
import { UserObject } from "@mappers/redisUser";

interface UpdateUserPhotoServiceInterface {
  email?: string;
  filename?: string;
}

export class UpdateUserPhotoService extends DefaultPermClass {
  constructor(
    private cacheDB: UsersCacheRepositories,
    private user: UsersRepositories
  ) {
    super();
  }

  /**
   * This class should be able to update the user photo
   */

  async exec({
    email,
    filename,
  }: UpdateUserPhotoServiceInterface): Promise<string | null> {
    if (!email || !filename) throw inconsistentError();

    // Get user
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

    // If user already have one photo
    if (user.photo !== null) {
      // Get file url
      const url = path.join(
        __dirname,
        "..",
        "..",
        "..",
        "..",
        "public",
        "uploads",
        "users",
        email
      );

      eventEmitterCleanPhotosUser.emit("clean", user, url, filename);
    }

    // Create a new url
    const formatedFilename = filename.replaceAll(" ", "_");

    const serverUrl = process.env.URL_SERVER as string;
    const url = `${serverUrl}/uploads/users/${email}/${formatedFilename}`;
    user.photo = url;

    // Update user
    await this.cacheDB.create({
      key: `user:${email}`,
      value: JSON.stringify(UserObject.toRedis(user)),
    });

    // Compare user data on cache and in database
    eventEmitterDB.emit("refreshUserOnDB", {
      id: user.id,
      userAdapter: this.user,
      cacheDB: this.cacheDB,
    });

    return url;
  }
}
