import { Request, Response, NextFunction } from "express";

import { RedisAdapter } from "@cache/redis/RedisAdapter";

import { WatchIpService } from "@services/watchIpService";

export async function PreventDDOSMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const ip = req.ip;

  const redisAdapter = new RedisAdapter();
  const watchIpService = new WatchIpService(redisAdapter);

  const timeout = 1000 * 60 * 5;
  const expiresIn = 1000 * 2;

  watchIpService
    .exec({
      tag: "preventDDOS",
      ip,
      limitCounter: 18,
      timeout,
      expiresIn,
    })
    .then(() => next())
    .catch((err) => {
      next(err);
    });
}
