<template>
  <div>
    <!-- topbar -->
    <div class="top-bar">
      <div class="top-left">
        <h2 @click="back">上一頁</h2>
      </div>
      <div class="top-right">
        <h2>關閉</h2>
      </div>
    </div>
    <!-- logo -->
    <div class="logo">
      <h1>Logo</h1>
    </div>
    <!-- main -->
    <div class="main">
      <div class="title">註冊畫面</div>
      <div class="inputs">
        <input type="text" v-model="user" placeholder="請輸入用戶名"/>
        <input
          v-model="email"
          type="email"
          placeholder="請輸入電子郵件"
          @blur="isEmail"
        />
        <input type="password" v-model="password" placeholder="請輸入密碼"/>
        <button :class="[{ submit: isok }, { submit1: !isok }]" @click="submit">
          註冊
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import url from "../../public/js/url"

export default {
  name: "SignIn",
  data() {
    return {
      email: "",
      user: "",
      password: "",
      isok: false,
    };
  },
  methods: {
    // 判斷信箱格式
    isEmail() {
      let reg = /^\w+((.\w+)|(-\w+))@[A-Za-z0-9]+((.|-)[A-Za-z0-9]+).[A-Za-z0-9]+$/;

      if (this.email.length > 0) {
        // 如果格式正確
        if (reg.test(this.email)) {
          console.log("信箱格式正確");
        } else {
          alert("格式錯誤");
        }
      }
    },
    back() {
      this.$router.go(-1);
    },
    // 註冊
    async submit() {
      let data = await axios.post( this.api + "/signup/add", {
        name: this.user,
        pwd: this.password,
        mail: this.email,
        time: new Date(),
      });
      if (data.data.status == 400) {
        alert("電子郵件已被註冊");
      } else if (data.data.status == 200) {
        this.$router.push("/");
      }
    },
  },
  computed: {
    api() {
      return url.url()
    }
  },
  updated() {
    if (this.email && this.password.length > 6 && this.user) {
      this.isok = true;
    }
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
    .submit {
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
    .submit1 {
      width: 50%;
      padding: 10px 15px;
      margin-top: 30px;
      border-radius: 30px;
      background-color: rgb(116, 116, 116);
      color: #222;
      border: none;
      cursor: pointer;
      transition: 0.5s;
      color: #fff;
    }
  }
}
</style>
