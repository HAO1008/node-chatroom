var dbserver = require("../dao/dbserver");

// 主頁
exports.getFriend = function (req, res) {
  let token = req.body.token;

  dbserver.getFriend(token, res);
};
