/* eslint-disable */
import { BcryptAdapter } from "@adapters/bcryptAdapter/bcryptAdapter";
import { NodemailerMailAdapter } from "@adapters/nodemailer/nodemailerAdapter";
import { Email } from "@entities/userTable/email";
import { usersFactory } from "@tests/factories/userFactory";
import { UsersCacheRepo } from "@tests/inMemoryDatabases/user/cache/usersCache";
import { UsersDatabase } from "@tests/inMemoryDatabases/user/db/usersDatabase";
import { TwoFactors } from "./TwoFactors";

jest.mock("@events/sendMailEvent");

jest.mock("bcrypt", () => ({
  compare: jest.fn().mockReturnValue(true),
  hash: jest.fn().mockReturnValue("hashed string"),
}));

describe("Two factors test", () => {
  it("should initiate the two factors step", async () => {
    const userDatabase = new UsersDatabase();
    const userCacheRepo = new UsersCacheRepo();
    const mail = new NodemailerMailAdapter();

    const crypt = new BcryptAdapter();

    const twoFactors = new TwoFactors(userCacheRepo, crypt, mail);

    const user = await userDatabase.create(
      usersFactory({ email: new Email("test@email.com") })
    );

    expect(twoFactors.exec({ user })).resolves.not.toThrow();
  });
});
