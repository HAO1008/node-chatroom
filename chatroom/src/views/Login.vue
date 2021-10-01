<template>
  <div>
    <!-- topbar -->
    <div class="top-bar">
      <div class="top-left">
        <h2>close</h2>
      </div>
      <div class="top-right">
        <h2 @click="signIn">註冊</h2>
      </div>
    </div>
    <!-- logo -->
    <div class="logo">
      <h1>Logo</h1>
    </div>
    <!-- main -->
    <div class="main">
      <div class="title">登入畫面</div>
      <div class="slogan">歡迎來到xxx</div>
      <div class="inputs">
        <input type="text" v-model="email" placeholder="請輸入電子郵件" />
        <input type="password" v-model="password" placeholder="請輸入密碼" />
        <p class="err" :style="{ display: warning }">帳號或用戶名錯誤!!!</p>
        <button @click="login">登入</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { api } from "../../public/js/url";

export default {
  name: "Login",
  data() {
    return {
      email: "",
      password: "",
      warning: "none",
      // user
      user_id: "",
      token: "",
      time: new Date(),
    };
  },
  methods: {
    signIn() {
      this.$router.push("/signup");
    },
    // 登入
    async login() {
      const reg = /^\w+((.\w+)|(-\w+))@[A-Za-z0-9]+((.|-)[A-Za-z0-9]+).[A-Za-z0-9]+$/;
      if (!this.email.length > 0 || !this.password.length > 0) {
        alert("請輸入正確資料");
        return;
      }
      if (!reg.test(this.email)) {
        alert("email格式錯誤");
        return;
      }
      const res = await axios.post(api + "/signin/match", {
        email: this.email,
        pwd: this.password,
      });
      const resData = res.data;
      const status = resData.status;
      const token = resData.token;
      if (status !== 200) {
        this.warning = "block";
        this.email = "";
        this.password = "";
        return;
      }
      const result = resData.data[0];
      const store = [
        {
          id: result.id,
          name: result.name,
          token: token,
          time: result.created_at,
          img: result.img,
          email: result.email,
        },
      ];
      const storeString = JSON.stringify(store);
      localStorage.setItem("token", storeString);
      this.createToken();
      this.$router.push({ name: "Home" });
      location.reload();
    },
    // 生成token
    async createToken() {
      const getData = localStorage.getItem("token");
      const getDataString = JSON.parse(getData);
      const store = getDataString[0];
      this.user_id = store.id;
      this.token = store.token;
      const res = await axios.post(api + "/token/created", {
        token: this.token,
        id: this.user_id,
        time: this.time,
      });
    },
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
  .top-right {
    padding-right: 1%;
    width: 20%;
    display: flex;
    align-items: center;
    justify-content: space-around;
  }
}
.logo {
  width: 100%;
  height: 20vh;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif;
}
.main {
  width: 60%;
  height: auto;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .title {
    align-self: flex-start;
  }
  .slogan {
    align-self: flex-start;
    color: rgb(116, 116, 116);
  }
  .inputs {
    width: 100%;
    height: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    input {
      width: 100%;
      height: 30px;
      margin: 15px auto;
      padding: 15px;
    }
    .err {
      background-color: #f00;
      padding: 3px 10px;
      border-radius: 5px;
      color: #fff;
      font-size: 0.8rem;
    }
    button {
      width: 50%;
      padding: 10px 15px;
      margin-top: 30px;
      border-radius: 30px;
      background-color: #ffd180;
      color: #222;
      border: none;
      cursor: pointer;
      transition: 0.5s;
      &:hover {
        background-color: #222;
        color: #fff;
      }
    }
  }
}
</style>
