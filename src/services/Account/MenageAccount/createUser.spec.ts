import { BcryptAdapter } from "@adapters/bcryptAdapter/bcryptAdapter";
import { NodemailerMailAdapter } from "@adapters/nodemailer/nodemailerAdapter";
import { HttpProtocol } from "@errors/http/httpErrors";
import { usersFactory } from "@tests/factories/userFactory";
import { UsersCacheRepo } from "@tests/inMemoryDatabases/user/cache/usersCache";
import { UsersDatabase } from "@tests/inMemoryDatabases/user/db/usersDatabase";
import { TwoFactors } from "../Auth/TwoFactors";
import { CreateUserService } from "./CreateUserService";

jest.mock("node:events");

jest.useFakeTimers();
jest.spyOn(global, "setTimeout");

jest.mock("bcrypt", () => ({
  compare: jest.fn().mockReturnValue(true),
  hash: jest.fn().mockReturnValue("password"),
}));

jest.spyOn(TwoFactors.prototype, "exec").mockImplementation(async () => {});

const userCacheRepositories = new UsersCacheRepo();
const userDatabase = new UsersDatabase();
const nodemailer = new NodemailerMailAdapter();
const bcryptAdapter = new BcryptAdapter();

describe("Confirm change password test", () => {
  it("should be able to create users", async () => {
    const createUser = new CreateUserService(
      userCacheRepositories,
      bcryptAdapter,
      userDatabase,
      nodemailer
    );

    expect(
      createUser.exec({
        email: "test@email.com",
        name: "default",
        password: "password",
      })
    ).resolves.toBeUndefined();
  });

  it("should throw one error: user already exists", async () => {
    const user = await userDatabase.create(usersFactory());

    const createUser = new CreateUserService(
      userCacheRepositories,
      bcryptAdapter,
      userDatabase,
      nodemailer
    );

    expect(async () => {
      await createUser.exec({
        email: user.email.value,
        name: user.name.value,
        password: user.password.value,
      });
    }).rejects.toThrowError(HttpProtocol);
  });

  it("should throw one error: email out of range - to much", async () => {
    const createUser = new CreateUserService(
      userCacheRepositories,
      bcryptAdapter,
      userDatabase,
      nodemailer
    );

    expect(async () => {
      await createUser.exec({
        email: "a".repeat(257),
        name: "test",
        password: "password",
      });
    }).rejects.toThrowError(HttpProtocol);
  });

  it("should throw one error: name length very litle", async () => {
    const createUser = new CreateUserService(
      userCacheRepositories,
      bcryptAdapter,
      userDatabase,
      nodemailer
    );

    expect(async () => {
      await createUser.exec({
        email: "test@email.com",
        name: "u",
        password: "password",
      });
    }).rejects.toThrowError(HttpProtocol);
  });

  it("should throw one error: name length to much", async () => {
    const createUser = new CreateUserService(
      userCacheRepositories,
      bcryptAdapter,
      userDatabase,
      nodemailer
    );

    expect(async () => {
      await createUser.exec({
        email: "test@email.com",
        name: "u".repeat(65),
        password: "password",
      });
    }).rejects.toThrowError(HttpProtocol);
  });

  it("should throw one error: password length to much", async () => {
    const createUser = new CreateUserService(
      userCacheRepositories,
      bcryptAdapter,
      userDatabase,
      nodemailer
    );

    expect(async () => {
      await createUser.exec({
        email: "test@email.com",
        name: "test",
        password: "p".repeat(257),
      });
    }).rejects.toThrowError(HttpProtocol);
  });
});
