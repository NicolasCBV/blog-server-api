import { Email } from "@entities/userTable/email";
import { Users } from "@entities/userTable/_users";
import { UsersRepositories } from "@repositories/usersRepositories";

export class UsersDatabase implements UsersRepositories {
  UsersDatabase: Users[] = [];

  async create(data: Users): Promise<Users> {
    if (
      this.UsersDatabase.find((key) => key.email.value === data.email.value) ||
      this.UsersDatabase.find((key) => key.id === data.id)
    )
      throw new Error("This user already exists");

    this.UsersDatabase.push(data);
    return data;
  }

  async delete(email: string): Promise<void> {
    const index = this.UsersDatabase.findIndex(
      (key) => key.email.value === email
    );

    this.UsersDatabase.splice(index, 1);
  }

  async search(userEmail: Email): Promise<Users | null> {
    const user = this.UsersDatabase.find((key) => {
      return key.email.value === userEmail.value;
    });

    return user ?? null;
  }

  async searchForId(userId: string): Promise<Users | null> {
    const user = this.UsersDatabase.find((key) => key.id === userId);

    return user ?? null;
  }

  async GetAllEmailUsers(): Promise<Email[] | []> {
    const notAdmins = this.UsersDatabase.filter((key) => !key.admin);

    const emails = notAdmins.map((key) => {
      return key.email;
    });

    return emails;
  }

  async update(data: Users): Promise<void> {
    const userIndex = this.UsersDatabase.findIndex((key) => key.id === data.id);

    if (userIndex === undefined || userIndex === null || userIndex === -1)
      throw new Error("User doesn't exists");

    this.UsersDatabase[userIndex] = data;
  }
}
