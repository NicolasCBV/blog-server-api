import { Request, Response, NextFunction } from "express";
import { CheckTokenService } from "@services/Account/Auth/CheckTokenService";

import { JwtAdapter } from "@adapters/jwtAdapter/jwtAdapter";
import { PrismaUsersAdapter } from "@db/prismaAdapter/prismaUsersAdapter";
import { RedisAdapter } from "@cache/redis/RedisAdapter";

export default async function AuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const [, token] = req.headers.authorization?.split(" ") || "";

  const jwtAdapter = new JwtAdapter();
  const prismaUserAdapter = new PrismaUsersAdapter();
  const redisAdapter = new RedisAdapter();

  const tokenService = new CheckTokenService(
    redisAdapter,
    jwtAdapter,
    prismaUserAdapter
  );

  tokenService
    .exec({ token })
    .then((data) => {
      res.locals = {
        ...res.locals,
        userData: {
          id: data.id,
          idToken: data.idToken,
          admin: data.admin,
          name: data.name,
          email: data.email,
        },
      };
      next();
    })
    .catch((err) => {
      next(err);
    });
}
