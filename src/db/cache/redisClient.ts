import * as redis from "redis";

const host = process.env.REDIS_HOST;
const port = process.env.REDIS_PORT;
const password = process.env.REDIS_PASSWORD;

const url = !process.env.REDIS_URL
  ? `redis://default:${password}@${host}:${port}`
  : process.env.REDIS_URL;

async function client() {
  const redisClient = redis.createClient({
    url,
  });

  await redisClient.connect();
  return redisClient;
}

export { client };
