import { Router } from "express";
import asyncHandler from "../utils/asyncHandler";
import getId from "../middlewares/getId";
import OrderService from "../services/orderServices";
const router = Router();

const orderServices = new OrderService();
router.post("/", asyncHandler(orderServices.create.bind(orderServices)));
router
  .route("/:id")
  .get(getId, asyncHandler(orderServices.create.bind(orderServices)))
  .put(getId, asyncHandler(orderServices.updateById.bind(orderServices)))
  .delete(getId, asyncHandler(orderServices.deleteById.bind(orderServices)));
router.get("/", asyncHandler(orderServices.getAll.bind(orderServices)));

export default router;
