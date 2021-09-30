var dbserver = require("../dao/dbserver");

// 主頁
exports.getUser = function (req, res) {
  let token = req.body.token;

  dbserver.getUser(token, res);
};