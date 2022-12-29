import { Request, Response, NextFunction } from "express";
import { CreateUserService } from "@services/Account/MenageAccount/CreateUserService";

import { BcryptAdapter } from "@adapters/bcryptAdapter/bcryptAdapter";
import { PrismaUsersAdapter } from "@db/prismaAdapter/prismaUsersAdapter";
import { NodemailerMailAdapter } from "@adapters/nodemailer/nodemailerAdapter";

import { returnObject } from "@utils/ReturnStructure";
import { RedisAdapter } from "@cache/redis/RedisAdapter";

export async function CreateUserController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { name, email, password } = req?.body;

  const bcryptAdapter = new BcryptAdapter();
  const usersAdapter = new PrismaUsersAdapter();
  const nodeMailer = new NodemailerMailAdapter();
  const redisAdapter = new RedisAdapter();

  const CreateUser = new CreateUserService(
    redisAdapter,
    bcryptAdapter,
    usersAdapter,
    nodeMailer
  );

  CreateUser.exec({ name, email, password })
    .then(() => {
      return returnObject(res, {
        name: "Query: create user",
        statusCode: process.env.OK as string,
      });
    })
    .catch((err) => {
      next(err);
    });
}
