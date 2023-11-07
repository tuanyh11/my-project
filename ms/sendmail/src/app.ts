import express from "express";
import  morgan from "morgan";
import errorHandler from "./utils/errorHandler";
import  nodemailer from "nodemailer";
import  asyncHandler from "express-async-handler";
import  fs from "fs"
import  ejs from "ejs";
import  juice from "juice"
import  * as htmlToText from "html-to-text";
import redisClient from "./config/redisConfig";

const app = express();




app.use(morgan("tiny"));
app.use(express.json());

redisClient.subscribe("order")
redisClient.on("message", async (chanel, data) => {
//   const { email = "", items = [], total = 0 } = {
  
// }

const finalData = JSON.parse(data);

const products = finalData.products
const email = finalData.email
const total = products.reduce((acc: number, product: any) => acc + product.totalPrice,0);

  // Create email message

  const message = `New order received from ${email}\n\nItems:\n${products}\n\nTotal: $${total}`;

  const html = await fs.promises.readFile(
    `views/orders.ejs`,
    "utf-8"
  );

  const renderToHtml = ejs.render(html, { products: products, total });

  const inlinedHtml = juice(renderToHtml);

  const text = htmlToText.htmlToText(inlinedHtml);

  // Set up email transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "vantuanxyz741@gmail.com",
      pass: "nwbnefghrswejlke",
    },
  });

  // Set up email options
  const mailOptions = {
    from: "vantuanxyz741@gmail.com",
    to: email,
    subject: "New Order",
    text: text,
    html: inlinedHtml,
  };

  // Send email
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      // res.status(500).send("Error sending email");
    } else {
      console.log("Email sent: " + info.response);
      // res.status(200).send("Email sent successfully");
    }
  });
});
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(errorHandler);

export default app;
