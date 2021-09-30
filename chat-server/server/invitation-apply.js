const dbserver = require("../dao/dbserver");

exports.handleApply = function (req, res) {
  let friend_id = req.body.friend_id;
  let friend_name = req.body.friend_name;
  let friend_img = req.body.friend_img;
  let token = req.body.token;

  dbserver.handleApply(friend_id, friend_name, friend_img, token, res);
};
