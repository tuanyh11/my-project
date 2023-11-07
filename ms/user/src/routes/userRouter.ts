import { Router } from "express";
import userService from "../services/userServices";
import asyncHandler from "../utils/asyncHandler"; 
import getId from "../middlewares/getId";
import defaultUser from "../middlewares/defaultUser";
const router = Router();

const userServices = new userService();

router.post(
  "/admin-login",
  asyncHandler(userServices.loginAdmin.bind(userServices)) 
);

router.post("/is-admin", asyncHandler(userServices.isAdmin.bind(userServices)));
router.post("/login", asyncHandler(userServices.userLogin.bind(userServices)));
router
  .route("/:id")
  .get(getId, asyncHandler(userServices.getById.bind(userServices)))
  .put(getId, asyncHandler(userServices.updateById.bind(userServices)))
  .delete(
    getId,
    asyncHandler(userServices.deleteById.bind(userServices))
  );
router.get("/", asyncHandler(userServices.getAll.bind(userServices)));
router.post(
  "/",
  defaultUser,
  asyncHandler(userServices.create.bind(userServices))
);

export default router;
