import Joi from "joi";
import FeatureService, { TFeatureService } from "../utils/abstract";
import Category from "../models/categoryModel";

const categorySchema = Joi.object({
  name: Joi.string().required(),
});

type TCategory = TFeatureService & {};

class CategoryService extends FeatureService {
  constructor() {
    super({ repository: Category, schema: categorySchema });
  }
}

export default CategoryService;
