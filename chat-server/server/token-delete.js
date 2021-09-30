var dbserver = require("../dao/dbserver");

exports.deleteToken = function (req, res) {
  let user_id = req.body.user_id;

  dbserver.deleteToken(user_id, res);
};
