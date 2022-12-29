/* eslint-disable */

import { UsersCacheRepo } from "@tests/inMemoryDatabases/user/cache/usersCache";
import { MachineData, WatchIpService } from "@services/watchIpService";
import { HttpProtocol } from "@errors/http/httpErrors";

describe("Watch ip test", () => {
  it("should be able to watch ip's", async () => {
    const userCacheRepo = new UsersCacheRepo();

    const watchIpService = new WatchIpService(userCacheRepo);

    await watchIpService.exec({
      tag: "test",
      ip: "0.0.0.0/0",
      limitCounter: 5,
      expiresIn: 1000,
      timeout: 0,
    });

    expect(userCacheRepo.UsersDatabase).toHaveLength(1);
  });

  it("should be able to remove the ban", async () => {
    const userCacheRepo = new UsersCacheRepo();

    const machineData: MachineData = {
      ip: "test/0.0.0.0/0",
      count: 5,
      expires: 1000,
      timeout: 1000,
    };

    await userCacheRepo.create({
      key: machineData.ip,
      value: JSON.stringify(machineData),
    });

    const watchIpService = new WatchIpService(userCacheRepo);

    await watchIpService.exec({
      tag: "test",
      ip: "0.0.0.0/0",
      limitCounter: 4,
      expiresIn: 1000,
      timeout: 1000,
    });

    const ip = await userCacheRepo.search("test/0.0.0.0/0") as string;

    expect(JSON.parse(ip)?.count).toEqual(1);
  });

  it("should be able to renew expires time", async () => {
    const userCacheRepo = new UsersCacheRepo();

    const machineData: MachineData = {
      ip: "test/0.0.0.0/0",
      count: 5,
      expires: 100,
      timeout: 1000,
    };

    await userCacheRepo.create({
      key: machineData.ip,
      value: JSON.stringify(machineData),
    });

    const watchIpService = new WatchIpService(userCacheRepo);

    await watchIpService.exec({
      tag: "test",
      ip: "0.0.0.0/0",
      limitCounter: 6,
      expiresIn: 1000,
      timeout: 1000,
    });

    const ip = await userCacheRepo.search("test/0.0.0.0/0") as string;

    expect(JSON.parse(ip)?.count).toEqual(1);
  });

  it("should throw error: To much request", async () => {
    const userCacheRepo = new UsersCacheRepo();

    const machineData: MachineData = {
      ip: "test/0.0.0.0/0",
      count: 5,
      expires: 1000,
      timeout: 100,
    };

    await userCacheRepo.create({
      key: machineData.ip,
      value: JSON.stringify(machineData),
    });

    const watchIpService = new WatchIpService(userCacheRepo);

    expect(
      watchIpService.exec({
        tag: "test",
        ip: "0.0.0.0/0",
        limitCounter: 1,
        expiresIn: 1000,
        timeout: 1000,
      })
    ).rejects.toThrowError(HttpProtocol);
  });
});
