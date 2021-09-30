const register = require("../server/user-register");
const login = require("../server/user-login");
const search = require("../server/user-search");
const getUser = require("../server/user-get");
const updateImg = require("../server/user-update");
const getFriend = require("../server/friend-get");
const addFriend = require("../server/friend-add");
const insert = require("../server/message-insert");
const show = require("../server/message-show");
const takeBack = require("../server/message-takeback");
const created = require("../server/token-created");
const deleted = require("../server/token-delete");
const confirm = require("../server/invitation-confirm");
const apply = require("../server/invitation-apply");
const refuse = require("../server/invitation-refuse");

module.exports = function (app) {
  // 用戶註冊
  app.post("/signup/add", function (req, res) {
    register.register(req, res);
  });

  // 用戶登入
  app.post("/signin/match", function (req, res) {
    login.login(req, res);
  });

  // 用戶搜尋
  app.post("/search/user", (req, res) => {
    search.searchUser(req, res);
  });

  // 用戶資訊
  app.post("/home/getuser", (req, res) => {
    getUser.getUser(req, res);
  });

  // 用戶圖片更新
  app.post("/img/update", function (req, res) {
    updateImg.updateImg(req, res);
  });

  // 好友列表
  app.post("/home/getfriend", (req, res) => {
    getFriend.getFriend(req, res);
  });

  // 好友增加
  app.post("/add/user", (req, res) => {
    addFriend.addFriend(req, res);
  });

  // 訊息傳遞
  app.post("/chat/match", (req, res) => {
    insert.chatInsert(req, res);
  });

  // 訊息渲染
  app.post("/chat/show", (req, res) => {
    show.show(req, res);
  });

  // 訊息收回
  app.post("/take/back", (req, res) => {
    takeBack.takeBack(req, res);
  });

  // token生成
  app.post("/token/created", (req, res) => {
    created.createToken(req, res);
  });

  // token移除
  app.post("/token/delete", (req, res) => {
    deleted.deleteToken(req, res);
  });

  // 邀請列表
  app.post("/confirm/show", (req, res) => {
    confirm.confirmUser(req, res);
  });

  // 邀請接受
  app.post("/handle/apply", (req, res) => {
    apply.handleApply(req, res);
  });

  // 邀請拒絕
  app.post("/refuse/apply", (req, res) => {
    refuse.refuseApply(req, res);
  });
};
