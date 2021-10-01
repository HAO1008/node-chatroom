const dbserver = require("../dao/dbserver");

// 朋友列表
exports.getFriend = function (req, res) {
  const token = req.body.token;

  dbserver.getFriend(token, res);
};

// 朋友新增
exports.addFriend = function (req, res) {
  const user_name = req.body.user_name;
  const user_img = req.body.user_img;
  const friend_id = req.body.friend_id;
  const friend_name = req.body.friend_name;
  const friend_img = req.body.friend_img;
  const token = req.body.token;

  dbserver.addFriend(
    user_name,
    user_img,
    friend_id,
    friend_name,
    friend_img,
    token,
    res
  );
};
