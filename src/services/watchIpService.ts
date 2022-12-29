import { HttpProtocol } from "@errors/http/httpErrors";
import { UsersCacheRepositories } from "@repositories/usersRepositories";

export interface MachineData {
  ip: string;
  count: number;
  expires: number;
  timeout: number;
}

interface WatchIpServiceInterface {
  tag: string;
  ip: string;
  limitCounter: number;
  timeout: number;
  expiresIn: number;
}

export class WatchIpService {
  constructor(private cacheDB: UsersCacheRepositories) {}

  async exec({
    tag,
    ip,
    limitCounter,
    timeout,
    expiresIn,
  }: WatchIpServiceInterface): Promise<void> {
    const key = `${tag}/${ip}`;
    const now = Date.now();

    const rawDataMachine = await this.cacheDB.search(key);

    // First access case
    if (!rawDataMachine) {
      const initialStateObjt: MachineData = {
        ip,
        count: 1,
        expires: Date.now() + expiresIn,
        timeout: 0,
      };

      await this.cacheDB.create({
        key,
        value: JSON.stringify(initialStateObjt),
      });

      return;
    }

    const dataMachine: MachineData = JSON.parse(rawDataMachine);
    const isBannedMachine = Boolean(dataMachine.timeout);

    dataMachine.count = ++dataMachine.count;

    // Expired case
    if (dataMachine.expires <= now && !isBannedMachine) {
      dataMachine.expires = Date.now() + expiresIn;
      dataMachine.count = 1;
    }

    // Timeout case
    if (dataMachine.timeout <= now && isBannedMachine) {
      dataMachine.count = 1;
      dataMachine.timeout = 0;
    }

    // Banned case
    if (dataMachine.count >= limitCounter) {
      dataMachine.timeout =
        dataMachine.timeout >= now ? dataMachine.timeout : Date.now() + timeout;

      await this.cacheDB.create({ key, value: JSON.stringify(dataMachine) });
      throw new HttpProtocol(
        "To much request",
        process.env.MANY_REQ as string,
        "Cannot do more request"
      );
    }

    await this.cacheDB.create({ key, value: JSON.stringify(dataMachine) });
  }
}
