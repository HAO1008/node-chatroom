// 處理數據 增刪改查
var conn = require("../config/db");
var { v4: uuidv4 } = require("uuid");
const e = require("cors");

// eventEmitter
const message = require("../event/event");

// 資料庫連線
conn.connect();

function runQuery(sql, sqlParams) {
  return new Promise((resolve, reject) => {
    conn.query(sql, sqlParams, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

async function opt1(a) {
  var sql = "SELECT * FROM token where token = ? ";
  var sqlParams = [a];
  const data = await runQuery(sql, sqlParams);
  let id = data[0].user_id;

  var sql1 = "SELECT * FROM user where id = ? ";
  var sqlParams1 = [id];
  const data1 = await runQuery(sql1, sqlParams1);
  let uname = data1[0].name;

  return {
    data: data,
    id: id,
    uname: uname,
  };
}

// 用戶註冊
exports.buildUser = async function (name, mail, pwd, time, res) {
  try {
    var addSql =
      " INSERT INTO user(name, password, email, created_at) VALUES(?, ?, ?, ?) ";
    var addSqlParams = [name, pwd, mail, time];
    const data = await runQuery(addSql, addSqlParams);
    res.send({ status: 200, data });
  } catch (err) {
    res.send({ status: 400, err });
  }
};

// 用戶登入
exports.userMatch = async function (email, pwd, res) {
  try {
    var token = uuidv4();
    var addsql =
      " SELECT * FROM user where email = ? AND password = ? LIMIT 1 ";
    var addSqlParams = [email, pwd];
    const data = await runQuery(addsql, addSqlParams);
    if (data.length == 0) {
      res.send({ status: 400 });
    } else {
      res.send({ status: 200, data, token });
    }
  } catch (err) {
    res.send({ status: 400, err });
  }
};

// 用戶搜尋
exports.findUser = async function (email, token, res) {
  try {
    const { data } = await opt1(token);
    var sql1 = "SELECT * FROM user WHERE email = ?";
    var sqlParams1 = [email];
    const result = await runQuery(sql1, sqlParams1);
    res.send({ data, result, status: 200 });
  } catch (err) {
    console.log(err.message);
    res.send({ status: 400 });
  }
};

// 用戶資料
exports.getUser = async function (token, res) {
  try {
    const { data, id } = await opt1(token);
    var sql2 = "SELECT * FROM user where id = ?";
    var sqlParams2 = [id];
    const result = await runQuery(sql2, sqlParams2);
    res.send({ status: 200, data, result });
  } catch (err) {
    console.log(err.message);
    res.send({ status: 400 });
  }
};

// 用戶照片更新
exports.imgUpdate = async function (img, friend_img, token, res) {
  try {
    const { data, id } = await opt1(token);
    var sql = "UPDATE user SET img = ? WHERE id = ?";
    var sqlParams = [img, id];
    const result = await runQuery(sql, sqlParams);
    var sql1 = "UPDATE friend SET friend_img = ? WHERE friend_id = ?";
    var sqlParams1 = [friend_img, id];
    const fresult = await runQuery(sql1, sqlParams1);
    if (result.affectedRows == 1) {
      message.changeImg(id, friend_img);
    } else {
      res.send({ status: 400 });
    }
    res.send({ status: 200, data, result, fresult });
  } catch (err) {
    console.log(err.message);
    res.send({ status: 400 });
  }
};

// 好友列表
exports.getFriend = async function (token, res) {
  try {
    const { data, id } = await opt1(token);
    var sql2 = "SELECT * FROM friend where user_id = ?";
    var sqlParams2 = [id];
    const result = await runQuery(sql2, sqlParams2);
    res.send({ data, result, status: 200 });
  } catch (err) {
    console.log(err.message);
    res.send({ status: 400 });
  }
};

// 好友加入
exports.addFriend = async function (
  user_name,
  user_img,
  friend_id,
  friend_name,
  friend_img,
  token,
  res
) {
  try {
    const { data, id } = await opt1(token);
    var sql1 = "SELECT * FROM friend where user_id = ? ";
    var sqlParams1 = [id];
    const result = await runQuery(sql1, sqlParams1);
    const x = result.map((e) => e.friend_id).indexOf(friend_id);
    if (x != -1) {
      res.send({ status: 300, data, result });
    } else {
      insertFriend(id, friend_id, friend_name, friend_img);
      insertConfirm(friend_id, id, user_name, user_img);
      res.send({ status: 200, data, result });
    }
  } catch (err) {
    console.log(err.message);
    res.send({ status: 400 });
  }
};

// 好友加入-插入好友資料表
async function insertFriend(user_id, friend_id, friend_name, friend_img) {
  var sql2 =
    "INSERT INTO friend(user_id, friend_id, friend_name, friend_img) VALUES(?, ?, ?, ?)";
  var sqlParams2 = [user_id, friend_id, friend_name, friend_img];
  const results = await runQuery(sql2, sqlParams2);
}
// 好友加入-插入確認資料表
async function insertConfirm(friend_id, user_id, user_name, user_img) {
  var sql3 =
    "INSERT INTO confirm(user_id, friend_id, friend_name, friend_img) VALUES(?, ?, ?, ?)";
  var sqlParams3 = [friend_id, user_id, user_name, user_img];
  const confrimUser = await runQuery(sql3, sqlParams3);
}

// 訊息插入
exports.chatInsert = async function (
  msg,
  type,
  sendto,
  created_at,
  token,
  res
) {
  try {
    const { id, data, uname } = await opt1(token);
    var sql1 =
      "INSERT INTO message(user_id, user_name, msg, type, sendto, created_at) VALUES(?, ?, ?, ?, ?, ?)";
    var sqlParams1 = [id, uname, msg, type, sendto, created_at];
    const results = await runQuery(sql1, sqlParams1);
    if (results.affectedRows == 1) {
      if (type == 1) {
        message.msg(id, msg, sendto);
      } else if (type == 2) {
        message.img(id, msg, sendto);
      }
    } else {
      console.log("錯誤");
      res.send({ status: 400 });
    }
    res.send({ data, results, status: 200 });
  } catch (err) {
    console.log(err.message);
    res.send({ status: 400 });
  }
};

// 訊息列表
exports.chatShow = async function (sendto, token, res) {
  try {
    const { data, id } = await opt1(token);
    var sql1 =
      "SELECT * FROM message where sendto in (" +
      id +
      "," +
      sendto +
      ") and user_id in (" +
      id +
      " , " +
      sendto +
      ")";
    const results = await runQuery(sql1);
    res.send({ data, results, status: 200 });
  } catch (err) {
    console.log(err.message);
    res.send({ status: 400 });
  }
};

// 訊息收回
exports.takeBack = async function (id, token, res) {
  try {
    const { data } = await opt1(token);
    var sql1 = "DELETE FROM message where id = ?";
    var sqlParams1 = [id];
    const tb = await runQuery(sql1, sqlParams1);
    if (tb.affectedRows == 1) {
      message.tackBack(id);
    } else {
      res.send({ status: 400 });
    }
    res.send({ data, tb, status: 200 });
  } catch (err) {
    console.log(err.message);
    res.send({ status: 400 });
  }
};

// token生成
exports.createToken = async function (token, id, time, res) {
  try {
    var sql = " INSERT INTO token(token, user_id, created_at) VALUES(?, ?, ?) ";
    var sqlParams = [token, id, time];
    const data = await runQuery(sql, sqlParams);
    console.log("成功生成token");
    res.send({ status: 200 });
  } catch (err) {
    res.send({ status: 400 });
  }
};

// token移除
exports.deleteToken = async function (user_id, res) {
  try {
    var sql = "DELETE FROM token where user_id = ?";
    var sqlParams = [user_id];
    const data = await runQuery(sql, sqlParams);
    console.log("成功移除token");
    res.send({ status: 200 });
  } catch (err) {
    res.send({ status: 400 });
  }
};

// 邀請列表
exports.confirmUser = async function (token, res) {
  try {
    const { data, id } = await opt1(token);
    var sql1 = "SELECT * FROM confirm where user_id = ? ";
    var sqlParams1 = [id];
    const result = await runQuery(sql1, sqlParams1);
    res.send({ data, result, status: 200 });
  } catch (err) {
    console.log(err.message);
    res.send({ status: 400 });
  }
};

// 邀請接受
exports.handleApply = async function (
  friend_id,
  friend_name,
  friend_img,
  token,
  res
) {
  try {
    const { data, id } = await opt1(token);
    let sql1 =
      "INSERT INTO friend(user_id, friend_id, friend_name, friend_img) VALUES(?, ?, ?, ?)";
    let sqlParams1 = [id, friend_id, friend_name, friend_img];
    const result = await runQuery(sql1, sqlParams1);
    let sql2 = "DELETE FROM confirm where user_id = ? and friend_id = ?";
    let sqlParams2 = [id, friend_id];
    const del = await runQuery(sql2, sqlParams2);
    res.send({ data, result, del, status: 200 });
  } catch (err) {
    console.log(err.message);
    res.send({ status: 400 });
  }
};

// 邀請拒絕
exports.refuseApply = async function (friend_id, token, res) {
  try {
    const { data, id } = await opt1(token);
    let sql1 = "DELETE FROM confirm where user_id = ? and friend_id = ?";
    let sqlParams1 = [id, friend_id];
    const del = await runQuery(sql1, sqlParams1);
    let sql2 =
      "DELETE FROM friend where user_id in (" +
      id +
      "," +
      friend_id +
      ") and friend_id in (" +
      id +
      " , " +
      friend_id +
      ")";
    const delfriend = await runQuery(sql2);
    res.send({ data, del, delfriend, status: 200 });
  } catch (err) {
    console.log(err.message);
    res.send({ status: 400 });
  }
};
