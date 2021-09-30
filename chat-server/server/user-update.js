const dbserver = require("../dao/dbserver");

exports.updateImg = function (req, res) {
  let img = req.body.img;
  let friend_img = req.body.friend_img;
  let token = req.body.token;

  dbserver.imgUpdate(img, friend_img, token, res);
};
