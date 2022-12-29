import { Request, Response, NextFunction } from "express";

import { PrismaPostsAdapter } from "@db/prismaAdapter/prismaPostsAdapter";
import { SearchForPostService } from "@services/Actions/posts/SearchForPostService";

import { returnObject } from "@utils/ReturnStructure";

export async function SearchForPostController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { input } = req?.params;

  const prismaPostAdapter = new PrismaPostsAdapter();
  const searchForPost = new SearchForPostService(prismaPostAdapter);

  searchForPost
    .exec({ input })
    .then((data) => {
      return returnObject(res, {
        name: "Query: search for post",
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
