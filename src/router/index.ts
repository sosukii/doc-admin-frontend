import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: { public: true },
    },
    {
      path: '/',
      component: () => import('../views/LayoutView.vue'),
      children: [
        {
          path: '',
          redirect: '/visibility',
        },
        {
          path: 'visibility',
          name: 'visibility',
          component: () => import('../views/VisibilityView.vue'),
        },
        {
          path: 'contacts',
          name: 'contacts',
          component: () => import('../views/ContactsView.vue'),
        },
        {
          path: 'system',
          name: 'system',
          component: () => import('../views/SystemView.vue'),
        },
      ],
    },
  ],
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (!to.meta.public && !auth.isAuthenticated()) {
    return { name: 'login' }
  }
  if (to.name === 'login' && auth.isAuthenticated()) {
    return { name: 'visibility' }
  }
})

export default router
