import jwt from "jsonwebtoken"

export const SECRET = "TOKEN";

export const generateToken = (id: string) => {
  return jwt.sign({ id }, SECRET.toString(), { expiresIn: "1d" });
};


export const generateRefreshToken = (id: string) => {
  return jwt.sign({ id }, SECRET.toString(), { expiresIn: "3d" });
};

