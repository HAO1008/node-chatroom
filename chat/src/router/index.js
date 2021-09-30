import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Signup from '../views/Signup.vue'
import Search from '../views/Search.vue'
import Chatroom from '../views/Chatroom.vue'
import Logout from '../views/Logout.vue'
import Confirm from '../views/Confirm.vue'
import Relogin from '../views/Relogin'

Vue.use(VueRouter)

const routes = [
  {
    path: '/home',
    name: 'Home',
    component: Home
  },
  {
    path: '/search',
    name: 'Search',
    component: Search
  },
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/signup',
    name: 'Signup',
    component: Signup
  },
  {
    path: '/chatroom/:router_id',
    props:true,
    name: 'Chatroom',
    component: Chatroom
  },
  {
    path:'/logout',
    name:'Logout',
    component: Logout
  },
  {
    path:'/confirm',
    name:'Confirm',
    component: Confirm
  },
  {
    path:'/relogin',
    name:'Relogin',
    component:Relogin
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router