var dbserver = require("../dao/dbserver");

exports.login = function (req, res) {
  // user
  let email = req.body.email;
  let pwd = req.body.pwd;

  dbserver.userMatch(email, pwd, res);
};
