<template>
  <div class="h-screen flex flex-col">
    <header class="sticky top-0 z-40 flex-none w-full bg-white border-b border-gray-200 dark:border-gray-600 dark:bg-gray-800 h-16">
      <div class="flex items-center justify-between w-full px-3 py-3 mx-auto max-w-8xl lg:px-4">
        <div class="flex items-center justify-between">
          <span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">SkillSphere</span>
        </div>
        <div class="flex items-center">
          <div class="flex items-center gap-4">
            <img class="w-10 h-10 rounded-full object-cover object-center" :src="userProfile.profilePictureUrl" alt="Аватар пользователя">
            <div class="font-medium dark:text-white">
              <div>{{ userProfile.name || "Unknown User" }}</div>
              <div class="text-sm text-gray-500 dark:text-gray-400">{{ userProfile.bio || "Unknown User" }}</div>
            </div>
          </div>
          <button
            class="px-5 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 
                   focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 
                   dark:hover:bg-primary-700 dark:focus:ring-primary-800 ml-10" 
            @click="logout"
          >
            Выйти
          </button>
        </div>
      </div>
    </header>

    <div class="flex flex-1 overflow-hidden bg-white border-gray-200 dark:border-gray-600 dark:bg-gray-800">
      <main class="flex-1 overflow-y-auto p-4">
        <h1 class="text-2xl font-bold dark:text-white">Welcome to SkillSphere</h1>
        <p class="mt-4 text-gray-700 dark:text-gray-300">
          Here is your main content area.
        </p>
      </main>

      <aside
        id="sidebar"
        class="flex-none w-[calc(18rem-20px)] bg-white dark:bg-gray-900 overflow-y-auto border-l border-gray-200 dark:border-gray-600"
      >
        <nav class="pt-5 px-1 pl-3 lg:pl-4 lg:pt-2 font-normal text-base lg:text-sm pb-10 lg:pb-20">
          <ul class="mb-0 list-none">
            <li class="mt-2">
              <h5 class="mb-2 pl-3 text-sm tracking-wide text-gray-900 uppercase lg:text-xs dark:text-white">
                Users List
              </h5>
              <ul class="py-1 list-none">
                <li
                  v-for="user in userProfiles"
                  :key="user.id"
                  class="flex items-center gap-4 py-2 px-3 transition-colors duration-200 relative hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                >
                  <img
                    :src="user.profilePictureUrl || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'"
                    alt="User avatar"
                    class="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <div class="font-medium dark:text-white">
                      {{ user.name || 'No Name' }}
                    </div>
                    <div class="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[200px]">
                      {{ user.bio || 'No bio available' }}
                    </div>
                  </div>
                </li>
              </ul>
            </li>
          </ul>
        </nav>
      </aside>
    </div>
  </div>
</template>
  
<script>
import { createAxiosInstance } from '@/services/axiosInstance';
import { handleError } from '@/services/errorHandler';

export default {
  data() {
    return{
      userProfile: {
        userId: '',
        name: '', 
        profilePictureUrl: '', 
        bio: '',
      },
      userProfiles: [],
      errors: [],
    }
  },
  async mounted() {
    await this.GetYourProfile();
    await this.GetAllProfiles();
  },
  methods: {
    logout() {
      localStorage.clear();
      if (this.$route.name !== 'Auth') {
        this.$router.push('/auth');
      }
    },
    async GetYourProfile() {
      const axiosInstance = createAxiosInstance(8084);
      const accessToken = localStorage.getItem('accessToken');

      try {
        const response = await axiosInstance.get('/users/profile', {
          headers: { 
            Authorization: `Bearer ${accessToken}` 
          },
        });

        if (response.status === 200) {
          console.log('Profile data submitted successfully:', response.data);
          const { userId, name, profilePictureUrl, bio } = response.data;

          this.userProfile = {
            userId: userId || '',
            name: name || '',
            profilePictureUrl: profilePictureUrl || '',
            bio: bio || '',
          };
        }
      } catch (error) {
        console.error('Ошибка получения профиля:', error);
        this.errors = handleError(error.response?.data || {});
      }
    },
    async GetAllProfiles() {
      const axiosInstance = createAxiosInstance(8084);

      try {
        const response = await axiosInstance.get('/users/profiles');

        if (response.status === 200) {
          this.userProfiles = response.data
          .map((profile) => ({
            id: profile.id || '',
            userId: profile.userId || '',
            name: profile.name || '',
            profilePictureUrl: profile.profilePictureUrl || '',
            bio: profile.bio || '',
          }))
          .filter((profile) => profile.userId !== this.userProfile.userId);

          console.log('Mapped profiles:', this.userProfiles);
        }
      } catch (error) {
        console.error('Ошибка получения профилей:', error);
        this.errors = handleError(error.response?.data || {});
      }
    },
  },
};
</script>