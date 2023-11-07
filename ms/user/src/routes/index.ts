
import {Application} from "express";
import roleRouter from "./roleRouter";
import userRouter from "./userRouter";

const configRouters = (app: Application) => {
    app.use("/role", roleRouter);
    app.use("/", userRouter);
};

export default configRouters