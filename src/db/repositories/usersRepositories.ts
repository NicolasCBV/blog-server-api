import { Email } from "@entities/userTable/email";
import { Users } from "../entities/userTable/_users";

export abstract class UsersRepositories {
  create: (data: Users) => Promise<Users>;
  delete: (id: string) => Promise<void>;

  search: (userEmail: Email) => Promise<Users | null>;
  searchForId: (userId: string) => Promise<Users | null>;
  GetAllEmailUsers: () => Promise<Email[] | []>;

  update: (data: Users) => Promise<void>;
}

export interface CreateOnCacheProps {
  key: string;
  value: string;
}

export abstract class UsersCacheRepositories {
  create: (data: CreateOnCacheProps) => Promise<void>;
  delete: (key: string) => Promise<void>;
  search: (key: string) => Promise<string | null>;
}
