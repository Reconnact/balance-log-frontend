import { createRouter, createWebHistory } from 'vue-router'
import { token } from '@/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/login', component: () => import('../views/LoginView.vue'), meta: { public: true } },
    {
      path: '/register',
      component: () => import('../views/RegisterView.vue'),
      meta: { public: true },
    },
    { path: '/', redirect: '/weights' },
    { path: '/weights', component: () => import('../views/WeightsView.vue') },
    { path: '/goal', component: () => import('../views/GoalView.vue') },
  ],
})

router.beforeEach((to) => {
  if (!token.value && !to.meta.public) {
    return { path: '/login', query: { redirect: to.fullPath } }
  }
})

export default router
