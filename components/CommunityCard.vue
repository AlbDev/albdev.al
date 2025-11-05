<template>
  <NuxtLink
    :to="`/r/${community.name}`"
    class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
  >
    <UAvatar
      :src="community.icon"
      :alt="community.displayName"
      size="sm"
    />
    <div class="flex-1 min-w-0">
      <p class="font-semibold truncate">r/{{ community.name }}</p>
      <p class="text-xs text-gray-600 dark:text-gray-400">
        {{ community.memberCount }} members
      </p>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
defineProps<{
  community: any
  compact?: boolean
}>()
</script>
