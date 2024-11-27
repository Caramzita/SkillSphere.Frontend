<template>
  <section :class="{'form active': isActive}" class="bg-gray-50 dark:bg-gray-900">
    <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <a href="#" class="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
        <img class="w-8 h-8 mr-2" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg" alt="logo">
        SkillSphere    
      </a>
      <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
        <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            Create an account
          </h1>
          <form class="space-y-4 md:space-y-6" action="#">
            <div>
              <label for="login" class="block mb-2 pl-1 text-sm font-medium text-gray-900 dark:text-white">Login</label>
              <input 
                v-model="localFormData.login" 
                type="text" 
                name="login" 
                id="login" 
                class="bg-gray-50 border border-gray-300 
                text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 
                dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                placeholder="User login" 
                required
              />
              <p v-if="mergedErrors.login" class="text-red-600 text-m mt-1 ml-2">{{ mergedErrors.login }}</p>
            </div>
            <div>
              <label for="email" class="block mb-2 pl-1 text-sm font-medium text-gray-900 dark:text-white">Email</label>
              <input 
                v-model="localFormData.email" 
                type="email" 
                name="email" 
                id="email" 
                class="bg-gray-50 border border-gray-300 
                text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 
                dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                placeholder="name@company.com"
                required
              />
              <p v-if="mergedErrors.email" class="text-red-600 text-m mt-1 ml-2">{{ mergedErrors.email }}</p>
            </div>
            <div>
              <label for="password" class="block mb-2 pl-1 text-sm font-medium text-gray-900 dark:text-white">Password</label>
              <input 
                v-model="localFormData.password" 
                type="password" 
                name="password" 
                id="password" 
                placeholder="••••••••" 
                class="bg-gray-50 border 
                border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 
                dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                required
              />
              <p v-if="mergedErrors.password" class="text-red-600 text-m mt-1 ml-2">{{ mergedErrors.password }}</p>
            </div>
            <div>
              <label for="password" class="block mb-2 pl-1 text-sm font-medium text-gray-900 dark:text-white">Confirm Password</label>
              <input 
                v-model="localFormData.confirmPassword" 
                type="password" 
                name="confirmPassword" 
                id="confirmPassword" 
                placeholder="••••••••" 
                class="bg-gray-50 border 
                border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 
                dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                required
              />
              <p v-if="mergedErrors.confirmPassword" class="text-red-600 text-m mt-1 ml-2">{{ mergedErrors.confirmPassword }}</p>
            </div>
            <div v-if="mergedErrors.general" class="text-red-600 text-m ml-2" style="margin-top: 10px;">
              <p v-for="error in mergedErrors.general" :key="error">{{ error }}</p>
            </div>
            <button 
              @click.prevent="onSubmit" 
              type="submit" 
              class="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 
              focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center 
              dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
            >
              Create an account
            </button>
            <p class="text-sm font-light text-gray-500 dark:text-gray-400">
              Already have an account? <a href="#" @click.prevent="toggleMode" 
              class="font-medium text-primary-600 hover:underline dark:text-primary-500">Login here</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  </section>
  </template>
  
  <script>
  export default {
    props: {
      formData: Object,
      isActive: Boolean,
      errors: {
        type: Object,
        default: () => ({})
      }
    },
    data() {
      return {
        localFormData: {
          login: this.formData.login,
          email: this.formData.email,
          password: this.formData.password,
          confirmPassword: this.formData.confirmPassword,
          rememberMe: this.formData.rememberMe,
        },
        localErrors: {},
      };
    },
    computed: {
      mergedErrors() {
        return { ...this.errors, ...this.localErrors };
      },
    },
    methods: {
      onSubmit() {
        this.localErrors = {};

        if (this.localFormData.password !== this.localFormData.confirmPassword) {
          this.localErrors.confirmPassword = "Passwords do not match.";
          return;
        }

        this.localFormData.rememberMe = true;
        this.$emit('submit', this.localFormData);
      },
      toggleMode() {
        this.$emit('toggleMode');
      }
    },
    watch: {
      localFormData: {
        deep: true,
        handler(newData) {
          Object.assign(this.formData, newData);
        },
      },
    },
  };
  </script>
  