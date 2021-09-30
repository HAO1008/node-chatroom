const event = require("events");
class Message extends event {
  // 訊息傳送
  msg(id, msg, sendto) {
    this.emit("msg", id, msg, sendto);
  }
  // 圖片傳送
  img(id, msg, sendto) {
    this.emit("img", id, msg, sendto);
  }
  // 訊息回收
  tackBack(id) {
    this.emit("tackBack", id);
  }
  // 圖片更換
  changeImg(id, img) {
    this.emit("changeImg", id, img);
  }
}

const message = new Message();
module.exports = message;
