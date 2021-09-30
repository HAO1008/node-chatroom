var dbserver = require("../dao/dbserver");

// 用戶註冊
exports.register = function (req, res) {
  let name = req.body.name;
  let mail = req.body.mail;
  let pwd = req.body.pwd;
  let time = req.body.time;

  dbserver.buildUser(name, mail, pwd, time, res);
};
