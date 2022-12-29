import { BcryptAdapter } from "@adapters/bcryptAdapter/bcryptAdapter";
import { JwtAdapter } from "@adapters/jwtAdapter/jwtAdapter";
import { Email } from "@entities/userTable/email";
import { OTP } from "@entities/userTable/OTP";
import { HttpProtocol } from "@errors/http/httpErrors";
import { UserObject } from "@mappers/redisUser";
import { usersFactory } from "@tests/factories/userFactory";
import { UsersCacheRepo } from "@tests/inMemoryDatabases/user/cache/usersCache";
import { UsersDatabase } from "@tests/inMemoryDatabases/user/db/usersDatabase";
import { ValidateUserService } from "./ValidateUserService";

jest.mock("node:events");

jest.mock("bcrypt", () => ({
  compare: jest.fn().mockReturnValue(true),
  hash: jest.fn().mockReturnValue("hashed string"),
}));

jest.spyOn(JwtAdapter.prototype, "encode").mockReturnThis();

jest.spyOn(UsersCacheRepo.prototype, "create");

const bcryptAdapter = new BcryptAdapter();
const jwtAdapter = new JwtAdapter();

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

    await userDatabase.create(user);

    const validateUser = new ValidateUserService(
      userCacheRepositories,
      userDatabase,
      bcryptAdapter,
      jwtAdapter
    );

    await validateUser.exec({
      email: user.email.value,
      OTP: user.OTP?.value ?? undefined,
    });

    expect(userCacheRepositories.create).toBeCalled();

    const rawNewUser = await userCacheRepositories.search(
      "user:test@email.com"
    );
    const newUser = UserObject.toDomain(JSON.parse(rawNewUser as string));

    expect(newUser.OTP?.value).toEqual(null);
  });

  it("should throw one error: user already validated", async () => {
    const userCacheRepositories = new UsersCacheRepo();
    const userDatabase = new UsersDatabase();

    const user = usersFactory({
      active: true,
      email: new Email("test@email.com"),
      OTP: new OTP("SR73HG"),
      OTPissued: Date.now(),
      OTPexpires: Date.now() + 1000,
    });

    await userDatabase.create(user);

    const validateUser = new ValidateUserService(
      userCacheRepositories,
      userDatabase,
      bcryptAdapter,
      jwtAdapter
    );

    expect(async () => {
      await validateUser.exec({
        email: user.email.value,
        OTP: user.OTP?.value ?? undefined,
      });
    }).rejects.toThrowError(HttpProtocol);
  });

  it("should throw one error: OTP expired", async () => {
    const userCacheRepositories = new UsersCacheRepo();
    const userDatabase = new UsersDatabase();

    const user = usersFactory({
      active: false,
      email: new Email("test@email.com"),
      OTP: new OTP("SR73HG"),
      OTPissued: Date.now(),
      OTPexpires: Date.now() - 1000,
    });

    await userDatabase.create(user);

    const validateUser = new ValidateUserService(
      userCacheRepositories,
      userDatabase,
      bcryptAdapter,
      jwtAdapter
    );

    expect(async () => {
      await validateUser.exec({
        email: user.email.value,
        OTP: user.OTP?.value ?? undefined,
      });
    }).rejects.toThrowError(HttpProtocol);
  });

  it("should throw one error: user doesn't exist", async () => {
    const userCacheRepositories = new UsersCacheRepo();
    const userDatabase = new UsersDatabase();

    const user = usersFactory({
      active: false,
      email: new Email("test@email.com"),
      OTP: new OTP("SR73HG"),
      OTPissued: Date.now(),
      OTPexpires: Date.now() + 1000,
    });

    const validateUser = new ValidateUserService(
      userCacheRepositories,
      userDatabase,
      bcryptAdapter,
      jwtAdapter
    );

    expect(async () => {
      await validateUser.exec({
        email: user.email.value,
        OTP: user.OTP?.value ?? undefined,
      });
    }).rejects.toThrowError(HttpProtocol);
  });

  it("should throw one error: OTP expired", async () => {
    const userCacheRepositories = new UsersCacheRepo();
    const userDatabase = new UsersDatabase();

    jest
      .spyOn(BcryptAdapter.prototype, "compare")
      .mockImplementation(async () => false);

    const user = usersFactory({
      active: false,
      email: new Email("test@email.com"),
      OTP: new OTP("SR73HG"),
      OTPissued: Date.now(),
      OTPexpires: Date.now() + 1000,
    });

    await userDatabase.create(user);

    const validateUser = new ValidateUserService(
      userCacheRepositories,
      userDatabase,
      bcryptAdapter,
      jwtAdapter
    );

    expect(async () => {
      await validateUser.exec({
        email: user.email.value,
        OTP: "fake OTP",
      });
    }).rejects.toThrowError(HttpProtocol);
  });
});
