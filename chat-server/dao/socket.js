module.exports = function (io) {
  console.log("vue連接成功");
  // event.js
  const message = require("../event/event");
  var users = {}; //socket註冊用戶(傳訊)
  var member = {}; //socket註冊用戶(圖片更換)
  // 存儲socket
  const socketMaps = {};
  const localMaps = {};
  // 存儲房間比對參數
  const paramsCom = {};
  // 存儲io
  var chatData = {};
  var homeData = {};

  // 後端送出事件，前端接收事件
  message.on("msg", (id, msg, sendTo) => {
    if (!socketMaps[id]) {
      return;
    } else {
      if (paramsCom[sendTo] == users[sendTo] + id) {
        socketMaps[id].to(users[sendTo]).emit("to", msg, id);
      } else {
        console.log("進錯房間囉");
      }
    }
  });
  message.on("img", (id, msg, sendTo) => {
    if (!socketMaps[sendTo]) {
      return;
    } else {
      if (paramsCom[sendTo] == users[sendTo] + id) {
        socketMaps[id].to(users[sendTo]).emit("toImg", msg, id);
      } else {
        console.log("進錯房間囉");
      }
    }
  });
  message.on("tackBack", (id) => {
    chatData.emit("back", id);
  });
  message.on("changeImg", (id, img) => {
    homeData.emit("toChange", id, img);
  });

  // Socket連線
  io.on("connection", (socket) => {
    // 用戶登入註冊
    socket.on("login", (id, friend_id) => {
      users[id] = socket.id;
      paramsCom[id] = socket.id + friend_id;
      socketMaps[id] = socket;
      chatData = io;
    });
    // 用戶更換圖片
    socket.on("sendRoom", (id) => {
      homeData = io;
    });
  });
};
