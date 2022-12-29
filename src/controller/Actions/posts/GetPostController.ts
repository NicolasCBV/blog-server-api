import { NextFunction, Request, Response } from "express";
import { GetPostService } from "@services/Actions/posts/GetPostService";

import { PrismaPostsAdapter } from "@db/prismaAdapter/prismaPostsAdapter";
import { PrismaUsersAdapter } from "@db/prismaAdapter/prismaUsersAdapter";

import { returnObject } from "@utils/ReturnStructure";

export async function GetPostController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { id } = req?.params;

  const prismaPostAdapter = new PrismaPostsAdapter();
  const prismaUserAdapter = new PrismaUsersAdapter();

  const getPostService = new GetPostService(
    prismaUserAdapter,
    prismaPostAdapter
  );

  getPostService
    .exec({ id })
    .then((data) => {
      return returnObject(res, {
        name: "Query: get post",
        statusCode: process.env.OK as string,
        content: data,
      });
    })
    .catch((err) => next(err));
}
