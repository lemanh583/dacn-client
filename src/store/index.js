// import Vue from 'vue'
import Vuex from 'vuex'

// Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    isAuth: false,
    isRole: Number
  },
  mutations: {
    setAuth(state, value) {
      console.log('value', value)
      state.isAuth = value
    },
    setRole(state, value) {
      state.isRole = value
    }
  }
})

export default store