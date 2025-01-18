<template>
  <div class="learning-history-section dark:border-gray-700 rounded-lg">
    <div class="flex p-4 items-center justify-between border-b border-gray-300 dark:border-gray-700 pb-3">
      <h2 class="text-xl font-bold text-gray-900 dark:text-white">Learning History</h2>
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
    <ul class="space-y-3 m-4">
      <li
        v-for="history in histories"
        :key="history.id"
        class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm flex items-center justify-between"
      >
        <div>
          <p class="text-gray-800 dark:text-gray-200">
            <strong>{{ history.courseTitle }}</strong> - {{ formatDate(history.completedDate) }}
          </p>
          <p class="text-gray-600 dark:text-gray-400">{{ history.description }}</p>
        </div>
        <button
          v-if="visible"
          @click="showDeleteModal = true, selectedHistory = history.id"
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
      </li>
    </ul>  
  </div>
  <ConfirmModal
    v-if="showDeleteModal"
    :isVisible="showDeleteModal"
    title="Delete learing history"
    message="Are you sure you want to delete this history? This action cannot be undone."
    @confirm="deleteHistory(this.selectedHistory)"
    @cancel="showDeleteModal = false"
  />

  <AddHistoryModal
    v-if="isVisible"
    :visible="isVisible"
    :errors="errors"
    @save="addHistory"
    @close="showModal"
  />
</template>
  
<script>
import AddHistoryModal from "./modals/AddHistoryModal.vue";
import { createAxiosInstance } from "@/services/axiosInstance";
import { handleError } from '@/services/errorHandler';
import ConfirmModal from "../ConfirmModal.vue";

const axiosInstance = createAxiosInstance();
const accessToken = localStorage.getItem("accessToken");

export default {
  components: {
    AddHistoryModal,
    ConfirmModal
  },
  props: {
    initialHistory: {
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
      selectedHistory: '',
      histories: [...this.initialHistory],
      isVisible: false,
      errors: [],
    };
  },
  watch: {
    initialHistory: {
      immediate: true,
      deep: true,
      handler(newHistory) {
        this.history = [...newHistory];
      },
    },
  },
  methods: {
    showModal() {
      this.isVisible = !this.isVisible;
    },
    formatDate(dateString) {
      const options = { year: "numeric", month: "long", day: "numeric" };
      return new Intl.DateTimeFormat("en-US", options).format(new Date(dateString));
    },
    async addHistory(newHistory) {
      try {
        const response = await axiosInstance.post(
          `/users/profile/histories`, newHistory,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (response.status === 200){
          this.histories.push(response.data);
          this.errors = [];
          this.showModal();
        }
      } catch (error) {
        this.errors = handleError(error.response?.data || {});
        console.error("Ошибка добавления истории:", error);
      }
    },
    async deleteHistory(id){
      this.showDeleteModal = false;
      try {
        const response = await axiosInstance.delete(
          `/users/profile/histories/${id}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (response.status === 204){
          this.histories = this.histories.filter(history => history.id !== id);
        }
      } catch (error) {
        this.errors = handleError(error.response?.data || {});
        console.error("Ошибка удаления истории:", error);
      }
    }
  },
};
</script>
  