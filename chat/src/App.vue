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
export default {
  data() {
    return {
      flag: true,
      user_id: "",
      zero: 0,
    };
  },
  methods: {
    // 獲取緩存數據
    getStorages() {
      var getData = localStorage.getItem("token");
      var getDataString = JSON.parse(getData);
      let store = getDataString[this.zero];
      this.user_id = store.id;
    },
    // 移除token
    async remove() {
      let data = await axios.post("http://192.168.1.102:3000/token/delete", {
        user_id: this.user_id,
      });
      console.log(data);
      localStorage.removeItem("token");
      localStorage.removeItem("friend");
      this.$router.push("/logout");
      location.reload();
    },
  },
  mounted() {
    // 變更flag login/logout
    if (localStorage.getItem("token") != undefined) {
      this.flag = false;
    } else {
      this.flag = true;
    }
  },
  created() {
    this.getStorages();
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
