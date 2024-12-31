<template>
    <ol class="flex items-center w-full max-w-xl mb-8 text-sm font-medium text-center text-gray-400 bg-gray-50 dark:bg-gray-900 sm:text-base">
      <li
        v-for="(step, index) in steps"
        :key="index"
        class="flex items-center w-full justify-center"
        :class="{
          'text-blue-600 dark:text-blue-500': index <= currentStep,
          'text-gray-500 dark:text-gray-400': index > currentStep,
        }"
      >
        <span class="flex items-center space-x-2">
          <span
            class="flex justify-center items-center w-6 h-6 text-center rounded-full"
            :class="{
              'bg-blue-600 text-white': index <= currentStep,
              'bg-gray-200 dark:bg-gray-700': index > currentStep,
            }"
          >
            <template v-if="index < currentStep">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
                class="w-4 h-4"
                aria-hidden="true"
              >
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 
                    10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
              </svg>
            </template>
            <template v-else>
              {{ index + 1 }}
            </template>
          </span>
          <span>{{ step }}</span>
        </span>
      </li>
    </ol>
</template>
  
<script>
export default {
    props: {
        currentStep: {
        type: Number,
        required: true,
        },
        steps: {
        type: Array,
        required: true,
        },
    },
};
</script>