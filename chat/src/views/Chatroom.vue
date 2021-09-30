<template>
  <div @contextmenu.prevent>
    <!-- top -->
    <div class="top-bar" @click="hideTB">
      <div class="top-left">
        <h2 @click="leaveChat">離開</h2>
      </div>
      <div class="top-center">
        <h1>{{ friend_name }}</h1>
      </div>
      <div class="top-right">
        <div class="pice"></div>
        <img :src="friend_img" class="img" />
      </div>
    </div>
    <!-- chat-main -->
    <div class="chat" @click="hideTB">
      <div class="chatmain">
        <!-- 1 -->
        <div class="chat-ls" 
        v-for="item in msgs" 
        :key="item.id"
        >
          <div class="chat-time">{{ changeTime(item.created_at) }}</div>
          <div class="msg-m msg-left" v-if="item.user_id !== user_id">
            <img class="img" :src="friend_img" />
            <div v-if="item.type == 1" class="message">{{ item.msg }}</div>
            <div v-else>
              <img :src="item.msg" class="img-msg" />
            </div>
          </div>
          <div class="msg-m msg-right" v-else>
            <img class="img" :src="img" />
            <div
              v-if="item.type == 1"
              class="message"
              @click.right="clickRight"
            >
              {{ item.msg }}
              <span v-show="takeBack" @click="takeBackMsg(item.id)">收回</span>
            </div>
            <div v-else>
              <img
                :src="item.msg"
                class="img-msg"
                @click.right="clickRight"
              /><span v-show="takeBack" @click="takeBackMsg(item.id)">收回</span>
            </div>
          </div>
          <!-- 保持底部 -->
          <div v-scroll :style="'height:0'"></div>
        </div>
      </div>
    </div>

    <!-- submit -->
    <div class="submit">
      <div class="submit-chat">
        <div class="bt-img">語音</div>
        <input
          v-model.trim="msg"
          type="text"
          placeholder="輸入訊息"
          @keydown.enter="inputs"
          @click="hideTB"
        />
        <label class="bt-img" for="file">
          <div>圖片</div>
        </label>
        <input type="file" id="file" @change="uploadImg" />
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import url from "../../public/js/url"
import timefun from "../../public/js/timefun";

// socket
import io from "socket.io-client";
const socket = io("http://localhost:3000");

import Vue from "vue";
Vue.directive("scroll", {
  inserted(el) {
    el.scrollIntoView();
  },
});

export default {
  name: "Chatroom",
  props: ["router_id"],
  data() {
    return {
      msgs: [],
      // localstorage
      msg: "",
      user_id: "",
      user_name: "",
      img: "",
      // token
      token: "",
      // frined
      friend_img: "",
      friend_name: "",
      friend_id: "",
      // take back
      takeBack: false,
    };
  },
  methods: {
    clickRight() {
      this.takeBack = true;
    },
    hideTB() {
      this.takeBack = false;
    },
    // 回收訊息
    async takeBackMsg(index) {
      let { token } = this.getStorages();
      let res = await axios.post( this.api + "/take/back", {
        id: index,
        token: token,
      });
      let status = res.data.status;
      if (status != 200) {
        alert("token錯誤");
        this.$router.push({ name:"Relogin" });
      } else {
        this.sendback(index);
      }
    },
    leaveChat() {
      this.$router.push({ name:"Home" });
    },
    changeTime(data) {
      return timefun.dateTime(data);
    },
    // 獲取緩存數據
    getStorages() {
      var getData = localStorage.getItem("token");
      var getDataString = JSON.parse(getData);
      let store = getDataString[0];
      this.user_id = store.id;
      this.user_name = store.name;
      this.img = store.img;
      this.token = store.token;
      return {
        token: store.token,
      };
    },
    // 獲取好友資料
    getFriend() {
      var getData = localStorage.getItem("friend");
      var getDataString = JSON.parse(getData);
      let store = getDataString[0];
      this.friend_img = store.friend_img;
      this.friend_name = store.friend_name;
      this.friend_id = store.friend_id;
    },
    // 前端畫面渲染
    inputs() {
      if (this.msg.length > 0) {
        this.backinputs();
        this.msg = "";
      }
    },
    // 驗證聊天 & 訊息傳到後端(文字)
    async backinputs() {
      let { token } = this.getStorages();
      let res = await axios.post( this.api + "/chat/match", {
        msg: this.msg,
        type: 1,
        sendto: this.router_id,
        created_at: new Date(),
        token: token,
      });
      let status = res.data.status;
      if (status == 200) {
        console.log("成功");
        this.matchChat();
      } else {
        alert("token錯誤");
        this.$router.push({ name:"Relogin" });
      }
    },
    // 驗證聊天 & 渲染
    async matchChat() {
      let res = await axios.post(this.api + "/chat/show", {
        sendto: this.router_id,
        token: this.token,
      });
      let status = res.data.status;
      if (status == 200) {
        let results = res.data.results;
        this.msgs = results;
      } else {
        alert("token錯誤");
        this.$router.push({ name:"Relogin" });
      }
    },
    // 圖片上傳
    uploadImg(e) {
      let file = e.target.files[0];
      let reader = new FileReader();
      reader.onload = () => {
        // 頁面渲染
        let data = {
          user_id: this.user_id,
          msg: reader.result,
          type: 2,
          created_at: new Date(),
        };
        this.msgs.push(data);
        // 後端傳送
        this.backinputsImg(reader.result);
      };
      reader.readAsDataURL(file);
      // location.reload()
    },
    // 訊息傳到後端(圖片)
    async backinputsImg(src) {
      let res = await axios.post( this.api + "/chat/match", {
        user_id: this.user_id,
        user_name: this.user_name,
        msg: src,
        type: 2,
        sendto: this.router_id,
        created_at: new Date(),
        token: this.token,
      });
      this.matchChat();
      let token = res.data.data;
      if (token == 0) {
        this.$router.push({ name:"Relogin" });
      }
    },
    // socket
    socketLogin(id, friend_id) {
      socket.emit("login", id, friend_id);
    },
    // socket接收訊息
    receiveSocketMsg() {
      socket.on("to", (msg, user_id) => {
        let data = {
          user_id: user_id,
          msg: msg,
          type: 1,
          created_at: new Date(),
        };
        this.msgs.push(data);
      });
    },
    // socket接收圖片
    receiveSocketImg() {
      socket.on("toImg", (msg, user_id) => {
        let data = {
          user_id: user_id,
          msg: msg,
          type: 2,
          created_at: new Date(),
        };
        this.msgs.push(data);
      });
    },
    // socket回收圖片
    receiveSocketBack() {
      // socket收回訊息
      socket.on("back", (e) => {
        this.matchChat();
      });
    },
  },
  computed:{
    api() {
      return url.url()
    }
  },
  created() {
    this.getStorages();
    this.matchChat();
    this.socketLogin(this.user_id, this.router_id);
    this.getFriend();
  },
  mounted() {
    this.receiveSocketMsg();
    this.receiveSocketImg();
    this.receiveSocketBack();

    if (localStorage.getItem("friend") == undefined) {
      this.$router.push({ name:"Home" });
    }
  },
};
</script>

<style lang="less" scoped>
.top-bar {
  z-index: 999;
  position: fixed;
  top: 0;
  width: 100%;
  height: 10vh;
  background-color: #ffd180;
  color: #222;
  font-family: "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .top-left {
    padding-left: 5%;
    cursor: pointer;
  }
  .top-right {
    padding-right: 1%;
    width: 20%;
    display: flex;
    align-items: center;
    justify-content: space-around;
    .img {
      width: 90px;
      height: 90px;
      object-fit: cover;
      background-color: #222;
    }
  }
}

.chat {
  margin-bottom: 10vh;
  width: 100%;
  height: 100%;
  .chatmain {
    background-color: #888;
    padding: 50px;
    display: flex;
    flex-direction: column;
    .chat-ls {
      .chat-time {
        font-size: 15px;
        line-height: 34px;
        padding: 20px 0;
        text-align: center;
      }
      .msg-m {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        padding: 20px 0;
        .img {
          width: 80px;
          height: 80px;
          object-fit: cover;
          background-color: #222;
        }
        .user {
          background-color: chartreuse;
        }
        .message {
          position: relative;
          max-width: 300px;
          padding: 10px 20px;
          border-radius: 10px;
        }
        .img-msg {
          position: relative;
          width: 200px;
          height: 250px;
          margin: 10px;
          object-fit: cover;
        }
        span {
          background-color: #222;
        }
      }
      .msg-left {
        .message {
          background-color: #fff;
          margin-left: 30px;
          span {
            position: absolute;
            top: 0%;
            left: 120%;
            background-color: #222;
            color: #fff;
            padding: 10px;
            border-radius: 10px;
            cursor: pointer;
          }
        }
        div {
          position: relative;
          span {
            position: absolute;
            top: 50%;
            left: 120%;
            background-color: #222;
            color: #fff;
            padding: 10px;
            border-radius: 10px;
            cursor: pointer;
          }
        }
      }
      .msg-right {
        flex-direction: row-reverse;
        .message {
          background-color: #ffd180;
          margin-right: 30px;
          span {
            position: absolute;
            top: 0;
            right: 120%;
            background-color: #222;
            color: #fff;
            padding: 10px;
            border-radius: 10px;
            cursor: pointer;
          }
        }
        div {
          position: relative;
          span {
            position: absolute;
            top: 50%;
            right: 120%;
            background-color: #222;
            color: #fff;
            padding: 10px;
            border-radius: 10px;
            cursor: pointer;
          }
        }
      }
    }
  }
}

.submit {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 10vh;
  margin: 0 auto;
  background-color: #fff;
  .submit-chat {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .bt-img {
      font-size: 1.2rem;
      padding: 3%;
    }
    input {
      display: inline-block;
      width: 50%;
      min-height: 25px;
      font-size: 1.2rem;
      padding: 3px;
    }
    #file {
      display: none;
    }
  }
}
</style>
