import { NextFunction, Request, Response } from "express";

import { JwtAdapter } from "@adapters/jwtAdapter/jwtAdapter";
import { PrismaUsersAdapter } from "@db/prismaAdapter/prismaUsersAdapter";
import { RedisAdapter } from "@cache/redis/RedisAdapter";
import { RemakeTokenService } from "@services/Account/Auth/RemakeTokenService";

import { returnObject } from "@utils/ReturnStructure";

export async function RemakeTokenController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { email } = res?.locals?.userData;

  const prismaUserAdapter = new PrismaUsersAdapter();
  const tokenAdapter = new JwtAdapter();
  const redisAdapter = new RedisAdapter();

  const remakeTokenService = new RemakeTokenService(
    redisAdapter,
    prismaUserAdapter,
    tokenAdapter
  );

  remakeTokenService
    .exec({ email })
    .then((data) => {
      return returnObject(res, {
        name: "Quert: remake token",
        statusCode: process.env.OK as string,
        content: data,
      });
    })
    .catch((err) => next(err));
}
