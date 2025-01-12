<template>
    <div class="reactions flex items-center justify-between">
      <div class="reactions-buttons flex items-center gap-4">
        <button 
            @click="toggleReaction('Like')" 
            @mouseenter="isHoverLike = true" 
            @mouseleave="isHoverLike = false"
            class="reaction-button flex items-center gap-1 text-gray-700 dark:text-gray-100 hover:text-gray-500 dark:hover:text-gray-300">
            <svg 
                class="w-6 h-6 transition-colors duration-200" 
                :fill="(isLike || isHoverLike) ? 'rgb(248 113 113)' : 'none'" 
                fill-rule="nonzero"
                stroke="currentColor"
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
                :style="{ opacity: 1, transition: 'fill 0.2s ease, stroke 0.2s ease' }">
                <path xmlns="http://www.w3.org/2000/svg" d="M15.7 4C18.87 4 21 6.98 21 9.76C21 15.39 
                    12.16 20 12 20C11.84 20 3 15.39 3 9.76C3 6.98 5.13 4 8.3 4C10.12 4 11.31 4.91 12 5.71C12.69 4.91 13.88 4 15.7 4Z" 
                    :stroke="isLike ? 'currentColor' : 'dark:white black'"
                    stroke-width="2" 
                    stroke-linecap="round" 
                    stroke-linejoin="round"/>
            </svg>
            <span>{{ likes }}</span>
        </button>
        <button 
            @click="toggleReaction('Dislike')" 
            @mouseenter="isHoverDislike = true" 
            @mouseleave="isHoverDislike = false"
            class="reaction-button flex items-center gap-1 text-gray-700 dark:text-gray-100 hover:text-gray-500 dark:hover:text-gray-300">
            <svg 
                class="w-6 h-6 transition-colors duration-200" 
                :fill="isDislike || isHoverDislike ? 'rgb(248 113 113)' : 'none'" 
                fill-rule="nonzero"
                d="M0 0H24V24H0z"
                stroke="currentColor" 
                stroke-width="1.5" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
                :style="{ opacity: 1 }">
                <path xmlns="http://www.w3.org/2000/svg" 
                    d="M12 6.00011L14 8.00011L10 10.0001L13 13.0001M12 6.00011C10.2006 3.90309 7.19377 
                    3.25515 4.93923 5.17539C2.68468 7.09563 2.36727 10.3062 4.13778 12.5772C5.60984 14.4655 
                    10.0648 18.4479 11.5249 19.7369C11.6882 19.8811 11.7699 19.9532 11.8652 19.9816C11.9483 
                    20.0063 12.0393 20.0063 12.1225 19.9816C12.2178 19.9532 12.2994 19.8811 12.4628 19.7369C13.9229 
                    18.4479 18.3778 14.4655 19.8499 12.5772C21.6204 10.3062 21.3417 7.07543 19.0484 5.17539C16.7551 
                    3.27535 13.7994 3.90309 12 6.00011Z" 
                    :stroke="isLike ? 'currentColor' : 'dark:white black'"
                    stroke-width="2" 
                    stroke-linecap="round" 
                    stroke-linejoin="round"/>    
            </svg>
            <span>{{ dislikes }}</span>
        </button>
      </div>
    </div>
</template>

<script>
import { handleError } from '@/services/errorHandler';
import { createAxiosInstance } from '@/services/axiosInstance';
import { mapGetters } from 'vuex';

export default {
    name: 'PostReactions',
    props: {
        postId: {
            type: String,
            required: true
        }
    },
    computed: {
        ...mapGetters(['currentUser']),
    },
    data() {
        return {
            isHoverDislike: false,
            isHoverLike: false,

            isLike: false,
            isDislike: false,
            likes: 0,
            dislikes: 0,
            currentReactionId: null,
            axiosInstanceReactions: createAxiosInstance(8083),
            accessToken: localStorage.getItem('accessToken'),
        };
    },
    methods: {
        async toggleReaction(reactionType) {
            const oppositeType = reactionType === 'Like' ? 'Dislike' : 'Like';
            if (this[`is${reactionType}`]) {
                this[`is${reactionType}`] = false;
                this[`${reactionType.toLowerCase()}s`]--;
                await this.removeReaction();
            } else {
                this[`is${reactionType}`] = true;
                this[`${reactionType.toLowerCase()}s`]++;
                if (this[`is${oppositeType}`]) {
                    this[`is${oppositeType}`] = false;
                    this[`${oppositeType.toLowerCase()}s`]--;
                }
                await this.sendReaction(reactionType);
            }
        },
        async sendReaction(reactionType) {
            try {
                const { data } = await this.axiosInstanceReactions.post(
                    `/interactions/post/${this.postId}/reactions`, { reactionType: reactionType },
                    {
                        headers: { Authorization: `Bearer ${this.accessToken}` },
                    }
                );
                this.currentReactionId = data.id;
            } catch (error) {
                console.error('Ошибка при отправке реакции:', error);
                this.errors = handleError(error.response?.data || {});
            }
        },
        async removeReaction() {
            if (!this.currentReactionId) return;
            try {
                await this.axiosInstanceReactions.delete(
                    `/interactions/post/${this.postId}/reactions/${this.currentReactionId}`,
                    {
                        headers: { Authorization: `Bearer ${this.accessToken}` },
                    }
                );
                this.currentReactionId = null;
            } catch (error) {
                console.error('Ошибка при удалении реакции:', error);
            }
        },
        async fetchReactions() {
            try {
                const { data } = await this.axiosInstanceReactions.get(
                    `/interactions/posts/${this.postId}/reactions`,
                    {
                        headers: { Authorization: `Bearer ${this.accessToken}` },
                    }
                );

                this.likes = data.filter(reaction => reaction.reactionType === 'Like').length;
                this.dislikes = data.filter(reaction => reaction.reactionType === 'Dislike').length;

                this.isLike = data.some(reaction => reaction.reactionType === 'Like' && reaction.userId === this.currentUser.userId);
                this.isDislike = data.some(reaction => reaction.reactionType === 'Dislike' && reaction.userId === this.currentUser.userId);
            } catch (error) {
                console.error('Ошибка при загрузке реакций:', error);
            }
        }
    },
    mounted() {
        this.fetchReactions();
    }
};
</script>