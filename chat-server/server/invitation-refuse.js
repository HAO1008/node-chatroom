const dbserver = require("../dao/dbserver");

exports.refuseApply = function (req, res) {
  let friend_id = req.body.friend_id;
  let token = req.body.token;

  dbserver.refuseApply(friend_id, token, res);
};
