import { createRouter, createWebHistory } from 'vue-router'
import Login from '../components/Auth/SignIn.vue'
import Dashboard from '../components/Dashboard.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  // history: createWebHistory('/back_office/'),
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login,
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: Dashboard,
      meta : {
        requiresAuth: true
      }
    }
  ],
})

// Navigation guard for protected routes
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('authToken'); // Check if token exists
  if (to.matched.some((record) => record.meta.requiresAuth) && !isAuthenticated) {
      next('/'); // Redirect to login if not authenticated
  } else {
      next();
  }
});

export default router
