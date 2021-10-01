const dbserver = require("../dao/dbserver");

// token創建
exports.createToken = function (req, res) {
  const id = req.body.id;
  const time = req.body.time;
  const token = req.body.token;

  dbserver.createToken(token, id, time, res);
};

// token銷毀
exports.deleteToken = function (req, res) {
  const user_id = req.body.user_id;

  dbserver.deleteToken(user_id, res);
};