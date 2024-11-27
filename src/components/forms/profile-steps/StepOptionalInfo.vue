<template>
  <div class="w-full max-w-md mx-auto">
    <h2 class="text-2xl font-bold text-gray-800 dark:text-white text-center mb-6">Optional information</h2>
    <form class="space-y-6">
      <div>
        <label for="goals" class="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">
          Add learning goal
        </label>
        <textarea
          id="goals"
          v-model="localData.goal"
          rows="4"
          class="block w-full p-2.5 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-500 
          focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white 
          dark:focus:ring-primary-500 dark:focus:border-primary-500 max-h-40 resize-y"
          placeholder="Specify your goals"
        ></textarea>
        <p v-if="errors.title" class="text-red-600 text-m mt-1 ml-2">{{ errors.title }}</p>
      </div>

      <div class="flex items-center justify-between space-x-4">
        <button
          class="px-5 py-2 text-sm font-medium text-gray-800 dark:text-white bg-gray-200 dark:bg-gray-700 rounded-lg 
                 hover:bg-gray-300 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-gray-700 
                 dark:hover:bg-gray-600 dark:focus:ring-gray-800"
          @click="previousStep"
        >
          Previous
        </button>
        <button
          type="submit"
          class="px-5 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 focus:outline-none 
          focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
          @click="onSubmit"
        >
        {{ localData.goal.length === 0 ? 'Skip' : 'Next' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { createAxiosInstance } from '@/services/axiosInstance';
import { handleError } from '@/services/errorHandler';

export default {
  emits: ['submit', 'previous'],
  data() {
    return {
      localData: { goal:'' },
      errors: [],
    };
  },
  methods: {
    async onSubmit() {
      if (!this.localData.goal) {
        console.error("Цель пустая.");
        return;
      }

      const axiosInstance = createAxiosInstance(8084);
      const accessToken = localStorage.getItem('accessToken');

      try {
        const payload = {
          title: this.localData.goal,
        };

        const response = await axiosInstance.post('/users/profile/goals', payload, {
          headers: { 
            Authorization: `Bearer ${accessToken}` 
          },
        });

        if (response.status === 200) {
          console.log('Profile data submitted successfully:', response.data);
          this.$router.push('/');
        }
      } catch (error) {
        this.errors = handleError(error.response?.data || {});
      }
    },
    previousStep() {
      this.$emit('previous');
    },
  },
};
</script>
