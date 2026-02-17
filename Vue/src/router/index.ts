import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user';
import { access } from '@/api/auth';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../pages/HomePage.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../pages/AboutPage.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../pages/AdminPage.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../pages/LoginPage.vue'),
      meta: {
        requiresAuth: false,
        guestOnly: true
      }
    }
  ],
});

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore();

  // 1. Check if the user is "authenticated" via the token ref
  const isLoggedIn = !!access.value;

  // 2. If route requires auth and user isn't logged in -> Login
  if (to.meta.requiresAuth && !isLoggedIn) {
    return next({ name: 'login' });
  }

  // 3. If user is logged in and tries to go to Login page -> Home
  if (to.meta.guestOnly && isLoggedIn) {
    return next({ name: 'home' });
  }

  // 4. If logged in but no user profile data yet, fetch it
  if (isLoggedIn && !userStore.user) {
    try {
      await userStore.fetchUser();
    } catch (error) {
      // Profile fetch failed (e.g. invalid token), clear and boot to login
      userStore.logout();
      return next({ name: 'login' });
    }
  }

  next();
});

export default router
