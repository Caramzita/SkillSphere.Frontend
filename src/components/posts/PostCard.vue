<template>
  <div class="post-card bg-white dark:bg-gray-700 rounded-lg p-4 shadow-md mt-5 max-w-xl mx-auto relative">
    <div class="flex items-center justify-between">
      <UserCard :userId=postData.userId class="pr-2 p-1"/>

      <div v-if="postData.userId === currentUserId" class="flex items-center absolute top-2 right-2 space-x-2">
        <button
          class="text-blue-600 hover:text-blue-700 focus:outline-none"
          @click="$emit('edit', postData)"
        >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
           <path xmlns="http://www.w3.org/2000/svg" d="M21.2799 6.40005L11.7399 15.94C10.7899 16.89 7.96987 17.33 7.33987 
              16.7C6.70987 16.07 7.13987 13.25 8.08987 12.3L17.6399 2.75002C17.8754 2.49308 18.1605 2.28654 18.4781 2.14284C18.7956 
              1.99914 19.139 1.92124 19.4875 1.9139C19.8359 1.90657 20.1823 1.96991 20.5056 2.10012C20.8289 2.23033 21.1225 2.42473 
              21.3686 2.67153C21.6147 2.91833 21.8083 3.21243 21.9376 3.53609C22.0669 3.85976 22.1294 4.20626 22.1211 4.55471C22.1128
              4.90316 22.0339 5.24635 21.8894 5.5635C21.7448 5.88065 21.5375 6.16524 21.2799 6.40005V6.40005Z" 
              stroke="#9f9f9f" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              
            <path xmlns="http://www.w3.org/2000/svg" d="M11 4H6C4.93913 4 3.92178 4.42142 3.17163 5.17157C2.42149 5.92172 2 
              6.93913 2 8V18C2 19.0609 2.42149 20.0783 3.17163 20.8284C3.92178 21.5786 4.93913 22 6 22H17C19.21 22 20 20.2 20 18V13" 
              stroke="#9f9f9f" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        </button>

        <button
            class="text-red-600 hover:text-red-700 focus:outline-none"
            @click="showDeleteModal = true"
          >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <ConfirmModal
      v-if="showDeleteModal"
      :isVisible="showDeleteModal"
      title="Delete Post"
      message="Are you sure you want to delete this post? This action cannot be undone."
      @confirm="deletePost"
      @cancel="showDeleteModal = false"
    />

    <div v-if="postData.goal" class="flex goal-info mt-1 items-center space-x-2">
      <h3 class="text-lg font-bold dark:text-white">
        {{ postData.goal?.title }}
      </h3>
      <p v-if="postData.goal?.progress" class="text-sm text-gray-500 dark:text-gray-400 relative" style="top: 0.15em;">
        ({{ goalStatus[postData.goal?.progress].text }})
      </p>
    </div>

    <!-- Основное содержание поста -->
    <div class="post-content mb-2 mt-1">
      <p class="text-gray-700 dark:text-gray-300">
        {{ postData.content }}
      </p>
    </div>   

    <div v-if="postData.skills.length > 0" class="skills flex flex-wrap gap-2 pb-3">
      <span
        v-for="skill in postData.skills"
        :key="skill.skillId"
        class="px-2 py-0.5 bg-primary-100 dark:bg-primary-700 text-sm rounded-lg text-primary-700 dark:text-white"
      >
        {{ skill.skillName }}
      </span>
    </div>

    <div class="border-b border-gray-600 mb-3"></div>

    <!-- Кнопки реакций -->
    <PostReactions :postId="postData.id" />

    <PostComments :postId="postData.id" />
  </div>
</template>

<script>
import UserCard from '@/components/profile/UserCard.vue';
import PostReactions from './PostReactions.vue';
import PostComments from './PostComments.vue';
import ConfirmModal from '../ConfirmModal.vue';
  
export default {
  name: 'PostCard',
  props: {
    postData: {
      type: Object,
      required: true,
    },
    currentUserId: {
      type: String,
      required: true,
    },
  },
  components: {
    UserCard,
    PostReactions,
    ConfirmModal,
    PostComments
  },
  data () {
    return {
      showDeleteModal: false,
      goalStatus: {
        NotStarted: { text: "Not started", progress: "0%", progressClass: "bg-gray-400", icon: 'div' },
        InProgress: { text: "In progress", progress: "50%", progressClass: "bg-blue-400", icon: 'div' },
        Completed: { text: "Completed", progress: "100%", progressClass: "bg-green-400", icon: 'div' },
      },
    }
  },
  methods: {
    deletePost(){
      this.showDeleteModal = false;
      this.$emit("delete", this.postData.id);
    },
    openEditModal() {
      this.$emit('edit-post', this.postData.id);
    },
  }
};
</script>
  