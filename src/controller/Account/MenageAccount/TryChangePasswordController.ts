import { Request, Response, NextFunction } from "express";

import { TryChangePasswordService } from "@services/Account/MenageAccount/TryChangePasswordService";

import { JwtAdapter } from "@adapters/jwtAdapter/jwtAdapter";
import { PrismaUsersAdapter } from "@db/prismaAdapter/prismaUsersAdapter";
import { NodemailerMailAdapter } from "@adapters/nodemailer/nodemailerAdapter";
import { RedisAdapter } from "@cache/redis/RedisAdapter";

import { returnObject } from "@utils/ReturnStructure";

export async function TryChangePasswordController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { email } = req?.params;

  const prismaUserAdapter = new PrismaUsersAdapter();
  const jwtAdapter = new JwtAdapter();
  const nodemailerAdapter = new NodemailerMailAdapter();
  const redisAdapter = new RedisAdapter();

  const tryChangePasswordService = new TryChangePasswordService(
    prismaUserAdapter,
    jwtAdapter,
    redisAdapter,
    nodemailerAdapter
  );

  tryChangePasswordService
    .exec({ email })
    .then(() => {
      return returnObject(res, {
        name: "Query: change password",
        statusCode: process.env.OK as string,
      });
    })
    .catch((err) => {
      return next(err);
    });
}
