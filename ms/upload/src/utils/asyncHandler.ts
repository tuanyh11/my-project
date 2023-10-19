import { NextFunction, Request, RequestHandler, Response } from "express";

const asyncHandler = function (
  func: (req: Request, res: Response) => Promise<any>
) {
  return (req: Request, res: Response, next: NextFunction) => {
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