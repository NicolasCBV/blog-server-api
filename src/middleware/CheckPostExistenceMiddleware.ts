import { NextFunction, Request, Response } from "express";
import { PrismaPostsAdapter } from "@db/prismaAdapter/prismaPostsAdapter";
import { CheckPostExistenceService } from "@services/Actions/posts/CheckPostExistenceService";

export async function CheckPostExistenceMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { id } = req.params;

  const prismaPostAdapter = new PrismaPostsAdapter();
  const checkPostExistenceService = new CheckPostExistenceService(
    prismaPostAdapter
  );

  checkPostExistenceService
    .exec({ id })
    .then((data) => {
      res.locals.postData = data;
      next();
    })
    .catch((err) => next(err));
}
