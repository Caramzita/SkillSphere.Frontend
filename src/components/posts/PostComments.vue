<template>
  <div class="post-comments">
    <div v-if="topComment" class="top-comment mt-2">
      <CommentCard :comment="topComment" />
    </div>

    <ul v-if="showAllComments">
      <li v-for="comment in filteredComments" :key="comment.id">
        <div class="border-b border-gray-600 mt-2 mb-2"></div>
        <CommentCard :comment="comment"/>
      </li>
    </ul>
  
    <div :class="comments.length > 1 ? 'mt-2' : 'mt-3'">
      <button v-if="comments.length > 1" @click="toggleComments">
        <p class="text-primary-700 dark:text-primary-500">
          {{ showAllComments ? 'Hide Comments' : `View all comments (${commentsCount - 1})` }}
        </p>
      </button> 
  
      <div class="flex items-center justify-between mt-0.5">
        <textarea 
            v-model="newComment" 
            placeholder="Write a comment..." 
            class="comment-input w-full h-8 px-2 py-0.5 border rounded dark:bg-gray-700 dark:text-white max-h-[150px] min-h-8 resize-y"
            ref="textarea"
            @input="resizeTextarea"
        ></textarea>
        <button @click="addComment" class="ml-2">
            <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none"
                class="w-7 h-7"
            >
                <path d="M11.5003 12H5.41872M5.24634 12.7972L4.24158 15.7986C3.69128 17.4424 3.41613 18.2643 3.61359 
                    18.7704C3.78506 19.21 4.15335 19.5432 4.6078 19.6701C5.13111 19.8161 5.92151 19.4604 
                    7.50231 18.7491L17.6367 14.1886C19.1797 13.4942 19.9512 13.1471 20.1896 12.6648C20.3968 
                    12.2458 20.3968 11.7541 20.1896 11.3351C19.9512 10.8529 19.1797 10.5057 17.6367 9.81135L7.48483 
                    5.24303C5.90879 4.53382 5.12078 4.17921 4.59799 4.32468C4.14397 4.45101 3.77572 4.78336 3.60365 
                    5.22209C3.40551 5.72728 3.67772 6.54741 4.22215 8.18767L5.24829 11.2793C5.34179 11.561 5.38855 11.7019 
                    5.407 11.8459C5.42338 11.9738 5.42321 12.1032 5.40651 12.231C5.38768 12.375 5.34057 12.5157 5.24634 12.7972Z" 
                stroke="white"
                stroke-width="2" 
                stroke-linecap="round" 
                stroke-linejoin="round"/>
            </svg>
        </button>
      </div>
    </div>  
  </div>
</template>
  
<script>
import { createAxiosInstance } from '@/services/axiosInstance';
import CommentCard from './CommentCard.vue';
import { trimAndFormatContent } from '@/services/textFormatter';

const axiosInstance = createAxiosInstance();

export default {
  name: 'PostComments',
  props: {
    postId: {
      type: String,
      required: true,
    },
  },
  components: {
    CommentCard,
  },
  computed: {
    filteredComments() {
      if (!this.topComment) return this.comments;
      
      return this.comments.filter(comment => comment.id !== this.topComment.id);
    },
  },
  data() {
    return {
      comments: [],
      topComment: null,
      newComment: '',
      commentsCount: 0,
      showAllComments: false,
    };
  },
  methods: {
      resizeTextarea() {
        const textarea = this.$refs.textarea;
        textarea.style.height = '32px';
        textarea.style.height = `${textarea.scrollHeight}px`;
      },
      async fetchComments() {
          try {
          const { data } = await axiosInstance.get(`/interactions/posts/${this.postId}/comments`);
          this.comments = data;
          this.commentsCount = data.length;
  
          if (data.length > 0) {
            this.topComment = data.reduce((prev, curr) => 
              new Date(curr.createdAt) > new Date(prev.createdAt) ? curr : prev
            );
          }
          } catch (error) {
          console.error('Error fetching comments:', error);
          }
      },
      async addComment() {
          if (!this.newComment.trim()) return;

          this.newComment = trimAndFormatContent(this.newComment);
  
          try {
          const { data } = await axiosInstance.post(
              `/interactions/posts/${this.postId}/comments`,
              { content: this.newComment }
          );
          this.comments.push(data);
          this.newComment = '';
          this.commentsCount++;
          this.fetchComments();
          } catch (error) {
          console.error('Error adding comment:', error);
          }
      },
      toggleComments() {
          this.showAllComments = !this.showAllComments;
  
          if (this.showAllComments && this.comments.length === 0) {
          this.fetchComments();
          }
      },
  },
  mounted() {
    this.fetchComments();
  },
};
</script>

<style scoped>
.comment-input {
  overflow-y: hidden;
}
</style>
  