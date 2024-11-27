<template>
  <div class="w-full max-w-md mx-auto">
    <h2 class="text-2xl font-bold text-gray-800 dark:text-white text-center mb-6">
      Personal Info
    </h2>
    <form class="space-y-6">
      <div>
        <label for="name" class="block mb-2 pl-1 text-sm font-medium text-gray-700 dark:text-gray-300">
          Name
        </label>
        <input
          v-model="localFormData.name"
          type="text"
          id="name"
          class="block w-full p-2.5 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg 
                 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 
                 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white 
                 dark:focus:ring-primary-500 dark:focus:border-primary-500"
          placeholder="Enter your name"
          required
        />
        <p v-if="errors.name" class="text-red-600 text-m mt-1 ml-2">{{ errors.name }}</p>
      </div>

      <div>
        <label for="bio" class="block mb-2 pl-1 text-sm font-medium text-gray-700 dark:text-gray-300">
          Bio
        </label>
        <textarea
          v-model="localFormData.bio"
          id="bio"
          rows="4"
          class="block w-full p-2.5 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg 
                 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 
                 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white 
                 dark:focus:ring-primary-500 dark:focus:border-primary-500"
          placeholder="Tell us a little about yourself"
        ></textarea>
        <p v-if="errors.bio" class="text-red-600 text-m mt-1 ml-2">{{ errors.bio }}</p>
      </div>

      <div>
        <label for="profilePicture" class="block mb-2 pl-1 text-sm font-medium text-gray-700 dark:text-gray-300">
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

      <div class="flex items-center justify-end">
        <button    
          @click.prevent="onSubmit"
          @next="goNext"      
          type="submit"
          class="px-5 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 
                 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 
                 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
        >
          Next
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { createAxiosInstance } from '@/services/axiosInstance';
import { handleError } from '@/services/errorHandler';
import { handleFileChange } from '@/services/fileService';

export default {
  emits: ["next"],
  data() {
    return {
      localFormData: { 
        name: '',
        bio: '',
        profilePicture: null
       },
      previewAvatar: null,
      errors: [],
    };
  },
  methods: {
    async onSubmit() {
      const formData = new FormData();
      formData.append('name', this.localFormData.name);
      formData.append('bio', this.localFormData.bio);

      if (this.localFormData.profilePicture) {
        formData.append('profilePicture', this.localFormData.profilePicture);
      }

      const axiosInstance = createAxiosInstance(8084);
      const accessToken = localStorage.getItem('accessToken');

      try {
        const response = await axiosInstance.post('/users/profile', formData, {
          headers: { 
            'Content-Type': 'multipart/form-data', 
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
    onFileChange(event) {
      handleFileChange(event, (file, preview) => {
        this.localFormData.profilePicture = file;
        this.previewAvatar = preview;
      });
    },
    goNext() {
      this.$emit('next');
    },
  },
};
</script>