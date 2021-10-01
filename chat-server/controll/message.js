const dbserver = require("../dao/dbserver");

// 訊息渲染
exports.show = function (req, res) {
  const sendto = req.body.sendto;
  const token = req.body.token;

  dbserver.chatShow(sendto, token, res);
};

// 訊息傳遞
exports.chatInsert = function (req, res) {
  const token = req.body.token;
  const msg = req.body.msg;
  const type = req.body.type;
  const sendto = req.body.sendto;
  const created_at = req.body.created_at;

  dbserver.chatInsert(msg, type, sendto, created_at, token, res);
};

// 訊息收回
exports.takeBack = function (req, res) {
  const id = req.body.id;
  const token = req.body.token;

  dbserver.takeBack(id, token, res);
};
