<template>
  <router-link
    v-if="linkToProfile && user != null"
    :to="`/profile/${user.userId}`"
    class="flex items-center gap-4 transition-colors duration-200 relative hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
  >
    <img
      :src="user.profilePictureUrl || defaultAvatar"
      alt="User avatar"
      class="w-10 h-10 rounded-full object-cover"
    />
    <div>
      <div class="font-medium dark:text-white">
        {{ user.name || 'No Name' }}
      </div>
      <div class="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[200px]">
        {{ (user.bio || 'No bio available').slice(0, 25) + (user.bio && user.bio.length > 20 ? '...' : '') }}
      </div>
    </div>
  </router-link>
</template>
  
<script>
export default {
  name: 'UserCard',
  props: {
      user: {
          type: Object,
          required: true,
      },
      linkToProfile: {
          type: Boolean,
          default: true,
      },
      defaultAvatar: {
          type: String,
          default:
              'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y',
      },
  },
};
</script>
  