<template>
  <div class="personal-container">
    <h1 class="close" @click="closePersonal">關閉</h1>
    <label for="file">
      <div class="box">
        <div class="add"></div>
      </div>
    </label>
    <input @change="uploadImg" type="file" id="file" />
    <h1 class="friendcode">好友邀請碼為:{{ email }}</h1>
  </div>
</template>

<script>
import axios from "axios";
import url from "../../public/js/url";

// socket
import io from "socket.io-client";
const socket = io("http://localhost:3000");

export default {
  name: "Personal",
  props: {
    flag: Boolean,
  },
  data() {
    return {
      email: "",
      id: "",
      img: "",
    };
  },
  methods: {
    closePersonal() {
      this.$emit("close", false);
    },
    // 獲取緩存數據
    getStorages() {
      var getData = localStorage.getItem("token");
      var getDataString = JSON.parse(getData);
      let store = getDataString[0];
      this.email = store.email;
      this.id = store.id;
      this.img = store.img;
      return {
        token: store.token,
      };
    },
    // 圖片上傳 64base
    uploadImg(e) {
      let file = e.target.files[0];
      let reader = new FileReader();
      reader.onload = () => {
        this.updateImg(reader.result);
      };
      reader.readAsDataURL(file);
      this.closePersonal();
    },
    // 更新使用者後端圖片
    async updateImg(src) {
      const { token } = this.getStorages();
      let data = await axios.post(this.api + "/img/update", {
        img: src,
        friend_img: src,
        token: token,
      });
      let status = data.data.status;
      if (status != 200) {
        alert("token錯誤");
        this.$router.push("/relogout");
      }
      // 更新localstorage數據
      var getData = localStorage.getItem("token");
      var getDataString = JSON.parse(getData);
      let store = getDataString[0];
      let list = [
        {
          email: store.email,
          id: store.id,
          img: src,
          name: store.name,
          time: store.time,
          token: store.token,
        },
      ];
      var listString = JSON.stringify(list);
      localStorage.removeItem("token");
      localStorage.setItem("token", listString);
    },
  },
  computed: {
    api() {
      return url.url();
    },
  },
  created() {
    this.getStorages();
  },
};
</script>

<style lang="less" scoped>
.personal-container {
  z-index: 999;
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(3px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .close {
    position: absolute;
    right: 5%;
    top: 5%;
    color: #fff;
    cursor: pointer;
  }
  .box {
    cursor: pointer;
    width: 200px;
    height: 200px;
    border-radius: 50%;
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 50%;
    }
    .add {
      position: relative;
      &::before {
        position: absolute;
        transform: translate(-50%, -50%);
        content: "";
        background-color: #222;
        width: 50px;
        height: 5px;
      }
      &::after {
        position: absolute;
        transform: translate(-50%, -50%);
        content: "";
        background-color: #222;
        width: 5px;
        height: 50px;
      }
    }
  }
  #file {
    visibility: hidden;
  }
  .friendcode {
    color: #fff;
  }
}
</style>
