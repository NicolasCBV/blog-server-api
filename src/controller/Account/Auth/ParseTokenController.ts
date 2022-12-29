import { NextFunction, Request, Response } from "express";

import { JwtAdapter } from "@adapters/jwtAdapter/jwtAdapter";
import { PrismaUsersAdapter } from "@db/prismaAdapter/prismaUsersAdapter";
import { RedisAdapter } from "@cache/redis/RedisAdapter";

import { CheckTokenService } from "@services/Account/Auth/CheckTokenService";

import { returnObject } from "@utils/ReturnStructure";

export function ParseTokenController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const [, token] = req?.headers?.authorization?.split(" ") || "";

  const jwtAdapter = new JwtAdapter();
  const prismaUserAdapter = new PrismaUsersAdapter();
  const redisAdapter = new RedisAdapter();
  const tokenService = new CheckTokenService(
    redisAdapter,
    jwtAdapter,
    prismaUserAdapter
  );

  tokenService
    .exec({ token })
    .then((data) => {
      return returnObject(res, {
        name: "Query: parse token",
        statusCode: process.env.OK as string,
        content: data,
      });
    })
    .catch((err) => {
      next(err);
    });
}
