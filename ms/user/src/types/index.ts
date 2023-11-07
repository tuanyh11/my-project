import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      id: string;
    }
  }
}

export type TRequest = Request & {
  id: string;
  params: {
    id: string;
  };
};