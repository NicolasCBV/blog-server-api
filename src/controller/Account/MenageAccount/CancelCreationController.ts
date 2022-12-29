import { NextFunction, Request, Response } from "express";
import { CancelCreationService } from "@services/Account/MenageAccount/CancelCreationService";

import { BcryptAdapter } from "@adapters/bcryptAdapter/bcryptAdapter";
import { PrismaUsersAdapter } from "@db/prismaAdapter/prismaUsersAdapter";

import { returnObject } from "@utils/ReturnStructure";
import { RedisAdapter } from "@cache/redis/RedisAdapter";

export async function CancelCreationController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { email, password } = req?.body;

  const prismaUserAdapter = new PrismaUsersAdapter();
  const cryptAdapter = new BcryptAdapter();
  const redisAdapter = new RedisAdapter();

  const cancelCreation = new CancelCreationService(
    redisAdapter,
    prismaUserAdapter,
    cryptAdapter
  );

  cancelCreation
    .exec({ email, password })
    .then(() => {
      return returnObject(res, {
        name: "Query: cancel creation user process",
        statusCode: process.env.OK as string,
      });
    })
    .catch((err) => {
      next(err);
    });
}
