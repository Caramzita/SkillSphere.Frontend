<template>
    <div class="flex justify-between items-center mb-4">
        <div class="w-1/4"></div>

        <div class="flex items-center gap-4 justify-center w-2/4">
          <button @click="toggleSortOrder">
            <svg 
              v-if="sortOrder === 'asc'"
              xmlns="http://www.w3.org/2000/svg" 
              class="w-6 h-6 fill-black dark:fill-white transition-colors" 
              viewBox="0 0 24 24">
              <path d="M22,4.5a1,1,0,0,1-1,1H12a1,1,0,0,1,0-2h9A1,1,0,0,1,22,4.5Zm-1,4H14a1,1,0,0,0,0,2h7a1,1,0,0,0,0-2Zm0,
              5H16a1,1,0,0,0,0,2h5a1,1,0,0,0,0-2Zm0,5H18a1,1,0,0,0,0,2h3a1,1,0,0,0,0-2ZM6,2A1,1,0,0,0,5,3V18.586L3.707,
              17.293a1,1,0,0,0-1.414,1.414l3,3a1,1,0,0,0,1.416,0l3-3a1,1,0,0,0-1.414-1.414L7,18.586V3A1,1,0,0,0,6,2Z"/>
            </svg>
            <svg 
              v-if="sortOrder === 'desc'"
              xmlns="http://www.w3.org/2000/svg" 
              class="w-6 h-6 fill-black dark:fill-white transition-colors" 
              viewBox="0 0 24 24" 
              transform="matrix(-1, 0, 0, 1, 0, 0)rotate(180)"
            >
              <g id="SVGRepo_bgCarrier" stroke-width="0"/>
              <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>
              <g id="SVGRepo_iconCarrier">
              <path d="M22,4.5a1,1,0,0,1-1,1H12a1,1,0,0,1,0-2h9A1,1,0,0,1,22,4.5Zm-1,4H14a1,1,0,0,0,0,2h7a1,1,0,0,0,0-2Zm0,
                5H16a1,1,0,0,0,0,2h5a1,1,0,0,0,0-2Zm0,5H18a1,1,0,0,0,0,2h3a1,1,0,0,0,0-2ZM6,2A1,1,0,0,0,5,3V18.586L3.707,
                17.293a1,1,0,0,0-1.414,1.414l3,3a1,1,0,0,0,1.416,0l3-3a1,1,0,0,0-1.414-1.414L7,18.586V3A1,1,0,0,0,6,2Z"/>
              </g>
            </svg>
          </button>         

          <!-- Фильтрация по навыкам -->
          <div class="relative">
          <button
            @click="showSkills = !showSkills"
            class="border px-3 py-1 rounded-xl hover:bg-primary-700 dark:bg-gray-800 dark:text-white"
          >
            Filter by Skills
          </button>
          <div
            v-if="showSkills"
            @mouseleave="applySkillFilter"
            class="absolute top-full mt-2 bg-white border rounded shadow-lg p-4 w-64 dark:bg-gray-800 z-50"
          >
            <div v-for="category in categories" :key="category.id" class="flex flex-wrap gap-2">
              <button
                v-for="skill in category.skills"
                :key="skill.id"
                @click="toggleSkill(skill)"
                :class="{
                'bg-blue-600 text-white': selectedSkills.includes(skill.id),
                'bg-gray-200 dark:bg-gray-600 dark:text-gray-100': !selectedSkills.includes(skill.id),
                }"
                class="px-4 py-1 rounded-full text-sm font-medium transition duration-200 ease-in-out hover:bg-blue-500 hover:text-white"
              >
                  {{ skill.name }}
              </button>
            </div>   
          </div>
        </div>
        
          <!-- Фильтрация по дате публикации -->
          <button
            @click="applySort('date')"
            class="border px-3 py-1 rounded-xl hover:bg-primary-700 dark:bg-gray-800 dark:text-white"
          >
            Sort by Date
          </button>
          
          <!-- Фильтрация по количеству лайков -->
          <button
            hidden
            @click="applySort('likes')"
            class="border px-2 py-1 rounded-xl hover:bg-gray-700 dark:bg-gray-800 dark:text-white"
          >
            Sort by Likes
          </button>
        </div>
      
      <div class="w-1/4 flex justify-end">
        <button
          class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          @click="showModal"
        >
          + Add Post
        </button>
      </div>   
    </div>

    <div v-if="loading" class="loading">Loading posts...</div>
    <div v-else>
      <PostCard
        v-for="post in filteredPosts"
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
import { loadCategoriesAndSkills } from '@/services/profileService';

export default {
  components: {
    PostCard,
    PostModal,
    PostEditModal
  },
  computed: {
    ...mapGetters(['currentUser']),

    filteredPosts() {
      let posts = [...this.posts];

      if (this.sortBy) {
        posts.sort((a, b) => {
          if (this.sortBy === "date") {
            return this.sortOrder === "asc"
              ? new Date(a.createdAt) - new Date(b.createdAt)
              : new Date(b.createdAt) - new Date(a.createdAt);
          }
          if (this.sortBy === "likes") {
            return this.sortOrder === "desc" ? a.likes - b.likes : b.likes - a.likes;
          }
        });
      }

      // Фильтрация по навыкам
      if (this.selectedSkills.length) {
        posts = posts.filter((post) =>
          this.selectedSkills.every((skill) => post.skillIds.includes(skill))
        );
      }

      return posts;
    },
  },
  data() {
    return {
      isVisible: false,
      posts: [],
      loading: true,
      errors: [],
      isEditModalOpen: false,
      currentPost: null,

      sortOrder: "desc",
      sortBy: "date",
      showSkills: false,
      selectedSkills: [],
    };
  },
  async mounted() {
    await this.fetchPosts();
    this.categories = await loadCategoriesAndSkills();
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
    toggleSortOrder() {
      this.sortOrder = this.sortOrder === "asc" ? "desc" : "asc";
    },
    applySort(type) {
      this.sortBy = type;
    },
    applySkillFilter() {
      this.showSkills = false;
    },
    toggleSkill(skill) {
      if (this.selectedSkills.includes(skill.id)) {
        this.selectedSkills = this.selectedSkills.filter((id) => id !== skill.id);
      } else {
        this.selectedSkills.push(skill.id);
      }    
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