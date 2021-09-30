var dbserver = require("../dao/dbserver");

// 用戶註冊
exports.show = function (req, res) {
  let sendto = req.body.sendto;
  let token = req.body.token;

  dbserver.chatShow(sendto, token, res);
};
