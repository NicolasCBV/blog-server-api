import { BcryptAdapter } from "@adapters/bcryptAdapter/bcryptAdapter";
import { Email } from "@entities/userTable/email";
import { HttpProtocol } from "@errors/http/httpErrors";
import { UserObject } from "@mappers/redisUser";
import { usersFactory } from "@tests/factories/userFactory";
import { UsersCacheRepo } from "@tests/inMemoryDatabases/user/cache/usersCache";
import { UsersDatabase } from "@tests/inMemoryDatabases/user/db/usersDatabase";
import { CancelCreationService } from "./CancelCreationService";

jest.mock("bcrypt", () => ({
  compare: jest.fn().mockReturnValue(true),
  hash: jest.fn().mockReturnValue("hashed string"),
}));

describe("Cancel creation test", () => {
  it("should be able to cancel the user", async () => {
    const userCacheRepo = new UsersCacheRepo();
    const usersDatabase = new UsersDatabase();
    const bcryptAdapter = new BcryptAdapter();

    const userData = usersFactory({
      active: false,
      email: new Email("test@email.com"),
    });

    await userCacheRepo.create({
      key: "user:test@email.com",
      value: JSON.stringify(UserObject.toRedis(userData)),
    });

    const cancelCreationService = new CancelCreationService(
      userCacheRepo,
      usersDatabase,
      bcryptAdapter
    );

    await cancelCreationService.exec({
      email: userData.email.value,
      password: userData.password.value,
    });

    expect(userCacheRepo.UsersDatabase).toHaveLength(0);
  });

  it("should throw one error: user doesn't exist", async () => {
    const userCacheRepo = new UsersCacheRepo();
    const usersDatabase = new UsersDatabase();
    const bcryptAdapter = new BcryptAdapter();

    const cancelCreationService = new CancelCreationService(
      userCacheRepo,
      usersDatabase,
      bcryptAdapter
    );

    expect(async () => {
      await cancelCreationService.exec({
        email: "fake email",
        password: "fake password",
      });
    }).rejects.toThrowError(HttpProtocol);
  });

  it("should throw one error: user was activated", async () => {
    const userCacheRepo = new UsersCacheRepo();
    const usersDatabase = new UsersDatabase();
    const bcryptAdapter = new BcryptAdapter();

    const userData = usersFactory({
      active: true,
      email: new Email("test@email.com"),
    });

    await userCacheRepo.create({
      key: "user:test@email.com",
      value: JSON.stringify(UserObject.toRedis(userData)),
    });

    const cancelCreationService = new CancelCreationService(
      userCacheRepo,
      usersDatabase,
      bcryptAdapter
    );

    expect(async () => {
      await cancelCreationService.exec({
        email: userData.email.value,
        password: userData.password.value,
      });
    }).rejects.toThrowError(HttpProtocol);
  });

  it("should throw one error: user already in database", async () => {
    const userCacheRepo = new UsersCacheRepo();
    const usersDatabase = new UsersDatabase();
    const bcryptAdapter = new BcryptAdapter();

    const userData = usersFactory({
      active: false,
      email: new Email("test@email.com"),
    });

    await usersDatabase.create(userData);
    await userCacheRepo.create({
      key: "user:test@email.com",
      value: JSON.stringify(UserObject.toRedis(userData)),
    });

    const cancelCreationService = new CancelCreationService(
      userCacheRepo,
      usersDatabase,
      bcryptAdapter
    );

    expect(async () => {
      await cancelCreationService.exec({
        email: userData.email.value,
        password: userData.password.value,
      });
    }).rejects.toThrowError(HttpProtocol);
  });

  it("should throw one error: wrong password", async () => {
    const userCacheRepo = new UsersCacheRepo();
    const usersDatabase = new UsersDatabase();
    const bcryptAdapter = new BcryptAdapter();

    jest
      .spyOn(BcryptAdapter.prototype, "compare")
      .mockImplementation(async () => false);

    const userData = usersFactory({
      active: false,
      email: new Email("test@email.com"),
    });

    await userCacheRepo.create({
      key: "user:test@email.com",
      value: JSON.stringify(UserObject.toRedis(userData)),
    });

    const cancelCreationService = new CancelCreationService(
      userCacheRepo,
      usersDatabase,
      bcryptAdapter
    );

    expect(async () => {
      await cancelCreationService.exec({
        email: userData.email.value,
        password: "123",
      });
    }).rejects.toThrowError(HttpProtocol);
  });
});
