import { Request, Response, NextFunction } from "express";
import { SendPostForUsersService } from "@services/Actions/posts/SendPostForUsersService";

import { PrismaPostsAdapter } from "@db/prismaAdapter/prismaPostsAdapter";
import { PrismaUsersAdapter } from "@db/prismaAdapter/prismaUsersAdapter";
import { NodemailerMailAdapter } from "@adapters/nodemailer/nodemailerAdapter";

import { returnObject } from "@utils/ReturnStructure";

export function SendPostForUsersController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { postId } = req?.body;
  const { admin } = res?.locals?.userData;

  const prismaUsersAdapter = new PrismaUsersAdapter();
  const prismaPostsAdapter = new PrismaPostsAdapter();
  const nodeMailerAdapter = new NodemailerMailAdapter();

  const sendPostForUsersService = new SendPostForUsersService(
    prismaUsersAdapter,
    prismaPostsAdapter,
    nodeMailerAdapter
  );

  sendPostForUsersService
    .exec({ postId, admin })
    .then(() => {
      return returnObject(res, {
        name: "Query: send post for users",
        statusCode: process.env.OK as string,
      });
    })
    .catch((err) => {
      next(err);
    });
}
