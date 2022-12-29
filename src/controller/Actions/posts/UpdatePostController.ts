import { NextFunction, Request, Response } from "express";
import { UpdatePostService } from "@services/Actions/posts/UpdatePostService";

import { PrismaPostsAdapter } from "@db/prismaAdapter/prismaPostsAdapter";

import { returnObject } from "@utils/ReturnStructure";

export async function UpdatePostController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { id, name, description, content } = req?.body;
  const { admin } = res?.locals?.userData;

  const prismaPostAdapter = new PrismaPostsAdapter();

  const updatePost = new UpdatePostService(prismaPostAdapter);

  updatePost
    .exec({ admin, id, name, description, content })
    .then((data) => {
      return returnObject(res, {
        name: "Query: update post",
        statusCode: process.env.OK as string,
      });
    })
    .catch((err) => {
      next(err);
    });
}
