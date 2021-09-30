// 引入解析req.body插件
const bodyParser = require("body-parser");
//引入cors
const cors = require("cors");

// 訪問頁面
const express = require("express");
const app = express();
const port = 3000;

// 跨域問題處理，******注意擺放位置
app.use(
  cors({
    origin: ["http://localhost:8080"],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 200,
  })
);

// socket
const httpServer = require("http").Server(app);
const io = require("socket.io")(httpServer, {
  cors: true,
});

require("./dao/socket")(io);

// 解析前端數據 body-parser
app.use(
  bodyParser.json({
    limit: "50mb",
  })
);

require("./router/index.js")(app); //路由入口

// 首頁
app.get("/", function (req, res) {
  res.send("Hello World");
});

// 處理未定義頁面404
app.use(function (req, res, next) {
  let err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// 錯誤處理 500
app.use(function (req, res, next) {
  res.status(err.status || 500);
  res.send(err.message); //跟前端做交互
});

httpServer.listen(port, () => console.log(`server is running on port ${port}`));
