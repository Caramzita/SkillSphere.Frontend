import { createStore } from 'vuex';
import { createAxiosInstance } from '@/services/axiosInstance';

export default createStore({
  state: {
    currentUser: null,
  },
  mutations: {
    setCurrentUser(state, user) {
      state.currentUser = user;
    },
    clearCurrentUser(state) {
      state.currentUser = null;
    }
  },
  actions: {
    async fetchCurrentUser({ commit }) {
      const axiosInstance = createAxiosInstance();
      const accessToken = localStorage.getItem('accessToken');

      try {
        const response = await axiosInstance.get('/users/profile', {
          headers: { 
            Authorization: `Bearer ${accessToken}` 
          },
        });

        commit('setCurrentUser', response.data);
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    },
    logout({ commit }) {
      commit('clearCurrentUser');
      localStorage.clear();
    }
  },
  getters: {
    currentUser: (state) => state.currentUser,
  },
});
