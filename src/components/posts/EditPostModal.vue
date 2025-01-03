<template>
    <div
      v-if="isVisible"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
    >
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 w-96 shadow-lg">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white">
          Edit Post
        </h3>
        <textarea
          v-model="postContent"
          rows="4"
          class="w-full mt-4 p-2 border rounded dark:bg-gray-700 dark:text-white"
        ></textarea>
        <div class="flex justify-end mt-4 space-x-2">
          <button
            class="px-4 py-2 text-gray-700 dark:text-white bg-gray-200 dark:bg-gray-600 rounded hover:bg-gray-300 dark:hover:bg-gray-700"
            @click="$emit('cancel')"
          >
            Cancel
          </button>
          <button
            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            @click="savePost"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "EditPostModal",
    props: {
      isVisible: {
        type: Boolean,
        required: true,
      },
      postContent: {
        type: String,
        default: "",
      },
    },
    emits: ["save", "cancel"],
    methods: {
      savePost() {
        this.$emit("save", this.postContent);
      },
    },
  };
  </script>
  