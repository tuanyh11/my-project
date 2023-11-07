import { NextFunction, Request, RequestHandler, Response } from "express";
import { TRequest } from "../types";

const asyncHandler = function (
  func: (req: TRequest, res: Response) => Promise<any>
) {
  return (req: TRequest, res: Response, next: NextFunction) => {
    func(req, res).catch(error => next(error)).then((data) => {
      return res.status(200).json({
        data,
        status: 200,
        message: "success"
      }) 
    });
  };
};

export default asyncHandler;