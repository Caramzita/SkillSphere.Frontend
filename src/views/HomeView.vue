<template>
  <div class="h-screen flex flex-col">
    <AppHeader />

    <div class="flex flex-1 overflow-hidden bg-white border-gray-200 dark:border-gray-600 dark:bg-gray-800">
      <main class="flex-1 overflow-y-auto p-4">
        <PostSection />
      </main> 
      <aside
        id="sidebar"
        class="flex-none w-[calc(18rem-45px)] bg-white dark:bg-gray-900 overflow-y-auto border-l border-gray-200 dark:border-gray-600"
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
                  <UserCard :userId="user.userId" />
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
import UserCard from '@/components/profile/UserCard.vue';
import AppHeader from '@/components/AppHeader.vue';
import PostSection from '@/components/posts/PostSection.vue';
import { mapGetters } from 'vuex';

export default {
  components: {
    UserCard,
    AppHeader,
    PostSection,
  },
  computed: {
    ...mapGetters(['currentUser']),
  },
  data() {
    return{
      userProfiles: [],
      errors: [],
      posts: [],
      loading: true,
      showModal: false,
    }
  },
  async mounted() {
    await this.GetAllProfiles();
  },
  methods: {
    logout() {
      localStorage.clear();
      this.$store.commit('setUser', null);
      
      if (this.$route.name !== 'Auth') {
        this.$router.push('/auth');
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
          .filter((profile) => profile.userId !== this.currentUser.userId);
        }
      } catch (error) {
        console.error('Ошибка получения профилей:', error);
        this.errors = handleError(error.response?.data || {});
      }
    },
  },
};
</script>