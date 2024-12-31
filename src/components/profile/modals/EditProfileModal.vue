<template>
  <div
    v-if="visible"
    class="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50"
  >
    <div class="relative bg-white rounded-lg shadow dark:bg-gray-700 w-11/12 max-w-lg">
      <div class="flex items-center justify-between p-4 border-b dark:border-gray-600 md:p-5">
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
          Edit Profile
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
        <form>
          <div class="mb-4">
            <label
              for="name"
              class="ml-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Name
            </label>
            <input
              v-model="localProfile.name"
              type="text"
              id="name"
              class="mt-1 block w-full p-2 border rounded dark:bg-gray-600 dark:text-white"
            />
            <p v-if="errors.name" class="text-red-600 text-m mt-1 ml-2">{{ errors.name }}</p>
          </div>
          <div class="mb-4">
            <label
              for="bio"
              class="ml-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Bio
            </label>
            <textarea
              v-model="localProfile.bio"
              id="bio"
              rows="3"
              class="mt-1 block w-full p-2 border rounded dark:bg-gray-600 dark:text-white max-h-40 resize-y"
            ></textarea>
            <p v-if="errors.bio" class="text-red-600 text-m mt-1 ml-2">{{ errors.bio }}</p>         
          </div>
          <div class="mb-4">
              <label for="profilePicture" class="block mb-1 pl-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Avatar
              </label>
              <input
              @change="onFileChange"
              type="file"
              id="profilePicture"
              accept="image/*"
              class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg 
                      cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none 
                      dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
              />
              <p v-if="errors.profilepicture" class="text-red-600 text-m mt-1 ml-2">{{ errors.profilepicture }}</p>
              <div v-if="previewAvatar" class="mt-5">
              <img :src="previewAvatar" alt="Avatar Preview" class="w-24 h-24 rounded-full object-cover mx-auto" />
              </div>
          </div>
          <div v-if="errors.general" class="text-red-600 text-m ml-2" style="margin-top: 10px;">
            <p v-for="error in errors.general" :key="error">{{ error }}</p>
          </div>
          <div class="flex justify-end space-x-2">
            <button
              type="submit"
              @click.prevent="saveChanges"
              class="px-4 py-2 text-white bg-primary-600 hover:bg-primary-700 rounded"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
  
<script>
import { handleFileChange } from '@/services/fileService';

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
    editedProfile: {
      name: '',
      bio: '',
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      localProfile: { ...this.editedProfile },
      previewAvatar: null,
    };
  },
  methods: {
    saveChanges() {
      if (!this.localProfile.profilePicture) {
          delete this.localProfile.profilePicture;
      }

      this.$emit('save', this.localProfile);
    },
    onFileChange(event) {
      handleFileChange(event, (file, preview) => {
        this.localProfile.profilePicture = file;
        this.previewAvatar = preview;
      });
    },
  },
};
</script>