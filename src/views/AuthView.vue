<template>
  <SignInForm
    v-if="isActive"
    :formData="formData"
    :isActive="isActive"
    :errors="errors"
    @submit="onSubmit"
    @toggleMode="toggleMode"
  />
  <CreateAccountForm
    v-if="!isActive"
    :formData="formData"
    :isActive="!isActive"
    :errors="errors"
    @submit="onSubmit"
    @toggleMode="toggleMode"
  />
</template>

<script>
import SignInForm from '@/components/forms/auth/SignInForm.vue';
import CreateAccountForm from '@/components/forms/auth/CreateAccountForm.vue';
import { handleError } from '@/services/errorHandler';
import { createAxiosInstance } from '@/services/axiosInstance';

export default {
  components: { SignInForm, CreateAccountForm },
  data() {
    return {
      isActive: true,
      formData: { login: '', email: '', password: '', confirmPassword: '', rememberMe: true },
      errors: [],
    };
  },
  methods: {
    toggleMode() {
      this.isActive = !this.isActive;
      this.resetFormData();
    },
    resetFormData() {
      this.formData = { login: '', email: '', password: '', confirmPassword: '' };
      this.errors = [];
    },
    async onSubmit(formData) {
      try {
        const endpoint = this.isActive ? '/auth/login' : '/auth/register';

        const axiosInstance = createAxiosInstance();
        
          const payload = {
            login: formData.login,
            password: formData.password,
            ...(this.isActive ? {} : { email: formData.email })
          };

          const response = await axiosInstance.post(endpoint, payload);

        if (response.status === 200) {
          const { accessToken, refreshToken, refreshTokenExpiration } = response.data;

          const storage = formData.rememberMe ? localStorage : sessionStorage;
          storage.setItem('accessToken', accessToken);
          storage.setItem('refreshToken', refreshToken);
          storage.setItem('refreshTokenExpiration', refreshTokenExpiration);

          await this.$store.dispatch('fetchCurrentUser');

          this.$router.push('/profile-setup');
        }
      } catch (error) {
        console.error('Error:', error);
        if (error.response) {
          this.errors = handleError(error.response.data);
        } else {
          this.errors = 'Произошла ошибка при соединении с сервером';
        }
      }
    }
  },
};
</script>