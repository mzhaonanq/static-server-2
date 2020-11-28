import * as fs from "fs";
import * as http from "http";
import { IncomingMessage, ServerResponse } from "http";
import * as p from "path";
import * as url from "url";

const server = http.createServer();
const publicDir = p.resolve(__dirname, "public");
let cacheAge = 3600 * 24 * 365;

server.on("request", (request: IncomingMessage, response: ServerResponse) => {
  const { url: path, method } = request;
  const { pathname } = url.parse(path);
  if (method !== "GET") {
    console.log("path");
    console.log(url.parse(path));
    response.statusCode = 405;
    response.end();
    return;
  }
  let fileName = pathname.substr(1);
  if (fileName === "") {
    fileName = "index.html";
  }
  const fileType = fileName.split(".")[1];
  const fileTypeHash = {
    html: "text/html",
    css: "text/css",
    js: "text/javascript",
    png: "image/png",
    jpg: "image/jpeg",
  };
  response.setHeader("Content-Type", `${fileTypeHash[fileType]};charset=utf-8`);
  fs.readFile(p.resolve(publicDir, fileName), (error, data) => {
    if (error) {
      if (error.errno === -4058) {
        response.setHeader("Content-Type", "text/html;charset=utf-8");
        response.statusCode = 404;
        fs.readFile(p.resolve(publicDir, "404.html"), (error, data) => {
          response.end(data);
        });
      } else if (error.errno === -4068) {
        response.statusCode = 403;
        response.end("你无权进行此访问");
      }
    } else {
      console.log("访问成功");
      response.setHeader("Cache-Control", `public,max-age=${cacheAge}`);
      response.end(data);
    }
  });
});
server.listen(8888, () => {
  console.log("监听成功");
});
