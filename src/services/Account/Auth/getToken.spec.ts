import { BcryptAdapter } from "@adapters/bcryptAdapter/bcryptAdapter";
import { UsersCacheRepo } from "@tests/inMemoryDatabases/user/cache/usersCache";
import { UsersDatabase } from "@tests/inMemoryDatabases/user/db/usersDatabase";
import { JwtAdapter } from "@adapters/jwtAdapter/jwtAdapter";
import { usersFactory } from "@tests/factories/userFactory";
import { Email } from "@entities/userTable/email";
import { OTP } from "@entities/userTable/OTP";
import { GetTokenService } from "./GetTokenService";
import { HttpProtocol } from "@errors/http/httpErrors";

jest.spyOn(JwtAdapter.prototype, "encode").mockReturnThis();

jest.mock("bcrypt", () => ({
  compare: jest.fn().mockReturnValue(true),
  hash: jest.fn().mockReturnValue("hashed string"),
}));

describe("Get token test", () => {
  it("should be able to get a token", async () => {
    const usersDatabase = new UsersDatabase();
    const userCacheRepositories = new UsersCacheRepo();
    const bcryptAdapter = new BcryptAdapter();
    const jwt = new JwtAdapter();

    const user = await usersDatabase.create(
      usersFactory({
        email: new Email("test@email.com"),
        OTP: new OTP("ASEQ23"),
        OTPexpires: Date.now() + 2000,
        accept2FA: true,
      })
    );

    const getTokenService = new GetTokenService(
      userCacheRepositories,
      bcryptAdapter,
      usersDatabase,
      jwt
    );

    const token = await getTokenService.exec({
      ip: "0.0.0.0/0",
      email: user.email.value,
      OTP: user.OTP?.value,
    });

    expect(token).toBeInstanceOf(JwtAdapter);
  });

  it("should throw one error because the otp field is empty", async () => {
    const usersDatabase = new UsersDatabase();
    const userCacheRepositories = new UsersCacheRepo();
    const bcryptAdapter = new BcryptAdapter();
    const jwt = new JwtAdapter();

    const user = await usersDatabase.create(
      usersFactory({
        email: new Email("test@email.com"),
        OTP: new OTP(null),
        OTPexpires: Date.now() + 2000,
        accept2FA: true,
      })
    );

    const getTokenService = new GetTokenService(
      userCacheRepositories,
      bcryptAdapter,
      usersDatabase,
      jwt
    );

    expect(async () => {
      await getTokenService.exec({
        ip: "0.0.0.0/0",
        email: user.email.value,
        OTP: "DSD3QW",
      });
    }).rejects.toThrowError(HttpProtocol);
  });

  it("should throw one error because the otp is expired", async () => {
    const usersDatabase = new UsersDatabase();
    const userCacheRepositories = new UsersCacheRepo();
    const bcryptAdapter = new BcryptAdapter();
    const jwt = new JwtAdapter();

    const user = await usersDatabase.create(
      usersFactory({
        email: new Email("test@email.com"),
        OTP: new OTP("D38W7H"),
        OTPexpires: Date.now() - 2000,
        accept2FA: true,
      })
    );

    const getTokenService = new GetTokenService(
      userCacheRepositories,
      bcryptAdapter,
      usersDatabase,
      jwt
    );

    expect(async () => {
      await getTokenService.exec({
        ip: "0.0.0.0/0",
        email: user.email.value,
        OTP: user.OTP?.value,
      });
    }).rejects.toThrowError(HttpProtocol);
  });

  it("should throw one error because the accept2FA field is empty", async () => {
    const usersDatabase = new UsersDatabase();
    const userCacheRepositories = new UsersCacheRepo();
    const bcryptAdapter = new BcryptAdapter();
    const jwt = new JwtAdapter();

    const user = await usersDatabase.create(
      usersFactory({
        email: new Email("test@email.com"),
        OTP: new OTP("D38W7H"),
        OTPexpires: Date.now() + 2000,
        accept2FA: false,
      })
    );

    const getTokenService = new GetTokenService(
      userCacheRepositories,
      bcryptAdapter,
      usersDatabase,
      jwt
    );

    expect(async () => {
      await getTokenService.exec({
        ip: "0.0.0.0/0",
        email: user.email.value,
        OTP: user.OTP?.value,
      });
    }).rejects.toThrowError(HttpProtocol);
  });

  it("should throw one error because user doesn't exist", async () => {
    const usersDatabase = new UsersDatabase();
    const userCacheRepositories = new UsersCacheRepo();
    const bcryptAdapter = new BcryptAdapter();
    const jwt = new JwtAdapter();

    const user = await usersDatabase.create(
      usersFactory({
        email: new Email("test@email.com"),
        OTP: new OTP("D38W7H"),
        OTPexpires: Date.now() + 2000,
        accept2FA: false,
      })
    );

    const getTokenService = new GetTokenService(
      userCacheRepositories,
      bcryptAdapter,
      usersDatabase,
      jwt
    );

    expect(async () => {
      await getTokenService.exec({
        ip: "0.0.0.0/0",
        email: user.email.value,
        OTP: user.OTP?.value,
      });
    }).rejects.toThrowError(HttpProtocol);
  });

  it("should throw one error because the OTP is wrong", async () => {
    const usersDatabase = new UsersDatabase();
    const userCacheRepositories = new UsersCacheRepo();
    const bcryptAdapter = new BcryptAdapter();
    const jwt = new JwtAdapter();

    const getTokenService = new GetTokenService(
      userCacheRepositories,
      bcryptAdapter,
      usersDatabase,
      jwt
    );

    expect(async () => {
      await getTokenService.exec({
        ip: "0.0.0.0/0",
        email: "fake email",
        OTP: "fake OTP",
      });
    }).rejects.toThrowError(HttpProtocol);
  });
});
