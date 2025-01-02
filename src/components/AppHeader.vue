<template>
  <header class="sticky top-0 z-40 flex-none w-full bg-white border-b border-gray-200 dark:border-gray-600 dark:bg-gray-800 h-16">
    <div class="flex items-center justify-between w-full px-3 py-3 mx-auto max-w-8xl lg:px-4">
      <div class="flex items-center justify-between">
        <router-link to="/" class="flex items-center self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
          <img src="@/assets/logo.png" alt="Logo" class="w-8 h-8 mr-2" />
          SkillSphere
        </router-link>
      </div>
      
      <div class="flex items-center">
        <div class="flex items-center gap-4 " v-if="currentUser">
          <UserCard :userId="currentUser.userId" />
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
</template>
  
  <script>
  import UserCard from './profile/UserCard.vue';
  import { mapGetters } from 'vuex';
  
  export default {
    name: "AppHeader",
    components: { UserCard },
    computed: {
      ...mapGetters(['currentUser']),
    },
    methods: {
      async logout() {
        await this.$store.dispatch('logout');
        this.$router.push("/login");
      },
    },
  };
  </script>

  