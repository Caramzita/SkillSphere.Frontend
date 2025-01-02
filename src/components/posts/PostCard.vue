<template>
  <div class="post-card bg-white dark:bg-gray-700 rounded-lg p-4 shadow-md mt-5 max-w-xl mx-auto">
    <UserCard :userId=postData.userId />

    <div class="flex goal-info mb-3 mt-1 pl-1 items-center space-x-2">
      <h3 class="text-lg font-bold dark:text-white">
        {{ postData.goal?.title }}
      </h3>
      <p v-if="postData.goal?.progress" class="text-lg text-gray-500 dark:text-gray-400">
        - {{ goalStatus[postData.goal?.progress].text }}
      </p>
    </div>

    <!-- Основное содержание поста -->
    <div class="post-content mb-2">
      <p class="text-gray-700 dark:text-gray-300">
        {{ postData.content }}
      </p>
    </div>

    <div v-if="postData.skills.length > 0" class="skills flex flex-wrap gap-2 mb-4 border-b border-gray-600 pb-4">
      <span
        v-for="skill in postData.skills"
        :key="skill.skillId"
        class="px-2 py-0.5 bg-primary-100 dark:bg-primary-700 text-sm rounded-lg text-primary-700 dark:text-white"
      >
        {{ skill.skillName }}
      </span>
    </div>
    
    <!-- Кнопки реакций -->
    <PostReactions :postId="postData.id" />
  </div>
</template>

  
<script>
import UserCard from '@/components/profile/UserCard.vue';
import PostReactions from './PostReactions.vue';
  
export default {
  name: 'PostCard',
  props: {
    postData: {
      type: Object,
      required: true,
    },
  },
  components: {
    UserCard,
    PostReactions
  },
  data () {
    return {
      goalStatus: {
        NotStarted: { text: "Not started", progress: "0%", progressClass: "bg-gray-400", icon: 'div' },
        InProgress: { text: "In progress", progress: "50%", progressClass: "bg-blue-400", icon: 'div' },
        Completed: { text: "Completed", progress: "100%", progressClass: "bg-green-400", icon: 'div' },
      },
    }
  },
};
</script>
  