import { UsersCacheRepositories } from "@repositories/usersRepositories";
import { EventEmitter } from "node:events";

class NewEventEmitter extends EventEmitter {}

const eventEmitterRBFcounter = new NewEventEmitter();

interface MachineData {
  ip: string;
  count: number;
  expires: number;
  timeout: number;
}

async function ResetBruteForceCounter(
  cacheDB: UsersCacheRepositories,
  ip: string
): Promise<void> {
  const expires = 1000 * 60 * 2;
  const timeout = 1000 * 60;

  const dataMachine: MachineData = {
    ip,
    count: 1,
    expires,
    timeout,
  };

  await cacheDB.create({
    key: `preventBruteForce/${ip}`,
    value: JSON.stringify(dataMachine),
  });
}

eventEmitterRBFcounter.on("reset", async (cacheDB, ip): Promise<void> => {
  ResetBruteForceCounter(cacheDB, ip).catch((err) => console.error(err));
});

export { eventEmitterRBFcounter };
