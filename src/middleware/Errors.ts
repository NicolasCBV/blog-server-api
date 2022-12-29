import { Request, Response, NextFunction } from "express";
import { HttpProtocol } from "@errors/http/httpErrors";

export default function ErrorMiddleware(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof HttpProtocol) {
    return res.status(Number(err.statusCode)).json({
      name: err.name,
      statusCode: Number(err.statusCode),
      desc: err.desc,
      content: err.content,
    });
  }
  console.log(err);
  return res.status(500).json({
    error: "Internal server error",
  });
}
