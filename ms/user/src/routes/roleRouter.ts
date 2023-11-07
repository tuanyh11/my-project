import { Router } from "express";
import RoleService from "../services/roleServices";
import asyncHandler from "../utils/asyncHandler";
import getId from "../middlewares/getId";
const router = Router();

const roleServices = new RoleService();
router.post("/", asyncHandler(roleServices.create.bind(roleServices)));
router
  .route("/:id")
  .get(getId, asyncHandler(roleServices.getById.bind(roleServices)))
  .put(getId, asyncHandler(roleServices.updateById.bind(roleServices)))
  .delete(getId, asyncHandler(roleServices.deleteById.bind(roleServices)))
router.get("/", asyncHandler(roleServices.getAll.bind(roleServices)));

export default router;

