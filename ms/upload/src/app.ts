import express, { NextFunction, Request, Response } from "express";
import morgan from "morgan";
import errorHandler from "./utils/errorHandler";
import { productImgResize, uploadPhoto } from "./middlewares/uploadImage";
import { deleteImages, uploadImages } from "./controllers/uploadCtl";
import axios from "axios";
const app = express();
app.use(morgan("tiny"));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);


const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await axios.post("http://localhost:5001/user/is-admin", {
        }, {
            headers: req.headers
        })
        next()
    } catch (error) {
        errorHandler(new Error("You must login"), req, res, next)
    } 
};

app.post("/",
  // isAdmin,
  uploadPhoto.array("images", 10),
  productImgResize,
  uploadImages
)

app.use("/del-image/",  deleteImages)

app.use(errorHandler);

export default app;
