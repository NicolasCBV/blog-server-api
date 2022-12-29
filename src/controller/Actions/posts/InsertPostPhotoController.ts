import { NextFunction, Request, Response } from "express";
import { InsertPostPhotoService } from "@services/Actions/posts/InsertPostPhotoService";

import { setMulter } from "@config/multerForPosts";

import { PrismaPostsAdapter } from "@db/prismaAdapter/prismaPostsAdapter";

import { returnObject } from "@utils/ReturnStructure";
import { PostOnHTTP } from "@viewModel/postModel";

export function InsertPostPhotoController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const prismaPostAdapter = new PrismaPostsAdapter();
  const insertPostPhoto = new InsertPostPhotoService(prismaPostAdapter);

  const post: PostOnHTTP = res?.locals?.postData;
  const { name: rawName }: PostOnHTTP = post;
  const name = rawName.replaceAll(" ", "_");

  const upload = setMulter(name).single("postPhoto");

  upload(req, res, (err) => {
    if (err) next(err);

    const { id } = req.params;
    const file = req.file;
    const { admin } = res.locals.userData;

    insertPostPhoto
      .exec({
        admin,
        post,
        filename: file!.filename,
        id,
      })
      .then(() => {
        return returnObject(res, {
          name: "Query: insert-post-photo",
          statusCode: process.env.OK as string,
        });
      })
      .catch((err) => {
        next(err);
      });
  });
}
