import { NextFunction, Request, Response } from "express";
import { TRequest } from "../types";
import UserPrisma from "../repositories/userRepo";

async function  defaultUser(req: TRequest, res: Response, next: NextFunction) {
  const role = req.body?.id;
  if(role) return next();
  const result = await UserPrisma.role.findFirst({
    where: {
      name: "user",
    }
  })
  req.body.roleId = result?.id;
  next();
}

export default defaultUser;
