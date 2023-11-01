const https = require("https");
const fs = require("fs");
const path = require("path");
const download = require("image-downloader");

function downloadUrl(url, pathName) {
  const options = {
    url,
    dest: pathName, // will be saved to /path/to/dest/image.jpg
  };
  download
    .image(options)
    .then(({ filename }) => {
      console.log("Saved to", filename); // saved to /path/to/dest/image.jpg
    })
    .catch((err) => console.error(err));
}

module.exports = downloadUrl;
