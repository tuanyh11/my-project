import { Router } from "express";
import categoryService from "../services/categoryServices";
import asyncHandler from "../utils/asyncHandler"; 
import getId from "../middlewares/getId";
const router = Router();

const categoryServices = new categoryService();
router.post("/", asyncHandler(categoryServices.create.bind(categoryServices)));
router
  .route("/:id")
  .get(getId, asyncHandler(categoryServices.getById.bind(categoryServices)))
  .put(getId, asyncHandler(categoryServices.updateById.bind(categoryServices)))
  .delete(
    getId,
    asyncHandler(categoryServices.deleteById.bind(categoryServices))
  );
router.get("/", asyncHandler(categoryServices.getAll.bind(categoryServices)));

export default router;
