import { Response } from "express";

export type ReturnStructure = {
  name: string;
  statusCode: string;
  desc?: string;
  content?: {};
};

export const returnObject = (res: Response, objectContent: ReturnStructure) => {
  const object: ReturnStructure = objectContent;

  return res.status(Number(object.statusCode)).json(object);
};
