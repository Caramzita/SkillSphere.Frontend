import { createRouter, createWebHistory } from 'vue-router';
import AuthPage from '@/components/AuthPage.vue';
import HomePage from '@/components/HomePage.vue';
import ProfileSetup from '@/components/ProfileSetup.vue';
import { checkProfileExistence } from '@/services/profileService';
import { refreshTokens } from '@/services/authService';

const routes = [
  { path: '/', name: 'Home', component: HomePage },
  { path: '/auth', name: 'Auth', component: AuthPage },
  { path: '/profile-setup', name: 'ProfileSetup', component: ProfileSetup },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');
  
  if (!accessToken && !refreshToken) {
    if (to.name !== 'Auth') {
      return next({ name: 'Auth' });
    }
    return next();
  }

  if (!accessToken) {
    try {
      await refreshTokens();
    } catch {
      return next({ name: 'Auth' });
    }
  }

  try {
    const profileCheck = await checkProfileExistence();

    if (profileCheck.data) {
      switch (to.name) {
        case 'Auth':
          return next(profileCheck ? { name: 'Home' } : undefined);
        case 'ProfileSetup':
          return next(profileCheck ? { name: 'Home' } : undefined);
        case 'Home':
          return next(profileCheck ? undefined : { name: 'ProfileSetup' });   
        default:
          next();
      }
    } else {
      if (to.name !== 'ProfileSetup') {
        return next({ name: 'ProfileSetup' });
      }
      next();
    }
  } catch (error) {
    if (error.message === 'Unauthorized') {
      console.warn('Session expired, redirecting to login.');
    } else {
      console.error('Error during route guard:', error.message);
    }
    return next({ name: 'Auth' });
  }
});

export default router;