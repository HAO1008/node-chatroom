<template>
  <div>
    <!-- top -->
    <div class="top-bar">
      <div class="top-left">
        <h2>name</h2>
      </div>
      <div class="top-center">
        <input type="text" v-model="search" @keydown.enter="searchUser" />
      </div>
      <div class="top-right">
        <h2 @click="back">取消</h2>
      </div>
    </div>
    <!-- main -->
    <div class="main" v-show="show">
      <div class="search-user result">
        <div class="title">用戶</div>
        <div class="list-user">
          <img class="img" :src="userArr.img" alt="" />
          <div class="names">
            <div class="name">{{ userArr.name }}</div>
            <div class="email">{{ userArr.email }}</div>
          </div>
          <button :class="{ ok: add }" @click="addfriend">加好友</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import url from "../../public/js/url"

export default {
  name: "Search",
  data() {
    return {
      show: false,
      search: "",
      add: true,
      // 搜尋用戶
      userArr: {},
      // 使用者
      token: "",
      user_id: "",
      user_name: "",
      user_img: "",
      // 顯示/隱藏
      showPage: false,
    };
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
    // 獲取緩存數據
    getStorages() {
      var getData = localStorage.getItem("token");
      var getDataString = JSON.parse(getData);
      let store = getDataString[0];
      this.user_id = store.id;
      this.user_name = store.name;
      this.user_img = store.img;
      this.token = store.token;
      return {
        token: store.token,
      };
    },
    // 搜尋用戶
    async searchUser() {
      let { token } = this.getStorages();
      let data = await axios.post( this.api + "/search/user", {
        email: this.search,
        token: token,
      });
      let result = data.data.result;
      let status = data.data.status;
      if (status == 200) {
        if (result.length > 0) {
          this.show = true;
          this.userArr = result[0];
          if (this.user_id === this.userArr.id) {
            this.add = false;
          } else {
            this.add = true;
          }
        } else {
          alert("信箱錯誤");
        }
      } else {
        alert("token錯誤");
        this.$router.push("/logout");
      }
    },
    // 加好友
    async addfriend() {
      let { token } = this.getStorages();
      if (this.add == false) {
        alert("無法添加");
      } else {
        let data = await axios.post( this.api + "/add/user", {
          user_id: this.user_id,
          user_name: this.user_name,
          user_img: this.user_img,
          friend_id: this.userArr.id,
          friend_name: this.userArr.name,
          friend_img: this.userArr.img,
          token: token,
        });
        console.log(data);
        let status = data.data.status;
        if (status == 400) {
          alert("token比對錯誤");
          this.$router.push("/relogin");
        } else {
          if (status == 200) {
            alert("添加好友成功");
          } else if (status == 300) {
            alert("已擁有好友");
          } else {
            alert("發生錯誤");
            this.$router.push("/relogin");
          }
        }
      }
    },
  },
  computed: {
    api() {
      return url.url()
    }
  },
  created() {
    this.getStorages();
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
    .title {
      font-size: 1.5rem;
      font-weight: bold;
      color: #000;
      padding: 10px;
    }
    .list-user {
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
      button {
        background-color: gray;
        color: #222;
        border: none;
        border-radius: 16px;
        padding: 8px 15px;
        cursor: not-allowed;
      }
      .ok {
        background-color: #ffd180;
        color: #222;
        cursor: pointer;
      }
    }
  }
}
</style>
