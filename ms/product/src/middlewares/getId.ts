import { NextFunction, Request, Response } from "express";
import validateMongoDbId from "../utils/validateMongodbId";
import { TRequest } from "../types";

function getId(
  req: TRequest,
  res: Response,
  next: NextFunction
) {
  const id = req.params.id;
  validateMongoDbId(id);
  req.id = id;
  next();
}

export default getId