import { client } from "../redisClient";
import { UsersCacheRepositories } from "@repositories/usersRepositories";

export class RedisAdapter implements UsersCacheRepositories {
  async create({ key, value }): Promise<void> {
    const clientRedis = await client();
    await clientRedis.set(key, value);
    await clientRedis.quit();
  }

  async search(key: string): Promise<string | null> {
    const clientRedis = await client();
    const result = await clientRedis.get(key);
    await clientRedis.quit();
    return result;
  }

  async delete(key: string): Promise<void> {
    const clientRedis = await client();
    await clientRedis.del(key);
    await clientRedis.quit();
  }
}
