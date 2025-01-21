import { createAxiosInstance } from "./axiosInstance";

export async function addProgrammingCategoryWithSkills() {
    const axiosInstance = createAxiosInstance();
    const accessToken = localStorage.getItem('accessToken');

    try {
        const categoryResponse = await axiosInstance.post('/categories', {
            name: "Programming"
        }, {
            headers: { 
                Authorization: `Bearer ${accessToken}` 
            },
        });

        const categoryId = categoryResponse.data.id;

        const skills = ["C#", "Python", "Java", "JavaScript", "Vue.js", "React", "GO"];

        for (const skill of skills) {
            await axiosInstance.post(`/categories/${categoryId}/skills`, { name: skill }, {
                headers: { 
                    Authorization: `Bearer ${accessToken}` 
                },
            });
        }

        console.log('Все навыки успешно добавлены.');

    } catch (error) {
        console.error('Произошла ошибка:', error);
    }
}
