<template>
  <div class="client-register">
    <div class="container register">
      <div class="row">
        <div class="col-md-3 register-left">
          <img src="https://image.ibb.co/n7oTvU/logo_white.png" alt="" />
          <h3>Welcome</h3>
          <p>You are 30 seconds away from earning your own money!</p>
          <p>Bạn đã có tài khoản? Đăng nhập ngay!</p>
          <router-link
            to="/login"
          >
            <button
              class="btn btn-light"
              style="width: 200px; border-radius: 20px;color: black; font-weight: 700"
            >
              Đăng nhập
            </button>
          </router-link>
        </div>
        <div class="col-md-9 register-right">
          <div class="tab-content" id="myTabContent">
            <div
              class="tab-pane fade show active"
              id="home"
              role="tabpanel"
              aria-labelledby="home-tab"
            >
              <h3 class="register-heading font-weight-bold">Chào mừng bạn đến với WebNews</h3>
              <form method="POST">
                <div class="row register-form">
                  <div class="col-md-1"></div>
                  <div class="col-md-10">
                    <div class="form-group">
                      <input
                        v-model="username"
                        type="text"
                        class="form-control"
                        placeholder="Nhập tên đăng nhập"
                      />
                    </div>
                    <p class="text-danger">{{handleNotification(arrErrors, 'username')}}</p>
                    <div class="form-group">
                      <input
                        v-model="email"
                        type="text"
                        class="form-control"
                        placeholder="Nhập email"
                      />
                    </div>
                    <p class="text-danger">
                      {{handleNotification(arrErrors, 'email')}}
                    </p>
                    <div class="form-group">
                      <input
                        v-model="name"
                        type="text"
                        class="form-control"
                        placeholder="Nhập Họ và Tên"
                      />
                    </div>
                    <p class="text-danger">{{handleNotification(arrErrors, 'name')}}</p>
                    <div class="form-group">
                      <input
                        v-model="password"
                        type="password"
                        class="form-control"
                        placeholder="Nhập mật khẩu"
                      />
                    </div>
                    <p class="text-danger">{{handleNotification(arrErrors, 'password')}}</p>
                    <div class="form-group">
                      <input
                        v-model="rePassword"
                        type="password"
                        class="form-control"
                        placeholder="Xác nhận mật khẩu"
                      />
                    </div>
                    <p class="text-danger">{{handleNotification(arrErrors, 'rePassword')}}</p>
                    <input type="submit" class="btnRegister" value="Register" @click="handelRegister" />
                  </div>
                </div>
              </form>
            </div>
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
    const username = ref("");
    const email = ref("");
    const rePassword = ref("");
    const password = ref("");
    const name = ref("")
    const arrErrors = ref([]);
    const router = useRouter()
    const store = useStore();

    const handelRegister = async (event) => {
      try {
        event.preventDefault()
        let data = {
          username: username.value,
          email: email.value,
          name: name.value,
          password: password.value,
          rePassword: rePassword.value
        }
        const response = await axios.post(`${process.env.VUE_APP_URL}/user/create`, data)
        console.log('responseReg', response)
        if(response.data.success) {
          localStorage.setItem('token', response.data.token)
          store.commit("setAuth", true);
          store.commit("setRole", response.data.data.role)
          store.commit('setName', response.data.data.name)
          store.commit('setId', response.data.data._id)
          router.push({path: "/"}) 
        }
      } catch (error) {
        console.error(error.response)
        if(error.response.data.errors) {
          arrErrors.value = error.response.data.errors
        }else {
           arrErrors.value = []
        }
      }
    }

    checkToken().then( (result) =>{
      if(result) {
        router.push({ path: '/' })
        store.commit('setAuth', true)
        store.commit('setRole', result.data.role)
      }
    })

    return {
      username,
      email,
      rePassword,
      password,
      name,
      arrErrors,
      handelRegister,
      handleNotification
    };
  },
};
</script>
<style scoped>
p {
  margin: 2px;
  font-weight: 700;
  font-size: 15px;
  height: 22px;
}
/* input {
   margin-bottom: 20px;
} */
.client-register {
  width: 100%;
  height: 100vh;
  background: linear-gradient(to right, #0033cc 0%, #cc3399 82%);
}
.register {
  background: -webkit-linear-gradient(left, #3931af, #00c6ff);
  /* margin-top: 3%; */
  padding: 3%;
  position: relative;
  /* width: 100%; */
  top: 5%;
}
.register-left {
  text-align: center;
  color: #fff;
  margin-top: 4%;
}
.register-left input {
  border: none;
  border-radius: 1.5rem;
  padding: 2%;
  width: 60%;
  background: #f8f9fa;
  font-weight: bold;
  color: #383d41;
  margin-top: 30%;
  margin-bottom: 3%;
  cursor: pointer;
}
.register-right {
  background: #f8f9fa;
  border-top-left-radius: 10% 50%;
  border-bottom-left-radius: 10% 50%;
}
.register-left img {
  margin-top: 15%;
  margin-bottom: 5%;
  width: 25%;
  -webkit-animation: mover 2s infinite alternate;
  animation: mover 1s infinite alternate;
}
@-webkit-keyframes mover {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-20px);
  }
}
@keyframes mover {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-20px);
  }
}
.register-left p {
  font-weight: lighter;
  padding: 12%;
  margin-top: -9%;
}
.register .register-form {
  padding: 5%;
  margin-top: 10%;
}
.btnRegister {
  float: right;
  /* margin-top: 10%; */
  border: none;
  border-radius: 1.5rem;
  padding: 2%;
  background: #0062cc;
  color: #fff;
  font-weight: 600;
  width: 50%;
  cursor: pointer;
}
.register .nav-tabs {
  margin-top: 3%;
  border: none;
  background: #0062cc;
  border-radius: 1.5rem;
  width: 28%;
  float: right;
}
.register .nav-tabs .nav-link {
  padding: 2%;
  height: 34px;
  font-weight: 600;
  color: #fff;
  border-top-right-radius: 1.5rem;
  border-bottom-right-radius: 1.5rem;
}
.register .nav-tabs .nav-link:hover {
  border: none;
}
.register .nav-tabs .nav-link.active {
  width: 100px;
  color: #0062cc;
  border: 2px solid #0062cc;
  border-top-left-radius: 1.5rem;
  border-bottom-left-radius: 1.5rem;
}
.register-heading {
  text-align: center;
  margin-top: 5%;
  margin-bottom: -10%;
  color: #495057;
}
</style>
