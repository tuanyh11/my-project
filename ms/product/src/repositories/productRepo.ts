import { Prisma, PrismaClient } from "@prisma/client";
import type { Product } from "@prisma/client";

const ProductPrisma = new PrismaClient();

export type TProduct = Product

export default ProductPrisma;