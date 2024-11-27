<template>
  <div class="flex-col justify-center text-gray-800 dark:text-white">
    <h2 class="text-2xl font-bold mb-6 text-center">Select your Skills</h2>
    <div class="p-5">
      <div v-for="category in categories" :key="category.id" class="mb-8">
        <h3 class="text-lg font-semibold mb-2 ml-1">{{ category.name }}</h3>

        <div class="border-b border-gray-300 mb-4"></div>

        <div class="flex flex-wrap gap-4">
          <button
            v-for="skill in category.skills"
            :key="skill.id"
            @click="toggleSkill(skill)"
            :class="{
              'bg-blue-600 text-white': selectedSkills.includes(skill.id),
              'bg-gray-200 dark:bg-gray-700 dark:text-gray-100': !selectedSkills.includes(skill.id),
            }"
            class="px-4 py-2 rounded-full text-sm font-medium transition duration-200 ease-in-out hover:bg-blue-500 hover:text-white"
          >
            {{ skill.name }}
          </button>
        </div>
      </div>
      <div v-if="categories.length === 0" class="text-center text-gray-400">There are no categories available.</div>
      <div v-if="errors.general" class="text-red-600 text-m ml-2" style="margin-top: 10px;">
        <p v-for="error in errors.general" :key="error">{{ error }}</p>
      </div>

      <div class="flex justify-between mt-6">
        <button
          class="px-5 py-2 text-sm font-medium text-gray-800 dark:text-white bg-gray-200 dark:bg-gray-700 rounded-lg 
                 hover:bg-gray-300 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-gray-700 
                 dark:hover:bg-gray-600 dark:focus:ring-gray-800"
          @click="previousStep"
        >
          Previous
        </button>
        <button
          class="px-5 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 
                 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 
                 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
          @click.prevent="onSubmit"
          @click="goNext"
        >
          {{ selectedSkills.length === 0 ? 'Skip' : 'Next' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { createAxiosInstance } from '@/services/axiosInstance';
import { handleError } from '@/services/errorHandler';

export default {
  emits: ["next", "previous"],
  data() {
    return {
      categories: [],
      selectedSkills: [],
      errors: [],
    };
  },
  async mounted() {
    await this.loadCategoriesAndSkills();
  },
  methods: {
    async onSubmit() {
      if (!this.selectedSkills.length) {
        console.error("Навыки не выбраны.");
        return;
      }

      const axiosInstance = createAxiosInstance(8084);
      const accessToken = localStorage.getItem('accessToken');

      try {
        const payload = {
          skillIds: this.selectedSkills,
        };

        const response = await axiosInstance.post('/users/profile/skills', payload, {
          headers: { 
            Authorization: `Bearer ${accessToken}` 
          },
        });

        if (response.status === 200) {
          console.log('Profile data submitted successfully:', response.data);
          this.goNext();
        }
      } catch (error) {
        this.errors = handleError(error.response?.data || {});
      }
    },
    async loadCategoriesAndSkills() {
      const axiosInstance = createAxiosInstance(8084);

      try {
        const response = await axiosInstance.get("/categories");
        this.categories = response.data.map((category) => ({
          ...category,
          skills: category.skills || [],
        }));
      } catch (error) {
        console.error("Ошибка загрузки категорий и навыков:", error);
      }
    },
    toggleSkill(skill) {
      if (this.selectedSkills.includes(skill.id)) {
        this.selectedSkills = this.selectedSkills.filter((id) => id !== skill.id);
      } else {
        this.selectedSkills.push(skill.id);
      }
    },
    goNext() {
      console.log("Выбранные навыки:", this.selectedSkills);
      this.$emit("next");
    },
    previousStep() {
      this.$emit("previous");
    },
  },
};
</script>
