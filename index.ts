import * as http from "http";
const server = http.createServer();

server.on(
  "request",
  (request: http.IncomingMessage, response: http.ServerResponse) => {
    console.log("有人发来请求了");
    console.log(request.url);
    console.log(request.method);
    console.log(request.httpVersion);
    console.log(request.headers);
    const array = [];
    request.on("data", (chunk) => {
      array.push(chunk);
    });
    request.on("end", () => {
      const requestBody = Buffer.concat(array).toString();
      console.log(requestBody);
      response.end("hi" + "\n");
    });
  }
);

server.listen(8888, () => {
  console.log(server.address());
});
