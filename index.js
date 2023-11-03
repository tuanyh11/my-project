const express = require("express");
const puppeteer = require("puppeteer");
const currency = require("currency.js");
const { google } = require("googleapis");
const translate = require("translate-google");
const path = require("path");
const { JSDOM } = require("jsdom");
const fs = require("fs");
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

    const priceElement = await page.$(`.price`);
    const price = await page.evaluate(
      (priceElement) => priceElement.textContent,
      priceElement
    );

    // const descriptionElement = await page.$(`[data-testid="description"]`);
    // const des = await page.evaluate(
    //   (descriptionElement) => descriptionElement.textContent,
    //   descriptionElement
    // );

    // Lựa chọn hình ảnh
    const images = await page.$$eval(
      `.fotorama__stage .fotorama__img`,
      (images) => {
        return images.map((img) => {
          return img.src;
        });
      }
    );

    images.forEach((url) =>
      downloadUrl(url, path.resolve(__dirname, "images"))
    );
    // const description = await translate(des, { to: "vi" });

    // Lấy tiêu đề trang
    const titleElement = await page.$(`#page-title-wrapper`);
    const title = await page.evaluate(
      (titleElement) => titleElement.textContent,
      titleElement
    );

    const finalTitle = await translate(title, { to: "vi" });

    //  google client

    // const client = await googleAuth.getClient();

    // const googleSheets = google.sheets({ version: "v4", auth: client });

    // const spreadsheetId = "1nMB-qL5bmZ7SfowlQKEg_cpRfl0Bfuxg-bhjy1Cwzzg";

    // const metaData = await googleSheets.spreadsheets.get({
    //   auth: googleAuth,
    //   spreadsheetId,
    // });

    // const finalPrice = (currency(price) + currency(price) * 0.3) * 165 + 500000;
    // const rows = await googleSheets.spreadsheets.values.append({
    //   auth: googleAuth,
    //   spreadsheetId,
    //   range: "Sheet1!B:I",
    //   valueInputOption: "USER_ENTERED",
    //   resource: {
    //     values: [
    //       [
    //         "",
    //         "",
    //         finalTitle,
    //         "",
    //         description,
    //         `${price}`,
    //         "",
    //         "",
    //         finalPrice,
    //         url,
    //       ],
    //     ],
    //   },
    // });

    res.json({
      title,
      price: currency(price),
      // description,
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

app.post("/generate", async (req, res) => {
  const browser = await puppeteer.launch({ headless: "new" });
  try {
    // open browser
    const page = await browser.newPage();
    const url = req.body.url;
    const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/;
    if (url && !urlRegex.test(url)) throw Error("invalid url");

    await page.goto(url, { waitUntil: "networkidle2" });

    await page.addScriptTag({ content: `${translate}` });

    const priceElement = await page.$(`.price`);
    const price = await page.evaluate(
      (priceElement) => priceElement.textContent,
      priceElement
    );

    const descriptionElement = await page.$(`.mini-guide-text`);
    const shortDescriptionElement = await page.$(`.product-info-spec`);
    const des = await page.evaluate(
      (descriptionElement) => descriptionElement.textContent,
      descriptionElement
    );
    const shortDes = await page.evaluate(async (descriptionElement) => {
      const $$ = descriptionElement.querySelectorAll.bind(descriptionElement);
      const shortDesList = await Promise.all(
        Array.from($$(".product-info-spec-set")).map(async (el) => {
          const typeEl = el.querySelector(".label .type");
          const value = el.querySelector(".value").textContent;
          return {
            type: {
              el: typeEl.outerHTML,
              text: typeEl.textContent,
            },
            value,
          };
        })
      );
      // const typeValue = descriptionElement.querySelectorAll(".label .type")?.textContent;
      // const value = descriptionElement.querySelector(" .value")?.textContent;
      return shortDesList;
    }, shortDescriptionElement);

    // Lựa chọn hình ảnh
    const images = await page.$$eval(
      `.fotorama__stage .fotorama__img`,
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
    //  const shortDescription = await translate(shortDes, { to: "vi" });

    // Lấy tiêu đề trang
    const titleElement = await page.$(`[data-ui-id="page-title-wrapper"]`);
    const title = await page.evaluate(
      (titleElement) => titleElement.textContent,
      titleElement
    );

    const finalTitle = await translate(title, { to: "vi" });

    const finalPrice = (currency(price) + currency(price) * 0.3) * 165 + 500000;
    const finalShortDes = await Promise.all(
      shortDes?.map(async (item) => {
        const text = await translate(item.type.text, { to: "vi" });
        const value = await translate(item.value, { to: "vi" });
        const el = new JSDOM(
          item.type.el.replace(/class="type"/g, "")
        ).window.document.querySelector("strong");
        el.innerHTML = text;
        return {
          type: el.outerHTML,
          value,
        };
      })
    );

    //  google client

    // const client = await googleAuth.getClient();

    // const googleSheets = google.sheets({ version: "v4", auth: client });

    // const spreadsheetId = "1nMB-qL5bmZ7SfowlQKEg_cpRfl0Bfuxg-bhjy1Cwzzg";

    // const metaData = await googleSheets.spreadsheets.get({
    //   auth: googleAuth,
    //   spreadsheetId,
    // });

    // const rows = await googleSheets.spreadsheets.values.append({
    //   auth: googleAuth,
    //   spreadsheetId,
    //   range: "Sheet1!B:I",
    //   valueInputOption: "USER_ENTERED",
    //   resource: {
    //     values: [
    //       [
    //         "",
    //         "",
    //         finalTitle,
    //         "",
    //         description,
    //         `${price}`,
    //         "",
    //         "",
    //         finalPrice,
    //         url,
    //       ],
    //     ],
    //   },
    // });
      
     const writeStream = fs.createWriteStream("history.txt", {flags: "a"});
     writeStream.write(`${title}\n`);
      writeStream.end()
      writeStream.on("finish", () => {
        console.log("Việc ghi đã hoàn thành.");
      });
    res.render("index.ejs", {
      product: {
        title: finalTitle.replace("/s*[đãs*(qua|sử)s*dụng]/g", "").trim(),
        price: finalPrice,
        finalShortDes,
        description,
        images,
        url,
      },
      message: null,
    });

    browser.close();
  } catch (error) {
    console.log(error);
    browser.close();
    throw Error(error?.message);
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

app.post("/phone", async (req, res) => {
  const browser = await puppeteer.launch({ headless: "new" });
  try {
    // open browser
    const page = await browser.newPage();
    const url = req.body.url;
    const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/;
    if (url && !urlRegex.test(url)) throw Error("invalid url");

    await page.goto(url, { waitUntil: "networkidle2" });

    await page.addScriptTag({ content: `${translate}` });

    const priceElement = await page.$(`.u-product-price-amount`);
    const price = await page.evaluate(
      (priceElement) => priceElement.textContent,
      priceElement
    );

    const descriptionElement = await page.$(`.u-product-description-text`);
    const shortDescriptionElement = await page.$(
      `.u-product-details-detail-wrapper`
    );
    const des = await page.evaluate(
      (descriptionElement) => descriptionElement.textContent,
      descriptionElement
    );
    const shortDes = await page.evaluate(async (parentEl) => {
      const $$ = parentEl.querySelectorAll.bind(parentEl);
      const shortDesList = 
        Array.from($$(".u-product-details-detail")).map( (el) => {
          const value = Array.from(el.childNodes).filter((item) => item.nodeType === Node.TEXT_NODE).map(el => el.data).join("");
          const key = el.querySelector(".u-product-details-detail-key").textContent;
          return {
            key,
            value,
            raw: el.outerHTML
          };
        })
      return shortDesList;
    }, shortDescriptionElement);

    // Lựa chọn hình ảnh
    const images = await page.$$eval(
      `.u-product-gallery-thumbs .swiper-slide span> img`,
      (images) => {
        return images.map((img) => {
          return img.src;
        });
      }
    );


    images.filter(url => url.startsWith("https://")).forEach((url) =>
      downloadUrl(url, path.resolve(__dirname, "images"))
    );
    const description = await translate(des, { to: "vi" });
     const shortDescription = await translate(shortDes, { to: "vi" });

    // Lấy tiêu đề trang
    const titleElement = await page.$(`.u-product-details-title`);
    const title = await page.evaluate(
      (titleElement) => titleElement.textContent,
      titleElement
    );

    const finalTitle = await translate(title, { to: "en" });

    const finalPrice = Math.floor(
      (currency(price) + currency(price) * 0.3) * 165 + 500000
    );
    const finalShortDes = await Promise.all(
      shortDes?.map(async (item) => {
        const key = await translate(item.key, {
          to: "vi",
        });
        const value = await translate(item.value, {
          to: "vi",
        });
        return {
          key: key.replace("ắc quy", "Pin"),
          value: `<strong>${value}</strong>`,
        };
      })
    );
    


    const writeStream = fs.createWriteStream("history.txt", { flags: "a" });
    writeStream.write(`${title}\n`);
    writeStream.end();
    writeStream.on("finish", () => {
      console.log("Việc ghi đã hoàn thành.");
    });
    res.render("index.ejs", {
      product: {
        title: finalTitle,
        price: finalPrice,
        finalShortDes,
        description,
        images,
        url,
      },
      message: null,
    });

    await browser.close();
  } catch (error) {
    console.log(error);
    browser.close();
    throw Error(error?.message);
  }
});



app.get("/remove-images", (req, res) => {
  fs.readdir(path.join(__dirname, "images"), (err, files) => {
    if (err) {
      res.status(500).send("Lỗi khi đọc thư mục");
      return;
    }
    files.forEach((file) => {
      const filePath = path.join(path.join(__dirname, "images"), file);
      // Xoá tệp
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error("Lỗi khi xoá tệp:", err);
        } else {
          console.log(`Đã xoá tệp: ${file}`);
        }
      });
    });
    res.render("index.ejs", {message: "xoa thanh cong", product: null});
  })
})

app.get("/", (req, res) => {
  res.render("index.ejs", {
    product: null,
    message: null
  });
});

app.listen(4000, function () {
  console.log("listening on port " + 4000);
});
