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

async function inspect(a) {
  const sql = "SELECT * FROM token where token = ? ";
  const sqlParams = [a];
  const data = await runQuery(sql, sqlParams);
  const id = data[0].user_id;
  if (data.length == 0) {
    throw new Error("token not found");
  }
  const sql1 = "SELECT * FROM user where id = ? ";
  const sqlParams1 = [id];
  const data1 = await runQuery(sql1, sqlParams1);
  const uname = data1[0].name;
  if (data1.length == 0) {
    throw new Error("id not found");
  }

  return {
    data: data,
    id: id,
    uname: uname,
  };
}

// 用戶註冊
exports.buildUser = async function (name, mail, pwd, time, res) {
  try {
    const addSql =
      " INSERT INTO user(name, password, email, created_at) VALUES(?, ?, ?, ?) ";
    const addSqlParams = [name, pwd, mail, time];
    const data = await runQuery(addSql, addSqlParams);
    res.send({ status: 200, data });
  } catch (err) {
    res.send({ status: 400, err });
  }
};

// 用戶登入
exports.userMatch = async function (email, pwd, res) {
  try {
    const token = uuidv4();
    const addsql =
      " SELECT * FROM user where email = ? AND password = ? LIMIT 1 ";
    const addSqlParams = [email, pwd];
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
    const { data } = await inspect(token);
    const sql = "SELECT * FROM user WHERE email = ?";
    const sqlParams = [email];
    const result = await runQuery(sql, sqlParams);
    res.send({ data, result, status: 200 });
  } catch (err) {
    console.log(err.message);
    res.send({ status: 400 });
  }
};

// 用戶資料
exports.getUser = async function (token, res) {
  try {
    const { data, id } = await inspect(token);
    const sql = "SELECT * FROM user where id = ?";
    const sqlParams = [id];
    const result = await runQuery(sql, sqlParams);
    res.send({ status: 200, data, result });
  } catch (err) {
    console.log(err.message);
    res.send({ status: 400 });
  }
};

// 用戶照片更新
exports.imgUpdate = async function (img, friend_img, token, res) {
  try {
    const { data, id } = await inspect(token);
    const sql = "UPDATE user SET img = ? WHERE id = ?";
    const sqlParams = [img, id];
    const result = await runQuery(sql, sqlParams);

    const sql1 = "UPDATE friend SET friend_img = ? WHERE friend_id = ?";
    const sqlParams1 = [friend_img, id];
    const friend_result = await runQuery(sql1, sqlParams1);

    if (result.affectedRows == 1) {
      message.changeImg(id, friend_img);
      res.send({ status: 200, data, result, friend_result });
    } else {
      res.send({ status: 400 });
    }
  } catch (err) {
    console.log(err.message);
    res.send({ status: 400 });
  }
};

// 好友列表
exports.getFriend = async function (token, res) {
  try {
    const { data, id } = await inspect(token);
    const sql = "SELECT * FROM friend where user_id = ?";
    const sqlParams = [id];
    const result = await runQuery(sql, sqlParams);
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
    const { data, id } = await inspect(token);
    const sql = "SELECT * FROM friend where user_id = ? ";
    const sqlParams = [id];
    const result = await runQuery(sql, sqlParams);
    const findFriendId = result.map((e) => e.friend_id).indexOf(friend_id);
    if (findFriendId != -1) {
      res.send({ status: 300, data, result });
    } else {
      await insertFriend(id, friend_id, friend_name, friend_img);
      await insertConfirm(friend_id, id, user_name, user_img);
      res.send({ status: 200, data, result });
    }
  } catch (err) {
    console.log(err.message);
    res.send({ status: 400 });
  }
};

// 好友加入-插入好友資料表
async function insertFriend(user_id, friend_id, friend_name, friend_img) {
  const sql =
    "INSERT INTO friend(user_id, friend_id, friend_name, friend_img) VALUES(?, ?, ?, ?)";
  const sqlParams = [user_id, friend_id, friend_name, friend_img];
  const results = await runQuery(sql, sqlParams);
}
// 好友加入-插入確認資料表
async function insertConfirm(friend_id, user_id, user_name, user_img) {
  const sql =
    "INSERT INTO confirm(user_id, friend_id, friend_name, friend_img) VALUES(?, ?, ?, ?)";
  const sqlParams = [friend_id, user_id, user_name, user_img];
  const confrimUser = await runQuery(sql, sqlParams);
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
    const { id, data, uname } = await inspect(token);
    const sql =
      "INSERT INTO message(user_id, user_name, msg, type, sendto, created_at) VALUES(?, ?, ?, ?, ?, ?)";
    const sqlParams = [id, uname, msg, type, sendto, created_at];
    const result = await runQuery(sql, sqlParams);

    if (result.affectedRows != 1) {
      console.log("錯誤");
      res.send({ status: 400 });
      return;
    }
    if (type == 1) {
      message.msg(id, msg, sendto);
    } else if (type == 2) {
      message.img(id, msg, sendto);
    }
    res.send({ data, result, status: 200 });
  } catch (err) {
    console.log(err.message);
    res.send({ status: 400 });
  }
};

// 訊息列表
exports.chatShow = async function (sendto, token, res) {
  try {
    const { data, id } = await inspect(token);
    const sql =
      `SELECT * FROM message where sendto in (${ id }, ${ sendto }) and user_id in (${ id }, ${ sendto })`;
    const results = await runQuery(sql);
    res.send({ data, results, status: 200 });
  } catch (err) {
    console.log(err.message);
    res.send({ status: 400 });
  }
};

// 訊息收回
exports.takeBack = async function (id, token, res) {
  try {
    const { data } = await inspect(token);
    const sql1 = "DELETE FROM message where id = ?";
    const sqlParams1 = [id];
    const tb = await runQuery(sql1, sqlParams1);
    if (tb.affectedRows == 1) {
      message.tackBack(id);
      res.send({ data, tb, status: 200 });
    } else {
      res.send({ status: 400 });
    }
  } catch (err) {
    console.log(err.message);
    res.send({ status: 400 });
  }
};

// token生成
exports.createToken = async function (token, id, time, res) {
  try {
    const sql =
      " INSERT INTO token(token, user_id, created_at) VALUES(?, ?, ?) ";
    const sqlParams = [token, id, time];
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
    const sql = "DELETE FROM token where user_id = ?";
    const sqlParams = [user_id];
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
    const { data, id } = await inspect(token);
    const sql = "SELECT * FROM confirm where user_id = ? ";
    const sqlParams = [id];
    const result = await runQuery(sql, sqlParams);
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
    const { data, id } = await inspect(token);
    const sql =
      "INSERT INTO friend(user_id, friend_id, friend_name, friend_img) VALUES(?, ?, ?, ?)";
    const sqlParams = [id, friend_id, friend_name, friend_img];
    const result = await runQuery(sql, sqlParams);
    const sql1 = "DELETE FROM confirm where user_id = ? and friend_id = ?";
    const sqlParams1 = [id, friend_id];
    const del = await runQuery(sql1, sqlParams1);
    res.send({ data, result, del, status: 200 });
  } catch (err) {
    console.log(err.message);
    res.send({ status: 400 });
  }
};

// 邀請拒絕
exports.refuseApply = async function (friend_id, token, res) {
  try {
    const { data, id } = await inspect(token);
    const sql = "DELETE FROM confirm where user_id = ? and friend_id = ?";
    const sqlParams = [id, friend_id];
    const del = await runQuery(sql, sqlParams);

    const sql1 =
      `DELETE FROM friend where user_id in (${ id }, ${ friend_id }) and friend_id in (${ id }, ${ friend_id })`;
    const deleteFriend = await runQuery(sql1);
    res.send({ data, del, deleteFriend, status: 200 });
  } catch (err) {
    console.log(err.message);
    res.send({ status: 400 });
  }
};
