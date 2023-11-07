
import {Application} from "express";
import productRouter from "./productRouter";
import brandRouter from "./brandRouter";
import orderRouter from "./orderRouter";
import categoryRouter from "./categoryRouter";

const configRouters = (app: Application) => {
    app.use("/brand", brandRouter); 
    app.use("/order", orderRouter);
    app.use("/category", categoryRouter);
    app.use("/", productRouter);
};

export default configRouters