import { ErrorRequestHandler, NextFunction, Request, Response } from "express";

type ErrorCustom = Error & {
    statusCode: number;
    status: string;
}

const errorHandler: ErrorRequestHandler  = (error: ErrorCustom, req: Request, res: Response, next: NextFunction) => {
    const code = error?.statusCode || 500;
    const status = error?.status || "error";
    const message = error?.message || "error on server";
    res.status(code).json({
      code,
      status,
      message
    });
}

export default errorHandler;