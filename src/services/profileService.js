import { createAxiosInstance } from "./axiosInstance";

export async function loadGoals() {
    const axiosInstance = createAxiosInstance(8084);
    const accessToken = localStorage.getItem('accessToken');

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
    const axiosInstance = createAxiosInstance(8084);
    const accessToken = localStorage.getItem('accessToken');

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