<template>
    <div
      v-if="isVisible"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="relative bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-lg w-full">
        <div class="flex items-center justify-between p-4 border-b dark:border-gray-600 md:p-5">
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
              Create New Post
            </h3>
            <button
            @click.prevent="$emit('close')"
            class="text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
            <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
                ></path>
            </svg>
            </button>
        </div>

        <div class="p-4 md:p-5">
          <label class="block text-sm font-medium dark:text-gray-300 mb-2">
            Select a Goal
          </label>
          <select
            v-model="post.goalId"
            class="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white mb-4"
          >
            <option
              v-for="goal in goals"
              :key="goal.id"
              :value="goal.id"
            >
              {{ goal.title }}
            </option>
          </select>

          <label class="block text-sm font-medium dark:text-gray-300 mb-2">
            Content
          </label>
          <textarea
            v-model="post.content"
            rows="4"
            class="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
            placeholder="Write your post content..."
          ></textarea>

          <label class="block text-sm font-medium dark:text-gray-300 mb-2">
            Select Skills
          </label>
          <div class="mt-2 flex flex-wrap gap-2">
            <button
                v-for="skill in skills"
                :key="skill.id"
                @click="toggleSkill(skill)"
                :class="{
                'bg-blue-600 text-white': selectedSkills.includes(skill.id),
                'bg-gray-200 dark:bg-gray-600 dark:text-gray-100': !selectedSkills.includes(skill.id),
                }"
                class="px-4 py-2 rounded-full text-sm font-medium transition duration-200 ease-in-out hover:bg-blue-500 hover:text-white"
            >
                {{ skill.name }}
            </button>
          </div>

          <div class="flex justify-end gap-2 mt-4">
            <button
              type="button"
              class="px-4 py-2 bg-gray-300 rounded-lg dark:bg-gray-600"
              @click="closeModal"
            >
              Cancel
            </button>
            <button
              type="button"
              class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              @click="submitPost"
            >
              Submit
            </button>
          </div>
        </div>    
      </div>
    </div>
  </template>
  
<script>
import { createAxiosInstance } from '@/services/axiosInstance';

export default {
  name: 'PostModal',
  props: {
    isVisible: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      goals: [],
      skills: [],
      selectedSkills: [],
      post: {
        content: '',
        type: 'TextPost',
        goalId: null,
        skillIds: [],
      }
    };
  },
  watch: {
    isVisible(newVal) {
      if (newVal) {
        this.loadGoals();
        this.loadSkills();
      }
    },
  },
  methods: {
    closeModal() {
      this.$emit('close');
      this.resetForm();
    },
    submitPost() {
      this.post.skillIds = this.selectedSkills;
      this.$emit('submit', this.post);
      this.closeModal();
    },
    resetForm() {
      this.post = {
        content: '',
        type: 'TextPost',
        goalId: null,
        skillIds: [],
      };
      this.selectedSkills = [];
    },
    async loadGoals() {
      const axiosInstance = createAxiosInstance(8084);
      const accessToken = localStorage.getItem('accessToken');

      try {
        const response = await axiosInstance.get("/users/profile/goals", {
          headers: { 
            Authorization: `Bearer ${accessToken}` 
          },
        });

        console.log (response.data);
        
        this.goals = response.data.map((goal) => ({
          id: goal.id,
          title: goal.title,
        }));
      } catch (error) {
        console.error("Ошибка загрузки целей:", error);
        this.goals = [];
      }
    },
    async loadSkills() {
      const axiosInstance = createAxiosInstance(8084);
      const accessToken = localStorage.getItem('accessToken');

      try {
        const response = await axiosInstance.get("/users/profile/skills", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        this.skills = response.data.map((skill) => ({
          id: skill.skillId,
          name: skill.skillName,
        }));
      } catch (error) {
        console.error("Ошибка загрузки навыков:", error);
        this.skills = [];
      }
    },
    toggleSkill(skill) {
      if (this.selectedSkills.includes(skill.id)) {
        this.selectedSkills = this.selectedSkills.filter((id) => id !== skill.id);
      } else {
        this.selectedSkills.push(skill.id);
      }    
    },
  },
};
</script>
  