import { JwtAdapter } from "@adapters/jwtAdapter/jwtAdapter";
import { NodemailerMailAdapter } from "@adapters/nodemailer/nodemailerAdapter";
import { Email } from "@entities/userTable/email";
import { OTP } from "@entities/userTable/OTP";
import { UserObject } from "@mappers/redisUser";
import { usersFactory } from "@tests/factories/userFactory";
import { UsersCacheRepo } from "@tests/inMemoryDatabases/user/cache/usersCache";
import { UsersDatabase } from "@tests/inMemoryDatabases/user/db/usersDatabase";
import { TryChangePasswordService } from "./TryChangePasswordService";

jest.mock("bcrypt", () => ({
  compare: jest.fn().mockReturnValue(true),
  hash: jest.fn().mockReturnValue("hashed string"),
}));

jest.spyOn(JwtAdapter.prototype, "encode").mockReturnThis();

jest.spyOn(UsersCacheRepo.prototype, "create");

jest.mock("@events/sendMailEvent");
jest.mock("node:events");

const jwtAdapter = new JwtAdapter();
const nodemailer = new NodemailerMailAdapter();

describe("Confirm change password test", () => {
  it("should be able to create users", async () => {
    const userCacheRepositories = new UsersCacheRepo();
    const userDatabase = new UsersDatabase();

    const user = usersFactory({
      active: false,
      email: new Email("test@email.com"),
      OTP: new OTP("SR73HG"),
      OTPissued: Date.now(),
      OTPexpires: Date.now() + 1000,
    });
    const idToken = user;

    await userDatabase.create(user);

    const tryChangePasswordService = new TryChangePasswordService(
      userDatabase,
      jwtAdapter,
      userCacheRepositories,
      nodemailer
    );

    await tryChangePasswordService.exec({
      email: user.email.value,
    });

    expect(userCacheRepositories.create).toBeCalled();

    const rawNewUser = await userCacheRepositories.search(
      "user:test@email.com"
    );
    const newUser = UserObject.toDomain(JSON.parse(rawNewUser as string));

    expect(newUser.idToken).not.toEqual(idToken);
  });
});
