<template>
    <div class="flex justify-end">
      <button
        class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        @click="showModal = true"
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
      />
    </div>

    <PostModal
      :isVisible="showModal"
      @close="showModal = false"
      @submit="addPost"
    />
</template>

<script>
import PostCard from '@/components/posts/PostCard.vue';
import PostModal from '@/components/posts/PostModal.vue';
import { createAxiosInstance } from '@/services/axiosInstance';

export default {
  components: {
    PostCard,
    PostModal
  },
  data() {
    return {
      showModal: false,
      posts: [],
      loading: true,
    };
  },
  async mounted() {
    await this.fetchPosts();
  },
  methods: {
    async fetchPosts() {
      const axiosInstancePosts = createAxiosInstance(8082);
      const axiosInstanceProfileInfo = createAxiosInstance(8084);
      try {
        const response = await axiosInstancePosts.get('/posts');
        const rawPosts = response.data;
        console.log(rawPosts);

        const goalIds = [...new Set(rawPosts.map(post => post.goalId).filter(Boolean))];
        const skillIds = [...new Set(rawPosts.flatMap(post => post.skillIds).filter(Boolean))];

        const goalPromises = goalIds.map(id =>
          axiosInstanceProfileInfo.get(`/users/profile/goals/${id}`).then(res => res.data)
        );
        const goals = await Promise.all(goalPromises);
        
        let skills = [];
        if (skillIds.length > 0) {
          const responseSkills = await axiosInstanceProfileInfo.post(`/skills/check-skills`, skillIds);
          skills = responseSkills.data;
        }

        const goalMap = Object.fromEntries(goals.map(goal => [goal.id, goal]));
        const skillMap = Object.fromEntries(skills.map(skill => [skill.skillId, skill]));

        this.posts = rawPosts.map(post => ({
          ...post,
          goal: goalMap[post.goalId] || null,
          skills: post.skillIds.map(id => skillMap[id] || null).filter(Boolean),
        }));
      } catch (error) {
        this.error = 'Ошибка загрузки постов';
        console.error(error);
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

            this.posts.unshift({
              ...createdPost,
              goal,
              skills,
            });
        } catch (error) {
            console.error("Ошибка добавления поста:", error);
        } finally {
            this.showModal = false;
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