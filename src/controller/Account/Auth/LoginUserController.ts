import { Request, Response, NextFunction } from "express";
import { LoginUserService } from "@services/Account/Auth/LoginUserService";

import { BcryptAdapter } from "@adapters/bcryptAdapter/bcryptAdapter";
import { NodemailerMailAdapter } from "@adapters/nodemailer/nodemailerAdapter";
import { JwtAdapter } from "@adapters/jwtAdapter/jwtAdapter";
import { PrismaUsersAdapter } from "@db/prismaAdapter/prismaUsersAdapter";
import { RedisAdapter } from "@cache/redis/RedisAdapter";

import { returnObject } from "@utils/ReturnStructure";

export async function LoginUserController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { email, password } = req?.body;
  const ip = req?.ip;

  const bcryptAdapter = new BcryptAdapter();
  const nodemailerAdapter = new NodemailerMailAdapter();
  const prismaUsersAdapter = new PrismaUsersAdapter();
  const jwtAdapter = new JwtAdapter();
  const redisAdapter = new RedisAdapter();

  const LoginUser = new LoginUserService(
    bcryptAdapter,
    nodemailerAdapter,
    prismaUsersAdapter,
    jwtAdapter,
    redisAdapter
  );

  LoginUser.exec({ ip, email, password })
    .then((data) => {
      return returnObject(res, {
        name: "Qury: login user",
        statusCode: process.env.OK as string,
        content: data,
      });
    })
    .catch((err) => next(err));
}
