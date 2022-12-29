import { NextFunction, Request, Response } from "express";
import { CreatePostService } from "@services/Actions/posts/CreatePostService";

import { NodemailerMailAdapter } from "@adapters/nodemailer/nodemailerAdapter";
import { PrismaPostsAdapter } from "@db/prismaAdapter/prismaPostsAdapter";
import { PrismaUsersAdapter } from "@db/prismaAdapter/prismaUsersAdapter";

import { returnObject } from "@utils/ReturnStructure";

export async function CreatePostController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { name, content, desc, creatorId } = req?.body;
  const { admin } = res?.locals?.userData;

  const prismaPostAdapter = new PrismaPostsAdapter();
  const prismaUserAdapter = new PrismaUsersAdapter();
  const nodeMailerAdapter = new NodemailerMailAdapter();

  const createPost = new CreatePostService(
    prismaPostAdapter,
    prismaUserAdapter,
    nodeMailerAdapter
  );

  createPost
    .exec({ admin, name, content, desc, creatorId })
    .then((data) => {
      return returnObject(res, {
        name: "Query: create post",
        statusCode: process.env.OK as string,
        content: data,
      });
    })
    .catch((err) => {
      next(err);
    });
}
