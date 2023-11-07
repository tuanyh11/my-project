import { Router } from "express";
import ProductService from "../services/productServices";
import asyncHandler from "../utils/asyncHandler";
import getId from "../middlewares/getId";
const router = Router();

const productServices = new ProductService();
router.post("/", asyncHandler(productServices.create.bind(productServices)));
router
  .route("/:id")
  .get(getId, asyncHandler(productServices.getById.bind(productServices)))
  .put(getId, asyncHandler(productServices.updateById.bind(productServices)))
  .delete(getId, asyncHandler(productServices.deleteById.bind(productServices)))
router.get("/", asyncHandler(productServices.getAll.bind(productServices)));

export default router;

