// import Vue from 'vue'
import Vuex from 'vuex'

// Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    isAuth: false,
    isRole: Number,
    nameUser: ""
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
  }
})

export default store