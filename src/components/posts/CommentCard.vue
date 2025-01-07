<template>
    <div class="block">
        <UserCard 
            class="scale-90 origin-left" 
            :userId="comment.userId"
        />
        <p class="text-gray-700 dark:text-gray-300 break-words overflow-hidden">{{ comment.content }}</p>
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
    data () {
        return {

        };
    }
}
</script>