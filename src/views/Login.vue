<template>
  <div class="login">
    <div class="form-login">
      <div class="container-fluid">
        <div class="row">
          <div class="col-7">
            <img
              src="https://www.doptlrc.in/sites/default/files/inline-images/login-bg1_0.jpg"
              alt=""
            />
          </div>
          <div class="col-5">
            <div style="margin-top: 60px">
              <h1>Đăng nhập</h1>
              <form method="POST">
                <input
                  type="text"
                  :placeholder="'Email hoặc Username'"
                  v-model="account"
                />
                <p class="text-danger">{{ handleNotification(arrErrors, "account") }}</p>
                <input
                  type="password"
                  placeholder="Nhập mật khẩu"
                  v-model="password"
                />
                 <p class="text-danger">{{ handleNotification(arrErrors, "password") }}</p>
                <button type="submit" @click="handleLogin">Xác nhận</button>
              </form>
            </div>

            <router-link to="/register" style="text-decoration: none"
              >Chưa có tài khoản? Đăng ký ngay!</router-link
            >
            <p class="text-danger">{{message}}</p> 
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { ref } from "vue";
import axios from "axios";
import {useRouter} from "vue-router"
import { useStore } from 'vuex'
import { handleNotification, checkToken } from "../module/index.js"

export default {
  setup() {
    const account = ref("");
    const password = ref("");
    const arrErrors = ref([]);
    const message = ref("")
    const router = useRouter()
    const store = useStore();
    const handleLogin = async (event) => {
      try {
        event.preventDefault();
        const response = await axios.post(
          `${process.env.VUE_APP_URL}/user/login`,
          { account: account.value, password: password.value }
        );
        // console.log("response", response.data);
        if(response.data.success) {
          localStorage.setItem('token', response.data.token)
          router.push({ path: '/' })
        }
      } catch (error) {
        console.error(error.response.data);
        if (error.response.data.errors) {
          arrErrors.value = error.response.data.errors;
        } else {
          arrErrors.value = [];
          message.value = error.response.data.message
          setTimeout(()=> {
            message.value = ""
          }, 5000)
        }
      }
    };
   
    checkToken().then( (result) => {
        if(result){
          router.push({ path: '/' })
          store.commit('setAuth', true)
          store.commit('setRole', result.data.role)
        } 
    } )
  

    return {
      account,
      password,
      arrErrors,
      message,
      handleLogin,
      handleNotification,
      checkToken,
      // ...mapMutations(['isAuth', 'isRole'])
    };
  }
};
</script>
<style scoped>
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
  background: linear-gradient(to right, #0033cc 0%, #cc3399 82%);
}
.login .form-login {
  width: 75%;
  height: 500px;
  background-color: #fff;
  border-radius: 20px;
}
.login .form-login img {
  max-width: 100%;
  max-height: 100%;
  margin-top: 20%;
}
.login .form-login h1 {
  font-weight: bold;
  /* text-align: center; */
  font: "Poppins-Bold";
  color: #333;
  line-height: 1.2;
}
a {
  font: "Poppins-Bold";
  /* font-size: 25px; */
  color: #a4a4a4;
  align-self: flex-end;
}
a:hover {
  color: blue;
}
input {
  width: 350px;
  height: 55px;
  border-radius: 30px;
  background-color: #e7e7e7;
  font-size: 25px;
  color: #a4a4a4;
  border: none;
  padding: 0 20px;
  font: "Poppins-Bold";
  margin: 10px 0;
}
input:focus {
  outline: none;
  border: 2px solid rgb(9, 226, 63);
  box-shadow: 0px 0px 10px 3px rgb(9 226 63);
  color: #666;
}
button {
  width: 350px;
  height: 55px;
  border-radius: 30px;
  background-color: #57b846;
  font-size: 25px;
  color: #fff;
  border: none;
  padding: 0 20px;
  font: "Poppins-Bold";
  margin: 10px 0;
}
button:hover {
  background-color: rgb(31, 27, 27);
}

</style>
