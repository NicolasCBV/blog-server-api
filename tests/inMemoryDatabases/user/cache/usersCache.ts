import {
  CreateOnCacheProps,
  UsersCacheRepositories,
} from "@repositories/usersRepositories";

interface InstanceOnCache {
  key: string;
  value: string;
}

export class UsersCacheRepo implements UsersCacheRepositories {
  UsersDatabase: InstanceOnCache[] = [];

  async create(data: CreateOnCacheProps): Promise<void> {
    if (
      this.UsersDatabase.find((item) => item.key === data.key) ||
      this.UsersDatabase.find((item) => item.key === data.key)
    ) {
      const index = this.UsersDatabase.findIndex(
        (item) => item.key === data.key
      );

      this.UsersDatabase[index] = data;
    }

    this.UsersDatabase.push(data);
  }

  async delete(key: string): Promise<void> {
    const index = this.UsersDatabase.findIndex((item) => item.key === key);

    this.UsersDatabase.splice(index, 1);
  }

  async search(key: string): Promise<string | null> {
    const user = this.UsersDatabase.find((item) => item.key === key);

    return user?.value ?? null;
  }
}
