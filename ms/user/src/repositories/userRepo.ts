import { Prisma, PrismaClient } from "@prisma/client";
import type { User } from "@prisma/client";

const UserPrisma = new PrismaClient().$extends({
  name: "userMethods",
  model: {
    user: {
      async isMatchPassword(password: string, email: string) {
        const user = await UserPrisma.user.findFirst({
          where: {
            email,
          },
        });
        if (user?.password !== password) {
           throw new Error("passwords do not match")
        }
        return user;
      },
    },
  },
});



export type TUser = User;

export type TUserMethod = typeof UserPrisma.user;

export type TRole = typeof UserPrisma.role;

export default UserPrisma;