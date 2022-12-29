import { NextFunction, Request, Response } from "express";

import { GetTokenService } from "@services/Account/Auth/GetTokenService";

import { BcryptAdapter } from "@adapters/bcryptAdapter/bcryptAdapter";
import { JwtAdapter } from "@adapters/jwtAdapter/jwtAdapter";
import { PrismaUsersAdapter } from "@db/prismaAdapter/prismaUsersAdapter";
import { RedisAdapter } from "@cache/redis/RedisAdapter";

import { returnObject } from "@utils/ReturnStructure";

export async function GetTokenController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { email, OTP } = req?.body;
  const ip = req?.ip;

  const bcryptAdapter = new BcryptAdapter();
  const prismaUsersAdapter = new PrismaUsersAdapter();
  const jwtAdapter = new JwtAdapter();
  const redisAdapter = new RedisAdapter();
  const getToken = new GetTokenService(
    redisAdapter,
    bcryptAdapter,
    prismaUsersAdapter,
    jwtAdapter
  );

  getToken
    .exec({ ip, email, OTP })
    .then((data) => {
      return returnObject(res, {
        name: "Query: get token",
        statusCode: process.env.OK as string,
        content: data,
      });
    })
    .catch((err) => next(err));
}
