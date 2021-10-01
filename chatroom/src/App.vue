<template>
  <div id="app">
    <div id="nav" v-if="this.user_id != null">
      <router-link to="/home">Home</router-link> |
      <router-link v-if="flag" to="/">Login</router-link>
      <a v-else @click="remove">Logout</a>
    </div>
    <router-view :key="$route.fullPath" />
  </div>
</template>

<script>
import axios from "axios";
import { api } from "../public/js/url";

export default {
  data() {
    return {
      flag: true,
      user_id: "",
    };
  },
  methods: {
    // 獲取緩存數據
    getStorages() {
      const getData = localStorage.getItem("token");
      const getDataString = JSON.parse(getData);
      const store = getDataString[0];
      this.user_id = store.id;
    },
    // 移除token
    async remove() {
      try {
        const res = await axios.post(api + "/token/delete", {
          user_id: this.user_id,
        });
        localStorage.removeItem("token");
        localStorage.removeItem("friend");
        this.$router.push("/logout");
        location.reload();
      } catch (err) {
        alert("請重新登入");
        this.$router.push({ name: "Relogin" });
      }
    },
  },
  mounted() {
    // 變更flag login/logout
    if (localStorage.getItem("token") != null) {
      this.flag = false;
    } else {
      this.flag = true;
    }
  },
  created() {
    if (localStorage.getItem("token") == null) {
      console.log("請登入");
    } else {
      this.getStorages();
    }
  },
};
</script>

<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    cursor: pointer;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
