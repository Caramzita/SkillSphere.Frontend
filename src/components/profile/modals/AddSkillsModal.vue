<template>
    <div
    v-if="visible"
    class="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50"
  >
    <div class="relative bg-white rounded-lg shadow dark:bg-gray-700 w-11/12 max-w-lg">
      <div class="flex items-center justify-between p-4 border-b dark:border-gray-600 md:p-5">
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
          Add Skills
        </h3>
        <button
          @click="$emit('close')"
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
        <div v-for="category in categories" :key="category.id" class="mb-8">
            <h3 class="text-lg font-semibold mb-2 ml-1 dark:text-white">{{ category.name }}</h3>

            <div class="border-b border-gray-300 mb-4"></div>

            <div class="flex flex-wrap gap-4">
            <button
                v-for="skill in category.skills"
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
        </div>
        <div class="flex justify-end space-x-2">
          <button
            type="submit"
            @click.prevent="saveSkills"
            class="px-4 py-2 text-white bg-primary-600 hover:bg-primary-700 rounded"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script>
import { loadCategoriesAndSkills } from '@/services/profileService';

export default {
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      categories: [],
      selectedSkills: [],
      errors: []
    };
  },
  async mounted() {
    this.categories = await loadCategoriesAndSkills();
  },
  methods: {
    toggleSkill(skill) {
      if (this.selectedSkills.includes(skill.id)) {
        this.selectedSkills = this.selectedSkills.filter((id) => id !== skill.id);
      } else {
        this.selectedSkills.push(skill.id);
      }    
    },
    saveSkills() {
      if (!this.selectedSkills.length) {
          this.$emit('close');
          return;
      }

      this.$emit("save", this.selectedSkills);
      this.selectedSkills = [];
    },
  },
};
</script>