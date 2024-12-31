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
                <path
                    d="M16 4a5.95 5.95 0 0 0-3.89 1.7l-.12.11-.12-.11A5.96 5.96 0 0 0 7.73 4 5.73 5.73 0 
                    0 0 2 9.72c0 3.08 1.13 4.55 6.18 8.54l2.69 2.1c.66.52 1.6.52 2.26 0l2.36-1.84.94-.74c4.53-3.64 
                    5.57-5.1 5.57-8.06A5.73 5.73 0 0 0 16.27 4zm.27 1.8a3.93 3.93 0 0 1 3.93 3.92v.3c-.08 2.15-1.07 
                    3.33-5.51 6.84l-2.67 2.08a.04.04 0 0 1-.04 0L9.6 17.1l-.87-.7C4.6 13.1 3.8 11.98 3.8 9.73A3.93 
                    3.93 0 0 1 7.73 5.8c1.34 0 2.51.62 3.57 1.92a.9.9 0 0 0 1.4-.01c1.04-1.3 2.2-1.91 3.57-1.91z" 
                />
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
                <g>
                    <path 
                    d="M2.808 1.393l18.384 18.385-1.414 1.414-3.747-3.747L12 21.485 3.52 12.993c-2.04-2.284-2.028-5.753.034-8.023L1.393 
                    2.808l1.415-1.415zm17.435 3.364c2.262 2.268 2.34 5.88.236 8.236l-1.635 1.636L7.26 3.046c1.67-.207 3.408.288 4.741 
                    1.483 2.349-2.109 5.979-2.039 8.242.228z" />
                </g>     
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
            type: Number,
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
            .then(data => {
                console.log('Reaction sent:', data);
            })
            .catch(error => {
                console.error('Error sending reaction:', error);
            });
        },
        fetchReactions() {
            console.log(`Fetching reactions for post ${this.postId}`);
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