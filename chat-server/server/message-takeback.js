var dbserver = require("../dao/dbserver");

exports.takeBack = function (req, res) {
  let id = req.body.id;
  let token = req.body.token;

  dbserver.takeBack(id, token, res);
};
