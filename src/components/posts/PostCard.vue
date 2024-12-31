<template>
  <div class="post-card bg-white dark:bg-gray-700 rounded-lg p-4 shadow-md mt-5 max-w-xl mx-auto">
    <UserCard :userId=postData.userId />

    <div class="goal-info mb-3">
      <h3 class="text-lg font-bold dark:text-white">
        {{ postData.goal?.title }}
      </h3>
      <p class="text-sm text-gray-500 dark:text-gray-400">
        {{ postData.goal?.progress }}
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
        class="px-2 py-1 bg-primary-100 dark:bg-primary-700 text-sm rounded text-primary-700 dark:text-white"
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
};
</script>
  