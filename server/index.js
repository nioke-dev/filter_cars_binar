// const express = require("express");
// const app = express();
// const port = 3000;
// const path = require("path");

// // Expose public folder to browser
// app.use(express.static("public"));

// app.get("/cars", (req, res) => {
//   var options = {
//     root: path.join(__dirname, "..", "public"),
//     dotfiles: "deny",
//     headers: {
//       "x-timestamp": Date.now(),
//       "x-sent": true,
//     },
//   };
//   res.sendFile("cars.html", options);
// });

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`);
// });

const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const WEBSITE_URL = "http://localhost:3000";

function serveHtml(res, filename) {
  const home = fs.readFileSync(
    path.join(__dirname, "..", "public", `${filename}.html`),
    { encoding: "utf8" }
  );
  res.writeHead(200, { "Content-Type": "text/html" });
  res.end(home);
}

function notFound(res) {
  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ message: "Not Found!" }));
}

const contentTypeDefault = {
  ".css": "text/css",
  ".jpeg": "images/jpeg",
  ".png": "images/png",
  ".jpg": "images/jpg",
  ".js": "text/javascript",
};

function getURL(req) {
  const url = new URL(`${WEBSITE_URL}${req.url}`);
  return url;
}

// Create a local server to receive data from
const server = http.createServer((req, res) => {
  var _a;
  const reqUrl = (_a = req.url) !== null && _a !== void 0 ? _a : "";
  const url = getURL(req);
  if (req.method === "POST") {
    arr.push(1);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Berhasil Ditambahkan" }));
    return;
  }

  const publicFolder = ["css", "images", "scripts"];
  const isAccessingPublicFolder = publicFolder.some((folder) =>
    req.url.includes(folder)
  );

  if (isAccessingPublicFolder) {
    // public + req.url (css/style.css)
    const fileText = fs.readFileSync(
      path.join(__dirname, "..", "public", req.url)
    );
    const extName = path.extname(req.url);
    res.writeHead(200, { "Content-Type": contentTypeDefault[extName] });
    res.end(fileText);
    return;
  }
  switch (url.pathname) {
    case "/":
      serveHtml(res, "index");
      break;
    case "/cars":
      serveHtml(res, "cars");
      break;
    case "/data/cars.json":
      const data = fs.readFileSync(
        path.join(__dirname, "..", "data", "cars.json"),
        { encoding: "utf8" }
      );
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(data);
      break;
    default:
      notFound(res);
  }
});

server.listen(3000);
