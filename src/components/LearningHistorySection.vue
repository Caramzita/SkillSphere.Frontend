<template>
    <div class="learning-history-section">
      <h2 class="text-xl font-bold text-gray-900 dark:text-white">Learning History</h2>
      <ul class="mt-4 space-y-3">
        <li
          v-for="item in history"
          :key="item.id"
          class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm"
        >
          <p class="text-gray-800 dark:text-gray-200">
            <strong>{{ item.courseTitle }}</strong> - {{ formatDate(item.completedDate) }}
          </p>
          <p class="text-gray-600 dark:text-gray-400">{{ item.description }}</p>
        </li>
      </ul>
      <button
        @click="addHistory"
        class="mt-4 px-4 py-2 text-white bg-primary-600 hover:bg-primary-700 rounded-lg"
      >
        Add History
      </button>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      initialHistory: {
        type: Array,
        default: () => [],
      },
    },
    data() {
      return {
        history: [...this.initialHistory],
      };
    },
    methods: {
      formatDate(dateString) {
        const options = { year: "numeric", month: "long", day: "numeric" };
        return new Intl.DateTimeFormat("en-US", options).format(new Date(dateString));
      },
      addHistory() {
        const newHistory = {
          id: Date.now(),
          courseTitle: "New Course",
          completedDate: new Date().toISOString(),
          description: "Description of the new course.",
        };
        this.history.push(newHistory);
      },
    },
  };
  </script>
  