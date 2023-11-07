import Joi from "joi";
import FeatureService from "../utils/abstract";
import OrderModel from "../models/orderModel";
import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import redisClient from "../config/redisConfig";
import { generateSlug } from "../utils/common";

const orderSchema = Joi.object({
  products: Joi.array().items(Joi.string()).min(1),
  orderBy: Joi.string()
});

class OrderService extends FeatureService {
  constructor() {
    super({ repository: OrderModel, schema: orderSchema });
  }
  override async create(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>) {
    const { email, ...data} = req.body;
    const result = await this.repository.create({
      ...data,
    });

    redisClient.publish("order", JSON.stringify(req.body));


    return result;
  }
}

export default OrderService;
