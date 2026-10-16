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
    {
      path: '/weights',
      component: () => import('../views/WeightsView.vue'),
      meta: { title: 'Weights' },
    },
    { path: '/goal', component: () => import('../views/GoalView.vue'), meta: { title: 'Goal' } },
    {
      path: '/:pathMatch(.*)*',
      component: () => import('../views/NotFoundView.vue'),
      meta: { title: 'Not found' },
    },
  ],
})

router.beforeEach((to) => {
  if (!token.value && !to.meta.public) {
    return { path: '/login', query: { redirect: to.fullPath } }
  }
  if (token.value && to.meta.public) return '/weights'
})

router.afterEach((to) => {
  document.title = to.meta.title ? `${to.meta.title} · Balance Log` : 'Balance Log'
})

export default router
