<template>
    <div>
        <h2 class="ml-1 text-xl font-bold text-gray-900 dark:text-white">
            Skills
        </h2>
        <div class="mt-2 flex flex-wrap gap-2">
            <span
                v-for="skill in skills"
                :key="skill.id"
                class="relative px-3 py-1 bg-primary-100 dark:bg-primary-700 text-primary-700 dark:text-white text-sm rounded-full flex items-center group"
            >
                {{ skill.skillName }}
                <button
                    v-if="visible"
                    @click="deleteSkill(skill.skillId)"
                    class="absolute right-0 top-0 transform translate-x-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Remove Skill"
                >
                    <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-3 w-3"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    >
                    <path
                        fill-rule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clip-rule="evenodd"
                    />
                    </svg>
                </button>
            </span>

            <button 
                v-if="visible"
                @click="showModal"
                class="flex items-center justify-center w-10 h-7 bg-green-500 hover:bg-green-600 text-white rounded-full"
                >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
                </svg>
            </button>
        </div>
    </div>
    <AddSkillsModal
        v-if="isVisible"
        :visible="isVisible"
        :errors="errors"
        @close="showModal"
        @save="saveSkills"
    />
</template>

<script>
import AddSkillsModal from './modals/AddSkillsModal.vue';
import { createAxiosInstance } from "@/services/axiosInstance";
import { handleError } from '@/services/errorHandler';

export default {
    components: {
      AddSkillsModal
    },
    props: {
      initialSkills: {
        type: Array,
        default: () => [],
      },
      visible: {
        type: Boolean,
        required: true,
      },
    },
    data() {
        return {
            skills: [...this.initialSkills],
            errors: [],
            isVisible: false,
        };
    },
    watch: {
      initialSkills: {
        immediate: true,
        deep: true,
        handler(newSkills) {
            this.skills = [...newSkills];
        },
      },
    },
    methods: {
        showModal() {
            this.isVisible = !this.isVisible;
        },
        async saveSkills(selectedSkills) {
            const axiosInstance = createAxiosInstance(8084);
            const accessToken = localStorage.getItem('accessToken');

            try {
                const payload = {
                skillIds: selectedSkills,
                };

                const response = await axiosInstance.post('/users/profile/skills', payload, {
                    headers: { 
                        Authorization: `Bearer ${accessToken}` 
                    },
                });

                if (response.status === 200) {
                    console.log(response.data);
                    this.skills.push(...response.data);
                    this.showModal();
                }
            } catch (error) {
                this.errors = handleError(error.response?.data || {});
            }
        },
        async deleteSkill(id) {
            const axiosInstance = createAxiosInstance(8084);
            const accessToken = localStorage.getItem('accessToken');

            try {
                const response = await axiosInstance.delete(`/users/profile/skills/${id}`, {
                    headers: { 
                        Authorization: `Bearer ${accessToken}` 
                    },
                });

                if (response.status === 200) {
                    this.skills = this.skills.filter(skill => skill.skillId !== id);
                }
            } catch (error) {
                this.errors = handleError(error.response?.data || {});
            }
        }
    }
}
</script>