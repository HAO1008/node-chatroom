const dbserver = require("../dao/dbserver");

// 邀請列表
exports.confirmUser = function (req, res) {
  const token = req.body.token;

  dbserver.confirmUser(token, res);
};

// 邀請接受
exports.handleApply = function (req, res) {
  const friend_id = req.body.friend_id;
  const friend_name = req.body.friend_name;
  const friend_img = req.body.friend_img;
  const token = req.body.token;

  dbserver.handleApply(friend_id, friend_name, friend_img, token, res);
};

// 邀請拒絕
exports.refuseApply = function (req, res) {
  const friend_id = req.body.friend_id;
  const token = req.body.token;

  dbserver.refuseApply(friend_id, token, res);
};
