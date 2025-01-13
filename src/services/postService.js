import { createAxiosInstance } from './axiosInstance';
import { handleError } from './errorHandler';

const axiosInstancePosts = createAxiosInstance(8082);
const axiosInstanceProfileInfo = createAxiosInstance(8084);
const accessToken = localStorage.getItem('accessToken');

export async function fetchPosts() {
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

    return rawPosts.map(post => ({
      ...post,
      goal: goalMap[post.goalId] || null,
      skills: post.skillIds.map(id => skillMap[id] || null).filter(Boolean),
    }));
  } catch (error) {
    throw handleError(error.response?.data || {});
  }
}

export async function addPost(newPost) {
  try {
    const response = await axiosInstancePosts.post('/posts', newPost, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const createdPost = response.data;

    let goal = null;
    if (createdPost.goalId) {
      goal = await axiosInstanceProfileInfo
        .get(`/users/profile/goals/${createdPost.goalId}`)
        .then(res => res.data);

      if (newPost.isCompleteGoal) {
        await axiosInstanceProfileInfo.patch(
          `/users/profile/goals/${newPost.goalId}`,
          { progress: 'Completed' },
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );

        goal.progress = 'Completed';
      }

      if (goal.progress === 'NotStarted') {
        await axiosInstanceProfileInfo.patch(
          `/users/profile/goals/${createdPost.goalId}`,
          { progress: 'InProgress' },
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );

        goal.progress = 'InProgress';
      }
    }

    let skills = [];
    if (createdPost.skillIds?.length > 0) {
      const responseSkills = await axiosInstanceProfileInfo.post(`/skills/check-skills`, createdPost.skillIds);
      skills = responseSkills.data;
    }

    return {
      ...createdPost,
      goal,
      skills,
    };
  } catch (error) {
    throw handleError(error.response?.data || {});
  }
}

export async function updatePost(updatedPost) {
  try {
    const response = await axiosInstancePosts.patch(
      `/posts/${updatedPost.id}`,
      {
        content: updatedPost.content,
        type: 'TextPost',
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
        .then(res => res.data);

      if (updatedPost.isCompleteGoal) {
        await axiosInstanceProfileInfo.patch(
          `/users/profile/goals/${updatedPostData.goalId}`,
          { progress: 'Completed' },
          { headers: { Authorization: `Bearer ${accessToken}` }
        });

        goal.progress = 'Completed';
      }
    }

    let skills = [];
    if (updatedPostData.skillIds.length > 0) {
      const responseSkills = await axiosInstanceProfileInfo.post(`/skills/check-skills`, updatedPostData.skillIds, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      skills = responseSkills.data;
    }

    return {
      ...updatedPostData,
      goal,
      skills,
    };
  } catch (error) {
    throw handleError(error.response?.data || {});
  }
}

export async function deletePost(postId) {
  try {
    await axiosInstancePosts.delete(`/posts/${postId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  } catch (error) {
    throw handleError(error.response?.data || {});
  }
}
