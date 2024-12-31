<template>
  <router-link
    v-if="linkToProfile && user"
    :to="`/profile/${user.userId}`"
    class="flex items-center gap-4 transition-colors duration-200 relative hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
  >
    <img
      :src="user.profilePictureUrl || defaultAvatar"
      alt="User avatar"
      class="w-10 h-10 rounded-full object-cover"
    />
    <div>
      <div class="font-medium dark:text-white">
        {{ user.name || 'No Name' }}
      </div>
      <div class="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[200px]">
        {{ (user.bio || 'No bio available').slice(0, 25) + (user.bio && user.bio.length > 20 ? '...' : '') }}
      </div>
    </div>
  </router-link>

  <div v-else-if="user" class="flex items-center gap-4">
    <img
      :src="user.profilePictureUrl || defaultAvatar"
      alt="User avatar"
      class="w-10 h-10 rounded-full object-cover"
    />
    <div>
      <div class="font-medium dark:text-white">
        {{ user.name || 'No Name' }}
      </div>
      <div class="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[200px]">
        {{ (user.bio || 'No bio available').slice(0, 25) + (user.bio && user.bio.length > 20 ? '...' : '') }}
      </div>
    </div>
  </div>

  <div v-else class="flex items-center gap-4 animate-pulse">
    <div class="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700"></div>
    <div class="flex-1 space-y-2">
      <div class="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
      <div class="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
    </div>
  </div>
</template>

<script>
import { createAxiosInstance } from '@/services/axiosInstance';

export default {
  name: 'UserCard',
  props: {
    userId: {
      type: String,
      required: true,
    },
    linkToProfile: {
      type: Boolean,
      default: true,
    },
    defaultAvatar: {
      type: String,
      default:
        'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y',
    },
  },
  data() {
    return {
      user: null,
      loading: true,
      error: null,
    };
  },
  async created() {
    await this.fetchUser();
  },
  methods: {
    async fetchUser() {
      const axiosInstance = createAxiosInstance(8084);

      try {
        const response = await axiosInstance.get(`/users/profile/${this.userId}`);
        if (response.status === 200) {
          this.user = {
            userId: response.data.userId || '',
            name: response.data.name || '',
            profilePictureUrl: response.data.profilePictureUrl || '',
            bio: response.data.bio || '',
          };
        }
      } catch (error) {
        console.error('Ошибка загрузки данных пользователя:', error);
        this.error = 'Не удалось загрузить данные пользователя';
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>