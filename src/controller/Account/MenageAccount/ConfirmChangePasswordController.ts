import { NextFunction, Request, Response } from "express";
import { BcryptAdapter } from "@adapters/bcryptAdapter/bcryptAdapter";
import { PrismaUsersAdapter } from "@db/prismaAdapter/prismaUsersAdapter";
import { RedisAdapter } from "@cache/redis/RedisAdapter";

import { ConfirmChangePasswordService } from "@services/Account/MenageAccount/ConfirmChangePasswordService";
import { returnObject } from "@utils/ReturnStructure";

export async function ConfirmChangePasswordController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { password } = req?.body;
  const { email } = res?.locals?.userData;

  const prismaUserAdapter = new PrismaUsersAdapter();
  const bcryptAdapter = new BcryptAdapter();
  const redisAdapter = new RedisAdapter();

  const confirmChangePasswordService = new ConfirmChangePasswordService(
    prismaUserAdapter,
    redisAdapter,
    bcryptAdapter
  );

  confirmChangePasswordService
    .exec({ password, email })
    .then(() => {
      return returnObject(res, {
        name: "Query: confirm change password",
        statusCode: process.env.OK as string,
      });
    })
    .catch((err) => {
      return next(err);
    });
}
