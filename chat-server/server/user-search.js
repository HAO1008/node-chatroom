const dbserver = require("../dao/dbserver");

exports.searchUser = function (req, res) {
  let email = req.body.email;
  let token = req.body.token;

  dbserver.findUser(email, token, res);
};
