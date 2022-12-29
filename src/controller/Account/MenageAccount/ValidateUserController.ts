import { NextFunction, Request, Response } from "express";
import { ValidateUserService } from "@services/Account/MenageAccount/ValidateUserService";

import { BcryptAdapter } from "@adapters/bcryptAdapter/bcryptAdapter";
import { JwtAdapter } from "@adapters/jwtAdapter/jwtAdapter";
import { PrismaUsersAdapter } from "@db/prismaAdapter/prismaUsersAdapter";
import { RedisAdapter } from "@cache/redis/RedisAdapter";

import { returnObject } from "@utils/ReturnStructure";

export function ValidateUserController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { email, OTP } = req?.body;

  const prismaUsersAdapter = new PrismaUsersAdapter();
  const jwtAdapter = new JwtAdapter();
  const bcrypt = new BcryptAdapter();
  const redisAdapter = new RedisAdapter();

  const validateService = new ValidateUserService(
    redisAdapter,
    prismaUsersAdapter,
    bcrypt,
    jwtAdapter
  );

  validateService
    .exec({ email, OTP })
    .then((data) => {
      return returnObject(res, {
        name: "Query: validate user",
        statusCode: process.env.OK as string,
        content: data,
      });
    })
    .catch((err) => next(err));
}
