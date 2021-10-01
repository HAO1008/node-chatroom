<template>
  <div class="content">
    <!-- Personal -->
    <Personal v-if="flag" @close="closePersonal"> </Personal>
    <!-- top -->
    <div class="top-bar">
      <div class="top-left" @click="openPersonal">
        <img class="home-img" :src="img" alt="" />
        <h2>{{ user_name }}</h2>
      </div>
      <div class="top-center">
        <h2>Chatroom</h2>
      </div>
      <div class="top-right">
        <h2 @click="search">search</h2>
        <h2 @click="goConfirm">Confrim</h2>
      </div>
    </div>
    <!-- main -->
    <div class="main">
      <div class="apply"></div>
      <div class="friends">
        <div
          v-for="item in friends"
          :key="item.id"
          class="friend-list"
          @click="goChat(item)"
        >
          <!-- 左側大頭貼 -->
          <div class="friend-list-l">
            <img class="img-box" :src="item.friend_img" alt="" />
          </div>
          <!-- 右側文字 -->
          <div class="friend-list-r">
            <div class="top">
              <div class="name">{{ item.friend_name }}</div>
              <div class="time">{{ changeTime(new Date()) }}</div>
            </div>
            <div class="bottom">
              <div class="content">
                {{ item.news }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import {api} from "../../public/js/url";
import timefun from "../../public/js/timefun";
import Personal from "../components/Personal.vue";

// socket
import io from "socket.io-client";
const socket = io("http://localhost:3000");

export default {
  name: "Home",
  components: {
    Personal,
  },
  data() {
    return {
      friends: [],
      user_id: "",
      user_name: "",
      img: "",
      token: "",
      // 子組件開關
      flag: false,
    };
  },
  methods: {
    changeTime(data) {
      return timefun.dateTime(data);
    },
    search() {
      this.$router.push("/search");
    },
    goConfirm() {
      this.$router.push({ name: "Confirm" });
    },
    // 進入聊天室
    goChat(index) {
      const friend = [
        {
          friend_name: index.friend_name,
          friend_img: index.friend_img,
          friend_id: index.friend_id,
        },
      ];
      const friendString = JSON.stringify(friend);
      localStorage.setItem("friend", friendString);
      this.$router.push("/chatroom/" + index.friend_id);
    },
    // 獲取緩存數據 - token
    getStorages() {
      const getData = localStorage.getItem("token");
      const getDataString = JSON.parse(getData);
      const store = getDataString[0];
      this.token = store.token;
    },
    // 獲取好友資訊
    async getFriend() {
      const res = await axios.post(api + "/home/getfriend", {
        token: this.token,
      });
      const resData = res.data;
      const result = resData.result;
      const status = resData.status;
      if (status == 200) {
        this.friends = result;
      } else {
        alert("token比對錯誤");
        this.$router.push({ name: "Relogin" });
      }
    },
    // 獲取用戶資訊
    async getUser() {
      try {
        const res = await axios.post(api + "/home/getuser", {
          token: this.token,
        });
        const resData = res.data;
        const store = resData.result[0];
        const status = resData.status;
        if (status == 200) {
          this.user_id = store.id;
          this.user_name = store.name;
          this.img = store.img;
        } else {
          alert("token比對錯誤");
          this.$router.push({ name: "Relogin" });
        }
      } catch (err) {
        alert("請重新登入");
        this.$router.push({ name: "Relogin" });
      }
    },
    // 子組件開關
    openPersonal() {
      this.flag = true;

      if (localStorage.getItem("token") == null) {
        alert("token錯誤");
        this.$router.push({ name: "Relogin" });
      }
    },
    // 子傳父關閉
    closePersonal(e) {
      this.flag = e;
    },
    // socket
    socketJoin(id) {
      socket.emit("sendRoom", id);
    },
    // 接收更新圖片
    receiveSocketFriendImg() {
      socket.on("toChange", () => {
        this.getUser();
        this.getFriend();
      });
    },
  },
  created() {
    this.getStorages();
    this.getFriend();
    this.getUser();
    this.socketJoin(this.user_id);
  },
  mounted() {
    this.receiveSocketFriendImg();
  },
};
</script>

<style lang="less" scoped>
.content {
  // top
  .top-bar {
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
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      .home-img {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        object-fit: cover;
      }
      h2 {
        padding-left: 10px;
      }
    }
    .top-right {
      padding-right: 1%;
      width: 20%;
      display: flex;
      align-items: center;
      justify-content: space-around;
    }
  }
  // center內容
  .apply {
    padding: 0 20px;
  }
  .friends {
    position: relative;
    width: 95%;
    height: auto;
    margin: 30px auto;
    // background-color: rgb(206, 206, 206);
    .friend-list {
      width: 100%;
      height: 96px;
      display: flex;
      align-items: center;
      margin: 15px;
      &:active {
        background-color: #3ff;
      }
      // 左側
      .friend-list-l {
        position: relative;
        width: 96px;
        height: 96px;
        background-color: orange;
        p {
          position: absolute;
          right: -10%;
          top: -20%;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background-color: #f00;
          color: #fff;
        }
        .img-box {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
      // 右側
      .friend-list-r {
        width: 100%;
        display: flex;
        flex-direction: column;
        .top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          .name {
            font-weight: bolder;
            font-size: 1.2rem;
            padding-left: 3%;
          }
          .time {
            color: rgb(116, 116, 116);
            font-weight: bold;
            padding-right: 3%;
          }
        }
        .bottom {
          .content {
            padding-left: 3%;
          }
        }
      }
    }
  }
}
</style>
