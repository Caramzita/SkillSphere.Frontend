<template>
    <div class="reactions flex items-center justify-between">
      <div class="reactions-buttons flex items-center gap-4">
        <button 
            @click="toggleLike" 
            class="reaction-button flex items-center gap-1 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">
            <svg 
                class="w-6 h-6" 
                :fill="isLiked ? 'currentColor' : 'none'" 
                fill-rule="nonzero"
                stroke="currentColor"
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
                :style="{ opacity: isLiked || likes > 0 ? 1 : 0.5 }">
                <path xmlns="http://www.w3.org/2000/svg" d="M15.7 4C18.87 4 21 6.98 21 9.76C21 15.39 
                    12.16 20 12 20C11.84 20 3 15.39 3 9.76C3 6.98 5.13 4 8.3 4C10.12 4 11.31 4.91 12 5.71C12.69 4.91 13.88 4 15.7 4Z" 
                    stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>{{ likes }}</span>
        </button>
        <button 
            @click="toggleDislike" 
            class="reaction-button flex items-center gap-1 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400">
            <svg 
                class="w-6 h-6" 
                :fill="isDisliked ? 'currentColor' : 'none'" 
                fill-rule="nonzero"
                d="M0 0H24V24H0z"
                stroke="currentColor" 
                stroke-width="1.5" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
                :style="{ opacity: isDisliked || dislikes > 0 ? 1 : 0.5 }">
                <path xmlns="http://www.w3.org/2000/svg" 
                    d="M12 6.00011L14 8.00011L10 10.0001L13 13.0001M12 6.00011C10.2006 3.90309 7.19377 
                    3.25515 4.93923 5.17539C2.68468 7.09563 2.36727 10.3062 4.13778 12.5772C5.60984 14.4655 
                    10.0648 18.4479 11.5249 19.7369C11.6882 19.8811 11.7699 19.9532 11.8652 19.9816C11.9483 
                    20.0063 12.0393 20.0063 12.1225 19.9816C12.2178 19.9532 12.2994 19.8811 12.4628 19.7369C13.9229 
                    18.4479 18.3778 14.4655 19.8499 12.5772C21.6204 10.3062 21.3417 7.07543 19.0484 5.17539C16.7551 
                    3.27535 13.7994 3.90309 12 6.00011Z" 
                    stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>    
            </svg>
            <span>{{ dislikes }}</span>
        </button>
      </div>
      <button 
        @click="openComments"
        class="comments-button text-gray-700 dark:text-gray-300 hover:text-gray-600 dark:hover:text-gray-400">
        <span>{{ commentsCount }} comments</span>
      </button>
    </div>
</template>

<script>
export default {
    name: 'PostReactions',
    props: {
        postId: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            isLiked: false,
            isDisliked: false,
            likes: 0,
            dislikes: 0,
            commentsCount: 0
        };
    },
    methods: {
        toggleLike() {
            if (this.isLiked) {
                this.isLiked = false;
                this.likes--;
            } else {
                this.isLiked = true;
                this.likes++;
                if (this.isDisliked) {
                    this.isDisliked = false;
                    this.dislikes--;
                }
            }
            this.sendReaction(this.isLiked ? 'Like' : 'None');
        },
        toggleDislike() {
            if (this.isDisliked) {
                this.isDisliked = false;
                this.dislikes--;
            } else {
                this.isDisliked = true;
                this.dislikes++;
                if (this.isLiked) {
                    this.isLiked = false;
                    this.likes--;
                }
            }
            this.sendReaction(this.isDisliked ? 'Dislike' : 'None');
        },
        sendReaction(type) {
            fetch(`/post/${this.postId}/reactions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ type })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
        },
        fetchReactions() {
            this.likes = Math.floor(Math.random() * 100); // Пример
            this.dislikes = Math.floor(Math.random() * 50); // Пример
            this.commentsCount = Math.floor(Math.random() * 20); // Пример
        }
    },
    mounted() {
        this.fetchReactions();
    }
};
</script>