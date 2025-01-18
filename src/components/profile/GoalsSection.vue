<template>
  <div class="goals-section dark:border-gray-700 rounded-lg">
    <div class="flex p-4 items-center justify-between border-b border-gray-300 dark:border-gray-700 pb-3">
      <h2 class="text-xl font-bold text-gray-900 dark:text-white">Goals</h2>
      <button
        v-if="visible"
        @click="showModal"
        class="flex items-center justify-center w-8 h-8 text-white rounded hover:bg-green-500 transition-colors"
        title="Add Learning History"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
    </div> 
    <ul class="m-4 space-y-4">
      <li
          v-for="goal in goals"
          :key="goal.id"
          class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm flex items-center justify-between"
      >
          <div>
            <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200">
                {{ goal.title }}
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">
                {{ goalStatus[goal.progress].text }}
            </p>  
          </div>

          <div class="flex items-center gap-4">
            <div class="w-32 bg-gray-300 dark:bg-gray-600 rounded-full h-2">
                <div
                :class="goalStatus[goal.progress].progressClass"
                class="h-2 rounded-full"
                :style="{ width: goalStatus[goal.progress].progress }"
                ></div>
            </div>
            <span :class="goalStatus[goal.progress].iconClass">
                <component :is="goalStatus[goal.progress].icon" class="w-6 h-6"></component>
            </span>
            <button
              v-if="visible"
              @click="showDeleteModal = true, selectedGoal = goal.id"
              class="flex items-center justify-center w-6 h-6 text-white rounded hover:bg-red-600 transition-colors"
            >       
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </div>
      </li>
    </ul>    
  </div>
  <ConfirmModal
    v-if="showDeleteModal"
    :isVisible="showDeleteModal"
    title="Delete Goal"
    message="Are you sure you want to delete this goal? This action cannot be undone."
    @confirm="deleteGoal(this.selectedGoal)"
    @cancel="showDeleteModal = false"
  />

  <AddGoalModal
    v-if="isVisible"
    :visible="isVisible"
    :errors="errors"
    @save="saveGoal"
    @close="showModal"
  />
</template>
  
<script>
import AddGoalModal from "./modals/AddGoalModal.vue";
import { createAxiosInstance } from "@/services/axiosInstance";
import { handleError } from '@/services/errorHandler';
import ConfirmModal from "../ConfirmModal.vue";

const axiosInstance = createAxiosInstance();
const accessToken = localStorage.getItem("accessToken");

export default {
  components: {
    AddGoalModal,
    ConfirmModal
  },
  props: {
    initialGoals: {
      type: Array,
      default: () => [],
    },
    visible: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      showDeleteModal: false,
      goals: [...this.initialGoals],
      selectedGoal: '',
      goalStatus: {
        NotStarted: { text: "Not started", progress: "0%", progressClass: "bg-gray-400", icon: 'div' },
        InProgress: { text: "In progress", progress: "50%", progressClass: "bg-blue-400", icon: 'div' },
        Completed: { text: "Completed", progress: "100%", progressClass: "bg-green-400", icon: 'div' },
      },
      isVisible: false,
      errors: [],
    };
  },
  watch: {
    initialGoals: {
      immediate: true,
      deep: true,
      handler(newGoals) {
        this.goals = [...newGoals];
      },
    },
  },
  methods: {
    showModal() {
      this.isVisible = !this.isVisible;
      this.errors = [];
    },
    async saveGoal(newGoal) {
      try {
        const response = await axiosInstance.post(
          `/users/profile/goals`, newGoal,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (response.status === 200){
          this.goals.push(response.data);
          this.errors = [];
          this.showModal();
        }
      } catch (error) {
        this.errors = handleError(error.response?.data || {});
        console.error("Ошибка добавления цели:", error);
      }
    },
    async deleteGoal(id){
      this.showDeleteModal = false;
      try {
        const response = await axiosInstance.delete(
          `/users/profile/goals/${id}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (response.status === 204){
          this.goals = this.goals.filter(goal => goal.id !== id);
        }
      } catch (error) {
        this.errors = handleError(error.response?.data || {});
        console.error("Ошибка удаления истории:", error);
      }
    }
  },
};
</script>
  