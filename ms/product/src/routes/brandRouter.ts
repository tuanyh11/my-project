import { Router } from "express";
import brandService from "../services/brandServices";
import asyncHandler from "../utils/asyncHandler"; 
import getId from "../middlewares/getId";
const router = Router();

const brandServices = new brandService();
router.post("/", asyncHandler(brandServices.create.bind(brandServices)));
router
  .route("/:id")
  .get(getId, asyncHandler(brandServices.getById.bind(brandServices)))
  .put(getId, asyncHandler(brandServices.updateById.bind(brandServices)))
  .delete(
    getId,
    asyncHandler(brandServices.deleteById.bind(brandServices))
  );
router.get("/", asyncHandler(brandServices.getAll.bind(brandServices)));

export default router;
