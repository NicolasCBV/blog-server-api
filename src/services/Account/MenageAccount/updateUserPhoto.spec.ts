import { Email } from "@entities/userTable/email";
import { HttpProtocol } from "@errors/http/httpErrors";
import { UserObject } from "@mappers/redisUser";
import { usersFactory } from "@tests/factories/userFactory";
import { UsersCacheRepo } from "@tests/inMemoryDatabases/user/cache/usersCache";
import { UsersDatabase } from "@tests/inMemoryDatabases/user/db/usersDatabase";
import { UpdateUserPhotoService } from "./UpdateUserPhotoService";

jest.mock("node:events");

jest.spyOn(UsersCacheRepo.prototype, "create");

describe("Update name or desc", () => {
  it("should be able to update name or desc of user", async () => {
    const userCacheRepositories = new UsersCacheRepo();
    const userDatabase = new UsersDatabase();

    const user = usersFactory({
      email: new Email("test@email.com"),
      photo: "random url",
    });

    const { photo } = user;

    await userDatabase.create(user);

    const updateUserPhotoService = new UpdateUserPhotoService(
      userCacheRepositories,
      userDatabase
    );

    await updateUserPhotoService.exec({
      email: user.email.value,
      filename: "new filename",
    });

    expect(userCacheRepositories.create).toBeCalled();

    const rawNewUser = await userCacheRepositories.search(
      "user:test@email.com"
    );
    const newUser = UserObject.toDomain(JSON.parse(rawNewUser as string));

    expect(newUser.photo).not.toEqual(photo);
  });

  it("should throw one error: user doesn't exist", async () => {
    const userCacheRepositories = new UsersCacheRepo();
    const userDatabase = new UsersDatabase();

    const user = usersFactory({
      email: new Email("test@email.com"),
      photo: "random url",
    });

    const updateUserPhotoService = new UpdateUserPhotoService(
      userCacheRepositories,
      userDatabase
    );
    expect(async () => {
      await updateUserPhotoService.exec({
        email: user.email.value,
        filename: "new filename",
      });
    }).rejects.toThrowError(HttpProtocol);
  });
});
