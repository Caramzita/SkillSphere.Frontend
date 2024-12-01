<template>
    <div class="goals-section">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white">Goals</h2>
        <ul class="mt-4 space-y-4">
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
            </div>
        </li>
        </ul>
        <button
        @click="addGoal"
        class="mt-4 px-4 py-2 text-white bg-primary-600 hover:bg-primary-700 rounded-lg"
        >
        Add Goal
        </button>
    </div>
</template>
  
  <script>
  export default {
    props: {
      initialGoals: {
        type: Array,
        default: () => [],
      },
    },
    data() {
      return {
        goals: [...this.initialGoals],
        goalStatus: {
          NotStarted: { text: "Not started", progress: "0%", progressClass: "bg-gray-400", icon: 'div' },
          InProgress: { text: "In progress", progress: "50%", progressClass: "bg-blue-400", icon: 'div' },
          Completed: { text: "Completed", progress: "100%", progressClass: "bg-green-400", icon: 'div' },
        },
      };
    },
    methods: {
      addGoal() {
        const newGoal = {
          id: Date.now(),
          title: "New Goal",
          progress: "NotStarted",
        };
        this.goals.push(newGoal);
      },
    },
  };
  </script>
  