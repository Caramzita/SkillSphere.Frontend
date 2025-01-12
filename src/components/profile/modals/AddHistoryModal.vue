<template>
    <div
        v-if="visible"
        class="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50"
    >
        <div class="relative bg-white rounded-lg shadow dark:bg-gray-700 w-11/12 max-w-lg">
          <div class="flex items-center justify-between p-4 border-b dark:border-gray-600 md:p-5">
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                Add History
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
            <form>
              <div class="mb-4">
                  <label
                  for="title"
                  class="ml-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                  Title
                  </label>
                  <input
                  v-model="newHistory.courseTitle"
                  type="text"
                  id="title"
                  class="mt-1 block w-full p-2 border rounded dark:bg-gray-600 dark:text-white"
                  required
                  />
                  <p v-if="errors.coursetitle" class="text-red-600 text-m mt-1 ml-2">{{ errors.coursetitle }}</p>
              </div>

              <div class="mb-4">
                  <label
                  for="description"
                  class="ml-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                  Description
                  </label>
                  <input
                  v-model="newHistory.description"
                  type="text"
                  id="title"
                  class="mt-1 block w-full p-2 border rounded dark:bg-gray-600 dark:text-white"
                  />
                  <p v-if="errors.description" class="text-red-600 text-m mt-1 ml-2">{{ errors.description }}</p>
              </div>

              <div class="mb-4">
                <label for="date" class="ml-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Completed Date</label>
                <input
                  v-model="formattedDate"
                  type="date"
                  id="date"
                  class="mt-1 block w-full p-2 border rounded dark:bg-gray-600 dark:text-white"
                  required
                />
                <p v-if="errors.completedDate" class="text-red-600 text-m mt-1 ml-2">{{ errors.completeddate }}</p>
              </div>

              <div v-if="errors.general" class="text-red-600 text-m ml-2" style="margin-top: 10px;">
                  <p v-for="error in errors.general" :key="error">{{ error }}</p>
              </div>
              <div class="flex justify-end space-x-2">
                  <button
                  type="submit"
                  @click.prevent="saveHistory"
                  class="px-4 py-2 text-white bg-primary-600 hover:bg-primary-700 rounded"
                  >
                  Add
                  </button>
              </div>
            </form>
          </div>
      </div>
    </div>
</template>

<script>
import { trimAndFormatContent } from '@/services/textFormatter';

export default {
  props: {
    visible: {
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
      newHistory: { 
        courseTitle: '',
        description: '',
        completedDate: ''
       },
    };
  },
  methods: {
    saveHistory() {
      this.newHistory.courseTitle = trimAndFormatContent(this.newHistory.courseTitle);
      this.newHistory.description = trimAndFormatContent(this.newHistory.description);

      this.$emit("save", this.newHistory);
      this.newHistory = { courseTitle: '', description: '', completedDate: '' };
    },
  },
  computed: {
    formattedDate: {
      get() {
        if (this.newHistory.completedDate) {
          const date = new Date(this.newHistory.completedDate);
          return date.toISOString().split('T')[0];
        }
        return '';
      },
      set(newValue) {
        const date = new Date(newValue);
        this.newHistory.completedDate = date.toISOString();
      },
    },
  },
};
</script>