import Joi from "joi";
import FeatureService, { TFeatureService } from "../utils/abstract";
import UserPrisma, { TUser } from "../repositories/userRepo";
import { NextFunction, Request, Response } from "express";
import jwt, { Jwt, JwtPayload } from "jsonwebtoken";
import { SECRET, generateRefreshToken, generateToken } from "../config/jwtToken";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
 
const userSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(20).required(),
  roleId: Joi.optional()
});

declare global {
  namespace Express {
    interface Request {
      user: TUser
    }
  }
}


type TBrand = TFeatureService & {
}

class UserService extends FeatureService {
  protected repository;
  constructor() {
    super({ repository: UserPrisma.user, schema: userSchema });
    this.repository = UserPrisma.user;
  }

  async isAdmin(req: Request, res: Response) {
    let token;
    if (req?.headers?.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];

      if (token) {
        const decoded = jwt.verify(token, SECRET) as JwtPayload;
        const user = await UserPrisma.user.findFirst({
          where: {
            id: decoded?.id,
          },
        });
        return user;
      }
    } else {
      throw new Error(" There is no token attached to header");
    }
  }

  async loginAdmin(req: Request, res: Response) {
    const { email, password } = req.body;

    const findAdmin = await this.repository.findFirst({
      where: {
        email,
      },
      include: {
        role: true,
      },
    });

    if (findAdmin?.role.name !== "admin") throw new Error("Not Authorised");

    if (
      findAdmin &&
      (await this.repository.isMatchPassword(
        findAdmin.password,
        findAdmin.email
      ))
    ) {
      // const refreshToken = generateRefreshToken(findAdmin?.id);

      // // const updateuser = await User.findByIdAndUpdate(
      // //   findAdmin.id,
      // //   {
      // //     refreshToken: refreshToken,
      // //   },
      // //   { new: true }
      // // );
      // res.cookie("refreshToken", refreshToken, {
      //   httpOnly: true,
      //   maxAge: 72 * 60 * 60 * 1000,
      // });

      res.json({
        ...findAdmin,
        token: generateToken(findAdmin?.id),
      });
    } else {
      throw new Error("Invalid Credentials");
    }
  }

  async userLogin(req: Request, res: Response) {
    const { email, password } = req.body;
    const findUser = await this.repository.isMatchPassword(password, email);
    const refreshToken = generateRefreshToken(findUser?.id as string);
    console.log(findUser);

    await this.repository.update({
      where: { id: findUser?.id },
      data: {
        refreshToken,
      },
    });
    return {
      id: findUser?.id,
      name: findUser?.name,
      email: findUser?.email,
      token: generateToken(findUser?.id as string),
    };
  }
  async create(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>): Promise<any> {
      const {email} = req.body;
      
      const existingUser = await this.repository.findFirst({where: {
        email
      }})
      if(existingUser) throw Error("User already exists")
      const user = await this.repository.create({
        data: {
          ...req.body
      }})
      return user;
  }

}
 
export default UserService;
