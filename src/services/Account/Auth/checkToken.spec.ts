import { JwtAdapter } from "@adapters/jwtAdapter/jwtAdapter";
import { TokenMapper } from "@adapters/mappers/tokenMapper";
import { HttpProtocol } from "@errors/http/httpErrors";
import { usersFactory } from "@tests/factories/userFactory";
import { UsersCacheRepo } from "@tests/inMemoryDatabases/user/cache/usersCache";
import { UsersDatabase } from "@tests/inMemoryDatabases/user/db/usersDatabase";
import { CheckTokenService } from "./CheckTokenService";

describe("DefaultPermClass test", () => {
  it("should be able to catch users on cache", async () => {
    const userCacheRepo = new UsersCacheRepo();
    const usersDatabase = new UsersDatabase();
    const jwtAdapter = new JwtAdapter();

    const checkTokenService = new CheckTokenService(
      userCacheRepo,
      jwtAdapter,
      usersDatabase
    );

    const user = await usersDatabase.create(usersFactory());
    const { token } = jwtAdapter.encode({
      PartialSession: TokenMapper.toToken(user),
    });

    expect(async () => {
      await checkTokenService.exec({ token });
    }).rejects.toThrowError(HttpProtocol);
  });

  it("should throw one error: just one segment", async () => {
    const userCacheRepo = new UsersCacheRepo();
    const usersDatabase = new UsersDatabase();
    const jwtAdapter = new JwtAdapter();

    const checkTokenService = new CheckTokenService(
      userCacheRepo,
      jwtAdapter,
      usersDatabase
    );

    const user = await usersDatabase.create(usersFactory());
    const { token } = jwtAdapter.encode({
      PartialSession: TokenMapper.toToken(user),
    });

    expect(async () => {
      await checkTokenService.exec({ token: token.split(".")[0] });
    }).rejects.toThrowError(HttpProtocol);
  });

  it("should throw one error: to much segment", async () => {
    const userCacheRepo = new UsersCacheRepo();
    const usersDatabase = new UsersDatabase();
    const jwtAdapter = new JwtAdapter();

    const checkTokenService = new CheckTokenService(
      userCacheRepo,
      jwtAdapter,
      usersDatabase
    );

    const user = await usersDatabase.create(usersFactory());
    const { token } = jwtAdapter.encode({
      PartialSession: TokenMapper.toToken(user),
    });

    expect(async () => {
      await checkTokenService.exec({
        token: token.split(".")[0] + "." + token.repeat(2),
      });
    }).rejects.toThrowError(HttpProtocol);
  });

  it("should throw one error: token doesn't exist", async () => {
    const userCacheRepo = new UsersCacheRepo();
    const usersDatabase = new UsersDatabase();
    const jwtAdapter = new JwtAdapter();

    const checkTokenService = new CheckTokenService(
      userCacheRepo,
      jwtAdapter,
      usersDatabase
    );

    await usersDatabase.create(usersFactory());

    expect(async () => {
      await checkTokenService.exec({ token: "" });
    }).rejects.toThrowError(HttpProtocol);
  });

  it("should throw one error: token doesn't exist", async () => {
    const userCacheRepo = new UsersCacheRepo();
    const usersDatabase = new UsersDatabase();
    const jwtAdapter = new JwtAdapter();

    const checkTokenService = new CheckTokenService(
      userCacheRepo,
      jwtAdapter,
      usersDatabase
    );

    const { token } = jwtAdapter.encode({
      PartialSession: TokenMapper.toToken(usersFactory()),
    });

    expect(async () => {
      await checkTokenService.exec({ token });
    }).rejects.toThrowError(HttpProtocol);
  });
});
