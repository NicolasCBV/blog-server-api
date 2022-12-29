import { NextFunction, Request, Response } from "express";
import { GetPostsService } from "@services/Actions/posts/GetPostsService";

import { PrismaPostsAdapter } from "@db/prismaAdapter/prismaPostsAdapter";

import { returnObject } from "@utils/ReturnStructure";

export async function GetPostsController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const post = new PrismaPostsAdapter();
  const getPostsService = new GetPostsService(post);

  getPostsService
    .exec()
    .then((data) => {
      return returnObject(res, {
        name: "Query: getGroupPost",
        statusCode: process.env.OK as string,
        content: {
          data,
        },
      });
    })
    .catch((err) => {
      next(err);
    });
}
