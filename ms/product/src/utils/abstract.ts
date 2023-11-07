import { Request, Response } from "express";
import { TRequest } from "../types";
import Joi from "joi";
import { generateSlug } from "./common";

type TJoi = Joi.ObjectSchema<any>;

export type TFeatureService = {
  repository: unknown;
  schema: TJoi;
};

abstract class FeatureService {
  protected repository: any;
  private schema: TJoi;
  constructor({ repository, schema }: TFeatureService) {
    this.repository = repository;
    this.schema = schema;
  }
  async getById(req: TRequest, res: Response) {
    const result = await this.repository.findById(req.id);
    return result;
  }

  public async getAll(req: Request, res: Response) {
    const skip = Number(req.query?.skip || 0);
    const take = Number(req.query?.take || 10);
    const result = await this.repository.find().skip(skip).limit(take);

    return result;
  }

  async create(req: Request, res: Response) {
    const result = await this.repository.create({
        ...req.body,
        slug: generateSlug(req.body?.name || req.body?.title ),
    });
    
    return result;
  }

  async deleteById(req: TRequest, res: Response) {
    const result = await this.repository.findByIdAndRemove(req.id);
    return result;
  }

  async updateById(req: TRequest, res: Response) {
    const result = await this.schema.validateAsync(req.body);
    await this.repository.findByIdAndUpdate(req.id, {
      ...req.body,
      slug: generateSlug(req.body?.name || req.body?.title),
    });
    return result;
  }
}

export default FeatureService

