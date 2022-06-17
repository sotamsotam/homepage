import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/board',
    name: 'BoardList',
    component: () => import('../views/BoardList.vue')
  },
  {
    path: '/boardview',
    name: 'BoardView',
    component: () => import('../views/BoardView.vue')
  },
  {
    path: '/boardwrite',
    name: 'BoardWrite',
    component: () => import('../views/BoardWrite.vue')
  },
  {
    path: '/boardedit',
    name: 'BoardEdit',
    component: () => import('../views/BoardEdit.vue')
  },
  {
    path: '/score',
    name: 'Score',
    component: () => import('../views/Score.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
