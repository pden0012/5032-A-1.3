import { createRouter, createWebHistory } from 'vue-router'
// import the views
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import AdminPanel from '../views/AdminPanel.vue'
import { authService } from '../services/auth'

// define routes
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
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
    path: '/admin',
    name: 'AdminPanel',
    component: AdminPanel,
    // route guard to protect admin page
    // 路由守卫保护管理员页面
    beforeEnter: (to, from, next) => {
      // check if user is authenticated and is admin
      // 检查用户是否已认证且是管理员
      if (authService.isLoggedIn() && authService.isAdmin()) {
        next()
      } else {
        // redirect to login if not authenticated or not admin
        // 如果未认证或不是管理员，重定向到登录页
        next('/login')
      }
    }
  }
]

// create router instance
const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
