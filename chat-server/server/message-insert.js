var dbserver = require("../dao/dbserver");

exports.chatInsert = function (req, res) {
  let token = req.body.token;
  let msg = req.body.msg;
  let type = req.body.type;
  let sendto = req.body.sendto;
  let created_at = req.body.created_at;

  dbserver.chatInsert(msg, type, sendto, created_at, token, res);
};
