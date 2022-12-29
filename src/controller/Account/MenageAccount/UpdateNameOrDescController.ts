import { NextFunction, Response, Request } from "express";

import { UpdateNameOrDescService } from "@services/Account/MenageAccount/UpdateNameOrDescService";

import { PrismaUsersAdapter } from "@db/prismaAdapter/prismaUsersAdapter";
import { RedisAdapter } from "@cache/redis/RedisAdapter";

import { returnObject } from "@utils/ReturnStructure";

export async function UpdateNameOrDescController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { email } = res?.locals?.userData;
  const { name, desc } = req?.body;

  const prismaUserAdapter = new PrismaUsersAdapter();
  const redisAdapter = new RedisAdapter();

  const updateNameOrDescService = new UpdateNameOrDescService(
    redisAdapter,
    prismaUserAdapter
  );

  updateNameOrDescService
    .exec({ email, name, desc })
    .then((data) => {
      return returnObject(res, {
        name: "Quert: update name or description",
        statusCode: process.env.OK as string,
        content: data || undefined,
      });
    })
    .catch((err) => next(err));
}
