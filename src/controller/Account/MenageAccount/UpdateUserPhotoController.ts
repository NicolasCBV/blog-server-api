import { NextFunction, Request, Response } from "express";
import { setMulter } from "@config/multerForUsers";

import { UpdateUserPhotoService } from "@services/Account/MenageAccount/UpdateUserPhotoService";

import { PrismaUsersAdapter } from "@db/prismaAdapter/prismaUsersAdapter";

import { returnObject } from "@utils/ReturnStructure";
import { RedisAdapter } from "@cache/redis/RedisAdapter";

export async function UpdateUserPhotoServiceController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { email } = res?.locals?.userData;

  const prismaUserAdapter = new PrismaUsersAdapter();
  const redisAdapter = new RedisAdapter();

  const updateUserPhotoService = new UpdateUserPhotoService(
    redisAdapter,
    prismaUserAdapter
  );
  const upload = setMulter(email).single("userPhoto");

  upload(req, res, (err) => {
    if (err) next(err);

    const file = req?.file;
    const filename = file?.filename.replaceAll(" ", "_");

    updateUserPhotoService
      .exec({ email, filename })
      .then((data) => {
        return returnObject(res, {
          name: "Query: update user photo",
          statusCode: process.env.OK as string,
          content: data || undefined,
        });
      })
      .catch((err) => next(err));
  });
}
