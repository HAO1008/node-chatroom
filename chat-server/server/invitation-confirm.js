const dbserver = require("../dao/dbserver");

exports.confirmUser = function (req, res) {
  let token = req.body.token;

  dbserver.confirmUser(token, res);
};
