const express = require("express");
const puppeteer = require("puppeteer");
const currency = require("currency.js");
const { google } = require("googleapis");
const translate = require("translate-google");
const path = require("path");
const downloadUrl = require("./download.js");

const app = express();
const googleAuth = new google.auth.GoogleAuth({
  keyFile: "credentials.json",
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

app.set("view engine", "ejs");
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

const generate = async (req, res, url) => {
  const browser = await puppeteer.launch({ headless: true });
  try {
    // open browser
    const page = await browser.newPage();
    const url = url;
    const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/;
    if (url && !urlRegex.test(url)) throw Error("invalid url");

    await page.goto(url, { waitUntil: "networkidle2" });

    const priceElement = await page.$(`[data-testid="price"]`);
    const price = await page.evaluate(
      (priceElement) => priceElement.textContent,
      priceElement
    );

    const descriptionElement = await page.$(`[data-testid="description"]`);
    const des = await page.evaluate(
      (descriptionElement) => descriptionElement.textContent,
      descriptionElement
    );

    // Lựa chọn hình ảnh
    const images = await page.$$eval(
      `[aria-label="商品画像カルーセル"] img`,
      (images) => {
        return images.map((img) => {
          return img.src;
        });
      }
    );

    images.forEach((url) =>
      downloadUrl(url, path.resolve(__dirname, "images"))
    );
    const description = await translate(des, { to: "vi" });

    // Lấy tiêu đề trang
    const titleElement = await page.$(`h1.heading__a7d91561`);
    const title = await page.evaluate(
      (titleElement) => titleElement.textContent,
      titleElement
    );

    const finalTitle = await translate(title, { to: "vi" });

    //  google client

    const client = await googleAuth.getClient();

    const googleSheets = google.sheets({ version: "v4", auth: client });

    const spreadsheetId = "1nMB-qL5bmZ7SfowlQKEg_cpRfl0Bfuxg-bhjy1Cwzzg";

    const metaData = await googleSheets.spreadsheets.get({
      auth: googleAuth,
      spreadsheetId,
    });

    const finalPrice = (currency(price) + currency(price) * 0.3) * 165 + 500000;
    const rows = await googleSheets.spreadsheets.values.append({
      auth: googleAuth,
      spreadsheetId,
      range: "Sheet1!B:I",
      valueInputOption: "USER_ENTERED",
      resource: {
        values: [
          [
            "",
            "",
            finalTitle,
            "",
            description,
            `${price}`,
            "",
            "",
            finalPrice,
            url,
          ],
        ],
      },
    });

    res.json({
      title,
      price: currency(price),
      description,
      images,
      url,
    });

    browser.close();
  } catch (error) {
    console.log(error);
    browser.close();
    throw Error(error?.message);
  }
};

app.get("/generate", async (req, res) => {
  const browser = await puppeteer.launch({ headless: true });
  try {
    // open browser
    const page = await browser.newPage();
    const url = req.query.url;
    const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/;
    if (url && !urlRegex.test(url)) throw Error("invalid url");

    await page.goto(url, { waitUntil: "networkidle2" });

    const priceElement = await page.$(`[data-testid="price"]`);
    const price = await page.evaluate(
      (priceElement) => priceElement.textContent,
      priceElement
    );

    const descriptionElement = await page.$(`[data-testid="description"]`);
    const des = await page.evaluate(
      (descriptionElement) => descriptionElement.textContent,
      descriptionElement
    );

    // Lựa chọn hình ảnh
    const images = await page.$$eval(
      `[aria-label="商品画像カルーセル"] img`,
      (images) => {
        return images.map((img) => {
          return img.src;
        });
      }
    );

    images.forEach((url) =>
      downloadUrl(url, path.resolve(__dirname, "images"))
    );
    const description = await translate(des, { to: "vi" });

    // Lấy tiêu đề trang
    const titleElement = await page.$(`h1.heading__a7d91561`);
    const title = await page.evaluate(
      (titleElement) => titleElement.textContent,
      titleElement
    );

    const finalTitle = await translate(title, { to: "vi" });

    //  google client

    const client = await googleAuth.getClient();

    const googleSheets = google.sheets({ version: "v4", auth: client });

    const spreadsheetId = "1nMB-qL5bmZ7SfowlQKEg_cpRfl0Bfuxg-bhjy1Cwzzg";

    const metaData = await googleSheets.spreadsheets.get({
      auth: googleAuth,
      spreadsheetId,
    });

    const finalPrice = (currency(price) + currency(price) * 0.3) * 165 + 500000;
    const rows = await googleSheets.spreadsheets.values.append({
      auth: googleAuth,
      spreadsheetId,
      range: "Sheet1!B:I",
      valueInputOption: "USER_ENTERED",
      resource: {
        values: [
          [
            "",
            "",
            finalTitle,
            "",
            description,
            `${price}`,
            "",
            "",
            finalPrice,
            url,
          ],
        ],
      },
    });

    res.json({
      title,
      price: currency(price),
      description,
      images,
      url,
    });

    browser.close();
  } catch (error) {
    console.log(error);
    browser.close();
    res.status(404).json({ error: error.message });
  }
});

app.get("/get-url", async (req, res, next) => {
  try {
    const client = await googleAuth.getClient();

    const googleSheets = google.sheets({ version: "v4", auth: client });

    const spreadsheetId = "133D29XLqWlZA7EiVS5AnrnV9nLaCTeJVSXkicWtQiJE";

    const metaData = await googleSheets.spreadsheets.get({
      auth: googleAuth,
      spreadsheetId,
    });

    const rows = await googleSheets.spreadsheets.values.get({
      auth: googleAuth,
      spreadsheetId,
      range: "Sheet1!B:J",
    });
    const data = rows.data.values;
    data.shift();
    const urls = data
      .map((item) => item?.pop())
      .filter((item) => item)
      .map((url) => {
        if (!url.startsWith("https")) {
          url = "https://" + url;
        }
        return url;
      });
    res.json(urls);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

app.listen(4000, function () {
  console.log("listening on port " + 4000);
});
