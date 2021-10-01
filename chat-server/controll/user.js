const dbserver = require("../dao/dbserver");

// 用戶登入
exports.login = function (req, res) {
  // user
  const email = req.body.email;
  const pwd = req.body.pwd;

  dbserver.userMatch(email, pwd, res);
};

// 用戶註冊
exports.register = function (req, res) {
  const name = req.body.name;
  const mail = req.body.mail;
  const pwd = req.body.pwd;
  const time = req.body.time;

  dbserver.buildUser(name, mail, pwd, time, res);
};

// 用戶搜尋
exports.searchUser = function (req, res) {
  const email = req.body.email;
  const token = req.body.token;

  dbserver.findUser(email, token, res);
};

// 用戶照片更新
exports.updateImg = function (req, res) {
  const img = req.body.img;
  const friend_img = req.body.friend_img;
  const token = req.body.token;

  dbserver.imgUpdate(img, friend_img, token, res);
};

// 用戶資料
exports.getUser = function (req, res) {
  const token = req.body.token;

  dbserver.getUser(token, res);
};
