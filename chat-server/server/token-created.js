var dbserver = require("../dao/dbserver");
var { v4: uuidv4 } = require("uuid");

exports.createToken = function (req, res) {
  // token
  let id = req.body.id;
  let time = req.body.time;
  let token = req.body.token;

  dbserver.createToken(token, id, time, res);
};
