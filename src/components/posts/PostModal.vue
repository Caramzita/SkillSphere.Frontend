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
            @click.prevent="closeModal"
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
          <div v-if="goals.length > 0">
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
          </div>
          

          <label class="block text-sm font-medium dark:text-gray-300 mb-2">
            Content
          </label>
          <textarea
            v-model="post.content"
            @blur="formatContent"
            rows="4"
            class="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white max-h-[350px] resize-y"
            placeholder="Write your post content..."
          ></textarea>
          <p v-if="errors.content" class="text-red-600 text-m pl-1">{{ errors.content }}</p>

          <div class="mt-2">
          <label class="inline-flex items-center">
            <input
              type="checkbox"
              v-model="post.isCompleteGoal"
              class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 
              dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <span class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Mark Goal as Complete</span>
          </label>
        </div>

          <label class="block text-sm font-medium dark:text-gray-300 mb-2 mt-3">
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
                class="px-4 py-1 rounded-full text-sm font-medium transition duration-200 ease-in-out hover:bg-blue-500 hover:text-white"
            >
                {{ skill.name }}
            </button>
          </div>

          <div class="flex justify-end gap-2 mt-4">
            <button
              type="button"
              class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              @click="submitPost"
            >
              Create
            </button>
          </div>
        </div>    
      </div>
    </div>
  </template>
  
<script>
import { loadGoals, loadSkills } from '@/services/profileService'; 
import { trimAndFormatContent } from '@/services/textFormatter';

export default {
  name: 'PostModal',
  props: {
    isVisible: {
      type: Boolean,
      required: true,
    },
    errors: {
      type: Object,
      default: () => ({})
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
        isCompleteGoal: false,
      }
    };
  },
  watch: {
    async isVisible(newVal) {
      if (newVal) {
        this.goals = await loadGoals();
        this.skills = await loadSkills();
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
      this.formatContent();

      this.$emit('submit', this.post);

      if (Object.keys(this.errors).length === 0) {
        this.resetForm();
      }
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
    toggleSkill(skill) {
      if (this.selectedSkills.includes(skill.id)) {
        this.selectedSkills = this.selectedSkills.filter((id) => id !== skill.id);
      } else {
        this.selectedSkills.push(skill.id);
      }    
    },
    formatContent() {
      this.post.content = trimAndFormatContent(this.post.content);
    }
  },
};
</script>
  