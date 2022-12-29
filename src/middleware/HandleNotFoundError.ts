import { Request, Response, NextFunction } from "express";

import { returnObject } from "@utils/ReturnStructure";

export function HandleNotFoundError(
  req: Request,
  res: Response,
  next: NextFunction
) {
  return returnObject(res, {
    name: "not-found",
    statusCode: process.env.NOT_FOUND as string,
    desc: "This route doesn't exist",
  });
}
