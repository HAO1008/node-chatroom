<template>
  <div>
    <!-- top -->
    <div class="top-bar">
      <div class="top-left">
        <h2 @click="goHome">回首頁</h2>
      </div>
      <div class="top-right">
        <h2>names</h2>
      </div>
    </div>
    <!-- main -->
    <div class="main" v-for="item in confirmList" :key="item.user_id">
      <div class="search-user result">
        <div class="list-user">
          <img class="img" :src="item.friend_img" alt="" />
          <div class="names">
            <div class="name">{{ item.friend_name }}</div>
          </div>
          <div class="button-group">
            <button class="confirm" @click="handleApply(item)">確認</button>
            <button class="refuse" @click="refuseApply(item)">拒絕</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { api } from "../../public/js/url";

export default {
  name: "Confirm",
  data() {
    return {
      confirmList: [],
      // user
      user_id: "",
      user_name: "",
      user_img: "",
      token: "",
    };
  },
  methods: {
    goHome() {
      this.$router.push({ name: "Home" });
    },
    // 獲取緩存數據
    getStorages() {
      const getData = localStorage.getItem("token");
      const getDataString = JSON.parse(getData);
      const store = getDataString[0];
      this.user_id = store.id;
      this.user_name = store.name;
      this.user_img = store.img;
      this.token = store.token;
      return {
        token: store.token,
      };
    },
    // 確認列表渲染
    async getConfirmList() {
      try {
        const res = await axios.post(api + "/confirm/show", {
          token: this.token,
        });
        const status = res.data.status;
        if (status == 200) {
          const result = res.data.result;
          this.confirmList = result;
        } else {
          alert("token錯誤");
          this.$router.push({ name: "Relogin" });
        }
      } catch (err) {
        alert("請重新登入");
        this.$router.push({ name: "Relogin" });
      }
    },
    // 接受邀請
    async handleApply(item) {
      try {
        const { token } = this.getStorages();
        const res = await axios.post(api + "/handle/apply", {
          friend_id: item.friend_id,
          friend_name: item.friend_name,
          friend_img: item.friend_img,
          token: token,
        });
        location.reload();
        const status = res.data.status;
        if (status != 200) {
          alert("token錯誤");
          this.$router.push({ name: "Relogin" });
        }
      } catch (err) {
        alert("請重新登入");
        this.$router.push({ name: "Relogin" });
      }
    },
    // 拒絕請求
    async refuseApply(item) {
      try {
        const { token } = this.getStorages();
        const res = await axios.post(api + "/refuse/apply", {
          friend_id: item.friend_id,
          token: token,
        });
        location.reload();
        const status = res.data.status;
        if (status != 200) {
          alert("token錯誤");
          this.$router.push({ name: "Relogin" });
        }
      } catch (err) {
        alert("請重新登入");
        this.$router.push({ name: "Relogin" });
      }
    },
  },
  created() {
    this.getStorages();
    this.getConfirmList();
  },
};
</script>

<style lang="less" scoped>
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
    cursor: pointer;
  }
  .top-center {
    width: 50%;
    input {
      width: 80%;
      height: 30px;
    }
  }
  .top-right {
    padding-right: 5%;
    display: flex;
    align-items: center;
    justify-content: space-around;
  }
}
.main {
  width: 95%;
  margin: 0 auto;
  height: auto;
  .search-user {
    width: 100%;
    .list-user {
      margin-top: 50px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .img {
        width: 100px;
        height: 100px;
        object-fit: cover;
        background-color: aquamarine;
      }
      .names {
        .name {
          text-align: start;
          font-size: 1.2rem;
          font-weight: bold;
        }
      }
      .button-group {
        .confirm {
          background-color: #ffd180;
          color: #222;
          border: none;
          border-radius: 16px;
          padding: 8px 15px;
          cursor: pointer;
          margin-right: 15px;
        }
        .refuse {
          background-color: #f00;
          color: #fff;
          border: none;
          border-radius: 16px;
          padding: 8px 15px;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
