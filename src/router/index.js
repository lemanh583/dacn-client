import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Login from "../views/Login.vue"
import Register from "../views/Register.vue"
import Details from "../views/Details.vue"
import Error from "../views/Error.vue"
import store from "../store"

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
    component: () => import('../views/About.vue'),
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
    path: '/admin/:url',
    name: 'Admin',
    component: () => import('../views/Admin.vue'),
  },
  {
    path: '/update-user/:id',
    name: 'UpdateUser',
    component: () => import('../views/UpdateUser.vue'),
  },
  {
    path: '/update-post/:id',
    name: 'UpdatePost',
    component: () => import('../views/updatePost.vue'),
  },
  {
    path: '/create-post',
    name: 'CreatePost',
    component: () => import('../components/CreatePost.vue'),
  },
  {
    path: '/search/:slug',
    name: "Search",
    component: () => import('../views/Search.vue')
  },
  {
    path: '/404',
    component: Error
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

router.beforeEach((to, from, next) => { 
  // console.log('to', to)
  // console.log('to.path ', to.path.match == "/admin/:url")
  // console.log('store', store.state.isAuth)
  if(to.name == "Admin" ) {
    if(store.state.isAuth && store.state.isRole === 0 || store.state.isRole === 1){
      return next()
    }
    else {
      next({path: "/"})
    }
  }
  
  if(to.name == "UpdatePost" ||  to.name == "CreatePost") {
    if(store.state.isAuth && [0,1,2].indexOf(store.state.isRole) >= 0) {
      return next()
    }else {
      next({path: "/"})
    }
  }

  if(to.name == "UpdateUser") {
    if(store.state.isAuth) {
      return next()
    }else {
      next({path: "/"})
    }
  }
  next()
})

export default router
