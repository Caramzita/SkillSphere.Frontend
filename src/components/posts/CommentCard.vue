<template>
    <div class="block">
        <UserCard 
            class="scale-90 origin-left" 
            :userId="comment.userId"
        />
        <p
            v-for="(paragraph, index) in paragraphs"
            :key="index"
            class="text-gray-700 dark:text-gray-300 break-words overflow-hidden"
        >
            {{ paragraph }}
        </p>
    </div> 
</template>

<script>
import UserCard from '../profile/UserCard.vue';

export default {
    name: 'PostComments',
    props: {
      comment: {
        type: Object,
        required: true,
      },
    },
    components: {
        UserCard,
    },
    computed: {
        paragraphs() {
            return this.comment.content.split('\n').filter(line => line.trim().length > 0);
        },
    },
}
</script>