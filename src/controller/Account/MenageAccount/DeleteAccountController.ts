import { NextFunction, Response, Request } from "express";
import { DeleteAccountService } from "@services/Account/MenageAccount/DeleteAccountService";

import { PrismaUsersAdapter } from "@db/prismaAdapter/prismaUsersAdapter";
import { RedisAdapter } from "@cache/redis/RedisAdapter";

import { returnObject } from "@utils/ReturnStructure";

export async function DeleteAccountController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { email } = res?.locals?.userData;

  const usersAdapter = new PrismaUsersAdapter();
  const redisAdapter = new RedisAdapter();

  const DeleteAccount = new DeleteAccountService(redisAdapter, usersAdapter);

  DeleteAccount.exec({ email })
    .then(() => {
      return returnObject(res, {
        name: "Query: delete user",
        statusCode: process.env.OK as string,
      });
    })
    .catch((err) => {
      next(err);
    });
}
