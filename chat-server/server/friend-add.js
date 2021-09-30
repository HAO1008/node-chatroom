const dbserver = require("../dao/dbserver");

exports.addFriend = function (req, res) {
  let user_name = req.body.user_name;
  let user_img = req.body.user_img;
  let friend_id = req.body.friend_id;
  let friend_name = req.body.friend_name;
  let friend_img = req.body.friend_img;
  let token = req.body.token;

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
