const user = require("../controll/user");
const friend = require("../controll/friend");
const message = require("../controll/message")
const token = require("../controll/token")
const invitation = require("../controll/invitation")

module.exports = function (app) {
  // 用戶註冊
  app.post("/signup/add", function (req, res) {
    user.register(req, res);
  });

  // 用戶登入
  app.post("/signin/match", function (req, res) {
    user.login(req, res);
  });

  // 用戶搜尋
  app.post("/search/user", (req, res) => {
    user.searchUser(req, res);
  });

  // 用戶資訊
  app.post("/home/getuser", (req, res) => {
    user.getUser(req, res);
  });

  // 用戶圖片更新
  app.post("/img/update", function (req, res) {
    user.updateImg(req, res);
  });

  // 好友列表
  app.post("/home/getfriend", (req, res) => {
    friend.getFriend(req, res);
  });

  // 好友增加
  app.post("/add/user", (req, res) => {
    friend.addFriend(req, res);
  });

  // 訊息傳遞
  app.post("/chat/match", (req, res) => {
    message.chatInsert(req, res);
  });

  // 訊息渲染
  app.post("/chat/show", (req, res) => {
    message.show(req, res);
  });

  // 訊息收回
  app.post("/take/back", (req, res) => {
    message.takeBack(req, res);
  });

  // token生成
  app.post("/token/created", (req, res) => {
    token.createToken(req, res);
  });

  // token移除
  app.post("/token/delete", (req, res) => {
    token.deleteToken(req, res);
  });

  // 邀請列表
  app.post("/confirm/show", (req, res) => {
    invitation.confirmUser(req, res);
  });

  // 邀請接受
  app.post("/handle/apply", (req, res) => {
    invitation.handleApply(req, res);
  });

  // 邀請拒絕
  app.post("/refuse/apply", (req, res) => {
    invitation.refuseApply(req, res);
  });
};
