import { createRouter, createWebHistory } from 'vue-router'
import Login from '../components/Auth/SignIn.vue'
// import Dashboard from '../views/Dashboard.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  // history: createWebHistory('/back_office/'),
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login,
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: () => import('@/layouts/main-layout/MainLayout.vue'),
      meta : {
        requiresAuth: true
      },
      children: [
        {
          path: "/dashboard",
          name: "dashboard",
          component: () => import("@/views/Dashboard.vue"),
          meta: {
            pageTitle: "Dashboard",
            breadcrumbs: ["Dashboards"],
          },
        },
        {
          path: "/add-smartphone",
          name: "add-smartphone",
          component: () => import("@/views/apps/AddPhone/AddPhone.vue"),
          meta: {
            pageTitle: "Add Smartphone",
            breadcrumbs: ["Apps", "Add Smartphone"],
          }
        },
        {
          path: "/cpu-manage",
          name: "cpu-manage",
          component: () => import("@/views/apps/customers/CustomersListing.vue"),
          meta: {
            pageTitle: "CPU Manage",
            breadcrumbs: ["Apps", "Cpu Manage"],
          },
        },
        {
          path: "/rate-manage",
          name: "rate-manage",
          component: () => import("@/views/apps/rate/WeightList.vue"),
          meta: {
            pageTitle: "Rate Manage",
            breadcrumbs: ["Apps", "Rate Manage"],
          },
        }
      ]
    },
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
