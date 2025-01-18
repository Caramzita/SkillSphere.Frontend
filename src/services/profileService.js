import { createAxiosInstance } from "./axiosInstance";

const axiosInstance = createAxiosInstance();
const accessToken = localStorage.getItem('accessToken');

export async function loadGoals() {
    try {
      const response = await axiosInstance.get("/users/profile/goals", {
        headers: { 
          Authorization: `Bearer ${accessToken}` 
        },
      });
      
      return response.data.map((goal) => ({
        id: goal.id,
        title: goal.title,
      }));
    } catch (error) {
      console.error("Ошибка загрузки целей:", error);
      return [];
    }
}

export async function loadSkills() {
    try {
        const response = await axiosInstance.get("/users/profile/skills", {
        headers: { Authorization: `Bearer ${accessToken}` },
        });

        return response.data.map((skill) => ({
            id: skill.skillId,
            name: skill.skillName,
        }));
    } catch (error) {
        console.error("Ошибка загрузки навыков:", error);
        return [];
    }
}

export async function loadCategoriesAndSkills() {
  try {
    const response = await axiosInstance.get("/categories");
    
    return response.data.map((category) => ({
      ...category,
      skills: category.skills || [],
    }));
  } catch (error) {
    console.error("Ошибка загрузки категорий и навыков:", error);
    return [];
  }
}