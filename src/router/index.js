import { createRouter, createWebHistory } from 'vue-router';
import AuthPage from '@/components/AuthPage.vue';
import HomePage from '@/components/HomePage.vue';
import ProfileSetup from '@/components/ProfileSetup.vue';
import { refreshTokens } from '@/services/authService';
import ProfileView from '@/components/ProfileView.vue';
import store from '@/store/store';

const routes = [
  { path: '/', name: 'Home', component: HomePage },
  { path: '/profile/:userId', name: 'Profile', component: ProfileView, props: true,},
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
    return to.name === 'Auth' ? next() : next({ name: 'Auth' });
  }

  if (!accessToken) {
    try {
      await refreshTokens();
    } catch {
      console.warn('Unable to refresh tokens, redirecting to Auth.');
      return next({ name: 'Auth' });
    }
  }

  try {
    if (!store.getters.currentUser) {
      await store.dispatch('fetchCurrentUser');
    }

    const currentUser = store.getters.currentUser;
    console.log('Data', currentUser);

    if (currentUser != null) {
      switch (to.name) {
        case 'Auth':
          return next(currentUser  ? { name: 'Home' } : undefined);
        case 'ProfileSetup':
          return next(currentUser  ? { name: 'Home' } : undefined);
        case 'Home':
          return next(currentUser  ? undefined : { name: 'ProfileSetup' });   
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