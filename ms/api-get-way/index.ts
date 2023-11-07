import express, { Request, Response } from "express"
import  {createProxyMiddleware} from "http-proxy-middleware"
import { AddressInfo } from "ws";
import cors from "cors"

const app = express()

app.use(
  cors({
    origin: "*",
  })
); 

const userProxy = createProxyMiddleware({
  target: "http://localhost:5001",
  changeOrigin: true,
  pathRewrite: {
    [`^/api/user`]: "",
  },
});

const productProxy = createProxyMiddleware({
  target: "http://localhost:4001/",
  changeOrigin: true,
  pathRewrite: {
    [`^/api/product`]: "",
  },
});

const uploadProxy = createProxyMiddleware({
  target: "http://localhost:5002/",
  changeOrigin: true,
  pathRewrite: {
    [`^/api/upload`]: "",
  },
});

app.use("/api/product", productProxy);   
app.use("/api/user", userProxy);
app.use("/api/upload", uploadProxy); 

const server = app.listen(8080, function() {
    console.log(`Api get way listening ${(server.address() as AddressInfo).port }`);
})