<template>
  <div class="bg-gradient-to-r from-purple-50 to-teal-50 dark:from-purple-900/20 dark:to-teal-900/20 rounded-lg border-2 border-purple-200 dark:border-purple-700 p-6">
    <div class="flex items-start justify-between mb-3">
      <UBadge color="purple" variant="soft">Sponsored</UBadge>
      <UIcon name="i-heroicons-x-mark" class="w-5 h-5 cursor-pointer text-gray-400 hover:text-gray-600" />
    </div>

    <div class="flex gap-4">
      <img
        v-if="sponsor.imageUrl"
        :src="sponsor.imageUrl"
        :alt="sponsor.title"
        class="w-32 h-32 rounded-lg object-cover"
      />
      <div class="flex-1">
        <h3 class="text-xl font-bold mb-2">{{ sponsor.title }}</h3>
        <p class="text-gray-700 dark:text-gray-300 mb-3">{{ sponsor.description }}</p>
        <UButton
          :to="sponsor.ctaUrl"
          external
          target="_blank"
          :label="sponsor.ctaText || 'Learn More'"
          color="primary"
          size="sm"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  sponsor: {
    title: string
    description: string
    imageUrl?: string
    ctaUrl: string
    ctaText?: string
  }
}>()
</script>
