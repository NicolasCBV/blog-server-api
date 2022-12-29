import { NextFunction, Request, Response } from "express";

import { PrismaUsersAdapter } from "@db/prismaAdapter/prismaUsersAdapter";
import { RedisAdapter } from "@cache/redis/RedisAdapter";
import { SearchForUserService } from "@services/Account/MenageAccount/SearchForUserService";

import { returnObject } from "@utils/ReturnStructure";

export function SearchForUserController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { email } = req?.params;

  const prismaUserAdapter = new PrismaUsersAdapter();
  const redisAdapter = new RedisAdapter();

  const searchForUserService = new SearchForUserService(
    redisAdapter,
    prismaUserAdapter
  );

  searchForUserService
    .exec({ email })
    .then((data) => {
      return returnObject(res, {
        name: "Query: search for user",
        statusCode: process.env.OK as string,
        content: data,
      });
    })
    .catch((err) => next(err));
}
