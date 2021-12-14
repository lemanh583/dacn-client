import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Login from "../views/Login.vue"
import Register from "../views/Register.vue"
import Details from "../views/Details.vue"
import Error from "../views/Error.vue"
// import store from "../store"

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/:slug',
    name: '',
    component: Details
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
    // meta: {requireAuth: true}
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/:match(.*)*',
    component: Error
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// router.beforeEach((to, from, next) => { 
//   if(to.path == "/about") {
//     if(store.state.isAuth && store.state.isRole === 0 || store.state.isRole === 1){
//       return next()
//     }
//     else {
//       next({path: "/"})
//     }
//   }
//   next()
// })

export default router
