import { Request, Response } from "express";
import { TRequest } from "../types";
import Joi from "joi";
import { generateSlug } from "./common";
import { TRole, TUserMethod } from "../repositories/userRepo";

type TJoi = Joi.ObjectSchema<any>;

export type TFeatureService = {
  repository: unknown;
  schema: TJoi;
};

abstract class FeatureService {
  protected repository: any;
  protected schema: TJoi;
  constructor({ repository, schema }: TFeatureService) {
    this.repository = repository;
    this.schema = schema;
  }
  async getById(req: TRequest, res: Response) {
    const result = await this.repository.findFirst({
      where: {
        id: req.id,
      },
    });
    return result;
  }

  async getAll(req: Request, res: Response) {
    const skip = Number(req.query?.skip || 0);
    const take = Number(req.query?.take || 10);
    const result = await this.repository.findMany({
      skip,
      take
    });
    return result;
  }

  async create(req: Request, res: Response) {
    try {
      const result = await this.repository.create({
        data: {
          ...req.body,
        },
      });
      return result;
    } catch (error) {
      throw Error(" Could not create repository")
    }
  }

  async deleteById(req: TRequest, res: Response) {
    const result = await this.repository.delete({
      where: {
        id: req.id
      }
    });
    return result;
  }

  async updateById(req: TRequest, res: Response) {
    const result = await this.schema.validateAsync(req.body);
    await this.repository.update({
      where: {
        id: req.id
      },
      data: {
        ...req.body
      }
    });
    return result;
  }
}

export default FeatureService

