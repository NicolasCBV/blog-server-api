import { Request, Response, NextFunction } from "express";

import { PrismaPostsAdapter } from "@db/prismaAdapter/prismaPostsAdapter";
import { DeletePostService } from "@services/Actions/posts/DeletePostService";

import { returnObject } from "@utils/ReturnStructure";

export function DeletePostController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { id } = req?.params;
  const { admin } = res?.locals?.userData;

  const prismaPostAdapter = new PrismaPostsAdapter();

  const getPostService = new DeletePostService(prismaPostAdapter);

  getPostService
    .exec({ id, admin })
    .then(() => {
      return returnObject(res, {
        name: "Query: delete post",
        statusCode: process.env.OK as string,
      });
    })
    .catch((err) => {
      if (err && !err.message.includes("no such file or directory")) {
        next(err);
      }
    });
}
