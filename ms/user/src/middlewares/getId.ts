import { NextFunction, Request, Response } from "express";
import { TRequest } from "../types";

function getId(
  req: TRequest,
  res: Response,
  next: NextFunction
) {
  const id = req.params.id;
  req.id = id;
  next();
}

export default getId