import { Email } from "@entities/userTable/email";
import { HttpProtocol } from "@errors/http/httpErrors";
import { UserObject } from "@mappers/redisUser";
import { usersFactory } from "@tests/factories/userFactory";
import { UsersCacheRepo } from "@tests/inMemoryDatabases/user/cache/usersCache";
import { UsersDatabase } from "@tests/inMemoryDatabases/user/db/usersDatabase";
import { UpdateNameOrDescService } from "./UpdateNameOrDescService";

jest.mock("node:events");

jest.spyOn(UsersCacheRepo.prototype, "create");

describe("Update name or desc", () => {
  it("should be able to update name or desc of user", async () => {
    const userCacheRepositories = new UsersCacheRepo();
    const userDatabase = new UsersDatabase();

    const user = usersFactory({ email: new Email("test@email.com") });

    const { name, description } = user;

    await userDatabase.create(user);

    const updateNameOrDesc = new UpdateNameOrDescService(
      userCacheRepositories,
      userDatabase
    );

    await updateNameOrDesc.exec({
      email: user.email.value,
      name: "new name",
      desc: "new description",
    });

    expect(userCacheRepositories.create).toBeCalled();

    const rawNewUser = await userCacheRepositories.search(
      "user:test@email.com"
    );
    const newUser = UserObject.toDomain(JSON.parse(rawNewUser as string));

    expect(newUser.name.value).not.toEqual(name.value);
    expect(newUser.description?.value).not.toEqual(description?.value);
  });

  it("should throw one error: user doesn't exist", async () => {
    const userCacheRepositories = new UsersCacheRepo();
    const userDatabase = new UsersDatabase();

    const user = usersFactory({ email: new Email("test@email.com") });

    const updateNameOrDesc = new UpdateNameOrDescService(
      userCacheRepositories,
      userDatabase
    );

    expect(async () => {
      await updateNameOrDesc.exec({
        email: user.email.value,
        name: "new name",
        desc: "new description",
      });
    }).rejects.toThrowError(HttpProtocol);
  });

  it("should throw one error: forbidden name", async () => {
    const userCacheRepositories = new UsersCacheRepo();
    const userDatabase = new UsersDatabase();

    const user = usersFactory({ email: new Email("test@email.com") });

    await userDatabase.create(user);

    const updateNameOrDesc = new UpdateNameOrDescService(
      userCacheRepositories,
      userDatabase
    );

    expect(async () => {
      await updateNameOrDesc.exec({
        email: user.email.value,
        name: "username",
        desc: "new description",
      });
    }).rejects.toThrowError(HttpProtocol);
  });

  it("should throw one error: description length is to much", async () => {
    const userCacheRepositories = new UsersCacheRepo();
    const userDatabase = new UsersDatabase();

    const user = usersFactory({ email: new Email("test@email.com") });

    await userDatabase.create(user);

    const updateNameOrDesc = new UpdateNameOrDescService(
      userCacheRepositories,
      userDatabase
    );
    expect(async () => {
      await updateNameOrDesc.exec({
        email: user.email.value,
        name: "new name",
        desc: "a".repeat(257),
      });
    }).rejects.toThrowError(HttpProtocol);
  });

  it("should throw one error: name length is to much", async () => {
    const userCacheRepositories = new UsersCacheRepo();
    const userDatabase = new UsersDatabase();

    const user = usersFactory({ email: new Email("test@email.com") });

    await userDatabase.create(user);

    const updateNameOrDesc = new UpdateNameOrDescService(
      userCacheRepositories,
      userDatabase
    );

    expect(async () => {
      await updateNameOrDesc.exec({
        email: user.email.value,
        name: "a".repeat(65),
        desc: "new description",
      });
    }).rejects.toThrowError(HttpProtocol);
  });
});
