import { NextFunction, Request, Response } from "express";
import { Modify2FAService } from "@services/Account/MenageAccount/Modify2FAService";

import { PrismaUsersAdapter } from "@db/prismaAdapter/prismaUsersAdapter";
import { JwtAdapter } from "@adapters/jwtAdapter/jwtAdapter";
import { RedisAdapter } from "@cache/redis/RedisAdapter";

import { returnObject } from "@utils/ReturnStructure";

export async function Modify2FAController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { email } = res?.locals?.userData;
  const { newStatus } = req?.body;

  const prismaUsersAdapter = new PrismaUsersAdapter();
  const jwtAdapter = new JwtAdapter();
  const redisAdapter = new RedisAdapter();

  const enable2FA = new Modify2FAService(
    redisAdapter,
    prismaUsersAdapter,
    jwtAdapter
  );

  enable2FA
    .exec({ email, newStatus })
    .then((data) => {
      return returnObject(res, {
        name: "Query: modify2FA",
        statusCode: process.env.OK as string,
        content: data,
      });
    })
    .catch((err) => next(err));
}
