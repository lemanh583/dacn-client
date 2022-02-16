// import Vue from 'vue'
import Vuex from 'vuex'

// Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    isAuth: false,
    isRole: Number,
    nameUser: "",
    id: "",
    img: "http://windows79.com/wp-content/uploads/2021/02/Thay-the-hinh-dai-dien-tai-khoan-nguoi-dung-mac.png"
  },
  mutations: {
    setAuth(state, value) {
      state.isAuth = value
    },
    setRole(state, value) {
      state.isRole = value
    },
    setName(state, value) {
      state.nameUser = value
    },
    setId(state, value) {
      state.id = value
    },
    setImg(state, value) {
      state.img = value
    }
  }
})

export default store