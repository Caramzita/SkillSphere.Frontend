<template>
  <div class="min-h-screen flex flex-col dark:bg-gray-800">
    <AppHeader />
    <div class="profile-page container mx-auto px-4 py-8">
      <div v-if="loading" class="text-center">
        <p class="text-lg font-medium text-gray-500">Loading...</p>
      </div>
      <div v-else class="bg-white rounded-lg shadow-md p-6 dark:bg-gray-800">
        <!-- Контейнер для разделения на 2 колонки -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- Левая колонка: Основная информация -->
          <div class="space-y-6">
            <!-- Аватар и основная информация -->
            <div class="flex items-center gap-6">
              <img
                :src="userProfile.profilePictureUrl || defaultAvatar"
                alt="Profile Picture"
                class="rounded-full w-32 h-32 border-2 border-primary-600 object-cover"
              />
              <div>
                <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
                  {{ userProfile.name }}
                </h1>
                <p class="mt-1 text-gray-600 dark:text-gray-400">
                  {{ userProfile.bio }}
                </p>
              </div>
            </div>
            <!-- Список навыков -->
            <div>
              <h2 class="text-xl font-bold text-gray-900 dark:text-white">
                Skills
              </h2>
              <div class="mt-2 flex flex-wrap gap-2">
                <span
                  v-for="skill in userProfile.skills"
                  :key="skill.id"
                  class="px-3 py-1 bg-primary-100 dark:bg-primary-700 text-primary-700 dark:text-white text-sm rounded-full"
                >
                  {{ skill.skillName }}
                </span>
              </div>
            </div>
            <!-- Список целей -->
            <GoalsSection :initialGoals="userProfile.goals" />
            <!-- Кнопка редактирования -->
            <div v-if="isCurrentUser">
              <button
                @click="showModal = true"
                class="px-4 py-2 text-white bg-primary-600 hover:bg-primary-700 rounded-lg"
              >
                Edit Profile
              </button>
            </div>
          </div>
          <!-- Правая колонка: История обучения -->
          <div class="overflow-y-auto">
            <LearningHistorySection :initialHistory="userProfile.learningHistories" />
          </div>
        </div>
      </div>
    </div>
    <EditProfileModal
      v-if="showModal"
      :visible="showModal"
      :editedProfile="userProfile"
      :errors="errors"
      @close="showModal = false"
      @save="saveProfile"
    />
  </div>
</template>

  
<script>
import { createAxiosInstance } from "@/services/axiosInstance";
import AppHeader from "./AppHeader.vue";
import EditProfileModal from "./EditProfileModal.vue";
import { mapGetters } from 'vuex';
import { handleError } from '@/services/errorHandler';
import GoalsSection from "./GoalsSection.vue";
import LearningHistorySection from "./LearningHistorySection.vue";

export default {
  components: {
    AppHeader,
    EditProfileModal,
    GoalsSection,
    LearningHistorySection
  },
  props: ["userId"],
  data() {
    return {
      userProfile: null,
      loading: true,
      isCurrentUser: false,
      showModal: false,
      defaultAvatar: 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y',
      errors: [],
    };
  },
  computed: {
    ...mapGetters(['currentUser']),
    goalStatus() {
    return {
      NotStarted: {
        text: "Not started yet",
        progress: "0%",
        progressClass: "bg-gray-400",
        iconClass: "text-gray-500",
        icon: {
          template: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>`,
        },
      },
      InProgress: {
        text: "Work in progress",
        progress: "50%",
        progressClass: "bg-primary-600",
        iconClass: "text-primary-600",
        icon: {
          template: `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" class="text-gray-300" />
                      <path fill="currentColor" d="M10 8v8l6-4-6-4z" />
                    </svg>`,
        },
      },
      Completed: {
        text: "Completed",
        progress: "100%",
        progressClass: "bg-green-500",
        iconClass: "text-green-500",
        icon: {
          template: `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M10 17.5l-5-5 1.41-1.41L10 14.67l7.59-7.59L19 8l-9 9z" />
                    </svg>`,
        },
      },
    };
  },
  },
  methods: {
    async fetchUserProfile() {
      const axiosInstance = createAxiosInstance(8084);
      const accessToken = localStorage.getItem("accessToken");

      try {
        const response = await axiosInstance.get(
          `/users/profile/${this.userId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        this.userProfile = response.data;

        this.checkIfCurrentUser();
      } catch (error) {
        console.error("Ошибка загрузки профиля:", error);
      } finally {
        this.loading = false;
      }
    },
    checkIfCurrentUser() {
      if (this.currentUser && this.userProfile) {
        this.isCurrentUser = this.currentUser.userId === this.userProfile.userId;
      } else {
        this.isCurrentUser = false;
      }
    },
    async saveProfile(updatedProfile) {
      const axiosInstance = createAxiosInstance(8084);
      const accessToken = localStorage.getItem("accessToken");

      try {
        const response = await axiosInstance.patch(
          `/users/profile`, updatedProfile,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (response.status === 200){
          this.userProfile = updatedProfile;
          this.userProfile.profilePictureUrl = response.data.profilePictureUrl;
          await this.$store.dispatch('fetchCurrentUser');
          this.showModal = false;
        }
      } catch (error) {
        this.errors = handleError(error.response?.data || {});
        console.error("Ошибка обновления профиля:", error);
      }
    },
    formatDate(dateString) {
      const options = { year: "numeric", month: "long", day: "numeric" };
      return new Intl.DateTimeFormat("en-GB", options).format(new Date(dateString));
    },
  },
  mounted() {
    this.fetchUserProfile();
  },
  watch: {
    userId: {
      immediate: false,
      handler(newId, oldId) {
        if (newId !== oldId) {
          this.fetchUserProfile();
        }
      },
    },
  },
};
</script>