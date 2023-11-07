import Joi from "joi";
import Brand from "../models/brandModel";
import FeatureService, { TFeatureService } from "../utils/abstract";

const brandSchema = Joi.object({
  name: Joi.string().required(),
});


class BrandService extends FeatureService {
  constructor() {
    super({repository: Brand, schema: brandSchema});
  };
}

export default BrandService;
