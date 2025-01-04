<template>
    <div class="flex justify-end">
      <button
        class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        @click="showModal"
      >
        + Add Post
      </button>
    </div>
    <div v-if="loading" class="loading">Loading posts...</div>
    <div v-else>
      <PostCard
        v-for="post in posts"
        :key="post.id"
        :postData="post"
        :currentUserId="this.currentUser?.userId || ''"
        @delete="deletePost"
        @edit="openEditModal(post)"
      />
    </div>

    <PostModal
      :isVisible="isVisible"
      :errors="errors"
      @submit="addPost"
      @close="showModal"
    />

    <PostEditModal 
      v-if="isEditModalOpen"
      :post="currentPost"
      :errors="errors"
      @close="isEditModalOpen = false"
      @submit="updatePost"
    />
</template>

<script>
import PostCard from '@/components/posts/PostCard.vue';
import PostModal from '@/components/posts/PostModal.vue';
import PostEditModal from './PostEditModal.vue';
import { createAxiosInstance } from '@/services/axiosInstance';
import { handleError } from '@/services/errorHandler';
import { mapGetters } from 'vuex';

export default {
  components: {
    PostCard,
    PostModal,
    PostEditModal
  },
  computed: {
    ...mapGetters(['currentUser']),
  },
  data() {
    return {
      isVisible: false,
      posts: [],
      loading: true,
      errors: [],
      isEditModalOpen: false,
      currentPost: null,
    };
  },
  async mounted() {
    await this.fetchPosts();
  },
  methods: {
    showModal() {
      this.isVisible = !this.isVisible;
      this.errors = [];
    },
    openEditModal(post) {
      this.currentPost = { ...post };
      this.isEditModalOpen = true;
      this.errors = [];
    },
    async updatePost(updatedPost) {
      const axiosInstancePosts = createAxiosInstance(8082);
      const axiosInstanceProfileInfo = createAxiosInstance(8084);
      const accessToken = localStorage.getItem('accessToken');

      try {
        const response = await axiosInstancePosts.patch(
          `/posts/${updatedPost.id}`,
          {
            content: updatedPost.content,
            type: "TextPost",
            goalId: updatedPost.goalId,
            skillIds: updatedPost.skillIds,
          },
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        const updatedPostData = response.data;

        let goal = null;
        if (updatedPostData.goalId) {
          goal = await axiosInstanceProfileInfo
            .get(`/users/profile/goals/${updatedPostData.goalId}`)
            .then((res) => res.data);

          if (updatedPost.isCompleteGoal) {
            await axiosInstanceProfileInfo.patch(`/users/profile/goals/${updatedPostData.goalId}`, 
              { progress: 'Completed' },
              { headers: { Authorization: `Bearer ${accessToken}` } }
            );

            goal.progress = 'Completed';
          }
        }

        let skills = [];
        if (updatedPostData.skillIds.length > 0) {
          const responseSkills = await axiosInstanceProfileInfo.post(
            `/skills/check-skills`,
            updatedPostData.skillIds,
            { headers: { Authorization: `Bearer ${accessToken}` } }
          );
          skills = responseSkills.data;
        }

        const index = this.posts.findIndex((p) => p.id === updatedPostData.id);
        if (index !== -1) {
          this.posts.splice(index, 1, {
            ...updatedPostData,
            goal,
            skills,
          });
        }

        this.isEditModalOpen = false;
      } catch (error) {
        this.errors = handleError(error.response?.data || {});
      }
    },
    async fetchPosts() {
      const axiosInstancePosts = createAxiosInstance(8082);
      const axiosInstanceProfileInfo = createAxiosInstance(8084);
      try {
        const response = await axiosInstancePosts.get('/posts');
        const rawPosts = response.data;

        const goalIds = [...new Set(rawPosts.map(post => post.goalId).filter(Boolean))];
        const skillIds = [...new Set(rawPosts.flatMap(post => post.skillIds).filter(Boolean))];

        const goalPromises = goalIds.map(id =>
          axiosInstanceProfileInfo
            .get(`/users/profile/goals/${id}`)
            .then(res => res.data)
            .catch(() => null)
        );
        const goals = await Promise.all(goalPromises);
        
        let skills = [];
        if (skillIds.length > 0) {
          const responseSkills = await axiosInstanceProfileInfo.post(`/skills/check-skills`, skillIds);
          skills = responseSkills.data;
        }

        const goalMap = Object.fromEntries(goals.filter(Boolean).map(goal => [goal.id, goal]));
        const skillMap = Object.fromEntries(skills.map(skill => [skill.skillId, skill]));

        this.posts = rawPosts.map(post => ({
          ...post,
          goal: goalMap[post.goalId] || null,
          skills: post.skillIds.map(id => skillMap[id] || null).filter(Boolean),
        }));
      } catch (error) {
          this.errors = handleError(error.response?.data || {});
      } finally {
          this.loading = false;
      }
    },
    async addPost(newPost) {
        const axiosInstancePosts = createAxiosInstance(8082);
        const axiosInstanceProfileInfo = createAxiosInstance(8084);
        const accessToken = localStorage.getItem('accessToken');

        try {
            const response = await axiosInstancePosts.post("/posts", newPost, {
              headers: { Authorization: `Bearer ${accessToken}` },
            });

            const createdPost = response.data;

            const goalId = createdPost.goalId;
            const skillIds = createdPost.skillIds || [];

            let goal = null;
            if (goalId) {
              goal = await axiosInstanceProfileInfo
              .get(`/users/profile/goals/${goalId}`)
              .then(res => res.data);

              if (newPost.isCompleteGoal) {
                await axiosInstanceProfileInfo.patch(`/users/profile/goals/${newPost.goalId}`, 
                  { progress: 'Completed' },
                  { headers: { Authorization: `Bearer ${accessToken}` } }
                );

                goal.progress = 'Completed';
              }

              if (goal.progress === 'NotStarted') {
                await axiosInstanceProfileInfo.patch(`/users/profile/goals/${goalId}`, 
                  { progress: 'InProgress' },
                  { headers: { Authorization: `Bearer ${accessToken}` } }
                );

                goal.progress = 'InProgress';
              }             
            }

            let skills = [];
            if (skillIds.length > 0) {
            const responseSkills = await axiosInstanceProfileInfo.post(`/skills/check-skills`, skillIds);
            skills = responseSkills.data;
            }

            if (response.status === 200){
              this.posts.unshift({
                ...createdPost,
                goal,
                skills,
              });
              this.errors = [];
              this.showModal();
            }
        } catch (error) {
            this.errors = handleError(error.response?.data || {});
        }
    },
    async deletePost(postId) {
      try {
        const axiosInstance = createAxiosInstance(8082);
        const accessToken = localStorage.getItem('accessToken');

        await axiosInstance.delete(`/posts/${postId}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        this.posts = this.posts.filter(post => post.id !== postId);
      } catch (error) {
        console.error("Error deleting post:", error);
      }
    },
  },
}
</script>

<style>
  ::-webkit-scrollbar {
    width: 2px;
    height: 2px;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background: #837d7d;
    border-radius: 10px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #a0a0a0;
  }
</style>