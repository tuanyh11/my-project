import Joi from "joi";
import FeatureService from "../utils/abstract";
import UserPrisma from "../repositories/userRepo";

const roleSchema = Joi.object({
  name: Joi.string().required()
});

class RoleService extends FeatureService {
  constructor() {
    super({repository: UserPrisma.role, schema: roleSchema})
  }
}

export default RoleService;