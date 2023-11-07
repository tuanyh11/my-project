import Joi from "joi";
import Product from "../models/productModel";
import FeatureService from "../utils/abstract";
import { Request } from "express-serve-static-core";
import { Response } from "express";

const productSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  categories: Joi.array().items(Joi.string()),
  brands: Joi.array().items(Joi.string().required()),
  price: Joi.number().required(),
  quantity: Joi.number().required(),
  sold: Joi.number().optional(),
  slug: Joi.string().optional(),
  images: Joi.array().items(
    Joi.object({
      public_id: Joi.string().required(),
      url: Joi.string().required(),
      asset_id: Joi.string().optional(),
      _id: Joi.string().optional(),
    })
  ),
  color: Joi.array().items(Joi.string().optional()),
  tags: Joi.array().items(Joi.string().required()),
  ratings: Joi.array().optional().items(
    Joi.object({
      comment: Joi.string().required(),
      postedBy: Joi.string().required(),
    })
  ),
  totalRating: Joi.number().optional(),
});

class ProductService extends FeatureService {
  constructor() {
    super({ repository: Product, schema: productSchema });
    this.repository = Product
  }

  override async getAll(req: Request, res: Response) {
    const skip = Number(req.query?.skip || 0);
    const take = Number(req.query?.take || 10);
    const result = await this.repository
      .find({})
      .populate("categories")
      .populate("brands")
      .skip(skip)
      .limit(take);
    return result;
  }
}

export default ProductService;