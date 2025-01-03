<template>
    <div
      v-if="isVisible"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
    >
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 w-80 shadow-lg">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white">
          {{ title }}
        </h3>
        <p class="text-sm text-gray-600 dark:text-gray-300 mt-2">
          {{ message }}
        </p>
        <div class="flex justify-end mt-4 space-x-2">
          <button
            class="px-4 py-2 text-gray-700 dark:text-white bg-gray-200 dark:bg-gray-600 rounded hover:bg-gray-300 dark:hover:bg-gray-700"
            @click="cancel"
          >
            Cancel
          </button>
          <button
            class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            @click="confirm"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "ConfirmModal",
    props: {
      isVisible: {
        type: Boolean,
        required: true,
      },
      title: {
        type: String,
        default: "Confirm Action",
      },
      message: {
        type: String,
        default: "Are you sure you want to proceed?",
      },
    },
    emits: ["confirm", "cancel"],
    methods: {
      confirm() {
        this.$emit("confirm");
      },
      cancel() {
        this.$emit("cancel");
      },
    },
  };
  </script>