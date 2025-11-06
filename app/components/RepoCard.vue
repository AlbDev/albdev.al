<template>
  <UCard class="hover:border-primary">
    <div class="flex items-start gap-3">
      <UIcon name="i-heroicons-code-bracket" class="w-8 h-8 text-primary" />
      <div class="flex-1">
        <h3 class="font-semibold mb-1">{{ repo.name }}</h3>
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
          {{ repo.description }}
        </p>
        <div class="flex gap-3 text-sm">
          <div class="flex items-center gap-1">
            <UIcon name="i-heroicons-star" class="w-4 h-4" />
            {{ repo.stars }}
          </div>
          <UBadge v-if="repo.language" color="teal" variant="soft">{{ repo.language }}</UBadge>
        </div>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
defineProps<{ repo: any }>()
</script>
