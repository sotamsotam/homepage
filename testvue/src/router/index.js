import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import store from '@/store';

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
    component: () => import('../views/BoardWrite.vue'),
    meta: { requireLogin: true }
  },
  {
    path: '/boardedit',
    name: 'BoardEdit',
    component: () => import('../views/BoardEdit.vue'),
    meta: { requireLogin: true }
  },
  {
    path: '/score',
    name: 'Score',
    component: () => import('../views/Score.vue'),
    meta: { requireLogin: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  }
]


const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
	console.log(to);
	if (to.meta.requireLogin) {
		const isLogin = store.getters['loginStore/isLogin'];
		if (!isLogin) {
			next('/login?returnUrl=' + to.fullPath);
		} else {
			next();
		}
	} else {
		next();
	}
});

export default router
