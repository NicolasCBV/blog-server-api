import { EventEmitter } from "node:events";

import { HttpProtocol } from "@errors/http/httpErrors";
import {
  UsersCacheRepositories,
  UsersRepositories,
} from "@repositories/usersRepositories";
import { Email } from "@entities/userTable/email";
import { UserObject } from "@mappers/redisUser";

class NewEventEmitter extends EventEmitter {}

const eventEmitterDB = new NewEventEmitter();

/**
 * This function apply the user data
 * on cache in actual database
 */

interface MergeUserProps {
  email: string;
  userAdapter: UsersRepositories;
  cacheDB: UsersCacheRepositories;
}

interface RefreshUserOnDBProps {
  id: string;
  userAdapter: UsersRepositories;
  cacheDB: UsersCacheRepositories;
}

async function mergeUser({ email, userAdapter, cacheDB }: MergeUserProps) {
  // Check if user doesn't exist on database
  const userOnDB = await userAdapter.search(new Email(email));
  if (userOnDB)
    throw new HttpProtocol(
      "This user already exist",
      process.env.CONFLICT as string
    );

  // Search for user on cache
  const rawUserOnCache = await cacheDB.search(`user:${email}`);
  if (!rawUserOnCache) throw Error("The user was not cached");

  const userOnCache = UserObject.toUsersOnDB(
    UserObject.toDomain(JSON.parse(rawUserOnCache))
  );

  // Merge user on database
  const user = await userAdapter.create(userOnCache);
  await cacheDB.create({
    key: `user:${email}`,
    value: JSON.stringify(UserObject.toRedis(user)),
  });
}

/**
 * This function update the user storaged on database
 * using the user data on cache
 */
async function refreshUserOnDB({
  id,
  cacheDB,
  userAdapter,
}: RefreshUserOnDBProps) {
  // Check if user exist
  const userOnDB = await userAdapter.searchForId(id);
  if (!userOnDB) throw Error("The user was not storaged on database");

  // Search for user on cache
  const userOnCache = await cacheDB.search(`user:${userOnDB!.email.value}`);
  if (!userOnCache) throw Error("The user was not cached");

  const userOnCacheFormated = UserObject.toDomain(JSON.parse(userOnCache));

  if (userOnDB !== UserObject.toUsersOnDB(userOnCacheFormated)) {
    // If user on database are not equal to user on cache, refresh
    await userAdapter.update(UserObject.toUsersOnDB(userOnCacheFormated));
  }
}

eventEmitterDB.on("mergeUser", async (data: MergeUserProps) => {
  try {
    await mergeUser(data);
  } catch (err) {
    console.error(err);
  }
});

eventEmitterDB.on(
  "refreshUserOnDB",
  async (data: RefreshUserOnDBProps): Promise<void> => {
    try {
      await refreshUserOnDB(data);
    } catch (err) {
      console.error(err);
    }
  }
);

export { eventEmitterDB };
