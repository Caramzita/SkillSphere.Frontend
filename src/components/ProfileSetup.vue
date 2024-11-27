<template>
  <div class="h-full w-full min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-400 dark:text-gray-400">
    <div class="max-w-4xl mx-auto flex flex-col items-center py-8 min-h-screen">
      <StepTracker :steps="steps" :currentStep="currentStep" />
      <div class="w-full max-w-xl rounded-lg shadow bg-gray-50 dark:bg-gray-800">
        <div class="p-6">
          <StepBasicInfo
            v-if="currentStep === 0"
            @next="nextStep"
          />
          <StepSkills
            v-else-if="currentStep === 1"
            @next="nextStep"
            @previous="previousStep"
          />
          <StepOptionalInfo
            v-else-if="currentStep === 2"
            @previous="previousStep"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import StepBasicInfo from './forms/profile-steps/StepBasicInfo.vue';
import StepSkills from './forms/profile-steps/StepSkills.vue';
import StepOptionalInfo from './forms/profile-steps/StepOptionalInfo.vue';
import StepTracker from "./StepTracker.vue";

export default {
  components: {
    StepBasicInfo,
    StepSkills,
    StepOptionalInfo,
    StepTracker,
  },
  data() {
    return {
      currentStep: 0,
      steps: ['Personal Info', 'Skills', 'Goals'],
    };
  },
  methods: {
    nextStep() {
      if (this.currentStep < this.steps.length - 1) {
        this.currentStep++;
      } else {
        this.submitForm();
      }
    },
    previousStep() {
      if (this.currentStep > 0) {
        this.currentStep--;
      }
    },
  },
};
</script>