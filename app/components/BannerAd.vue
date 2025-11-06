<template>
  <div class="relative bg-gradient-to-r from-purple-500 to-teal-500 rounded-lg overflow-hidden">
    <div class="absolute top-2 right-2 z-10">
      <UBadge color="white" variant="soft" size="xs">Ad</UBadge>
    </div>

    <a
      :href="banner.targetUrl"
      target="_blank"
      rel="noopener noreferrer"
      class="block"
    >
      <img
        v-if="banner.imageUrl"
        :src="banner.imageUrl"
        :alt="banner.title"
        class="w-full h-full object-cover"
      />
      <div v-else class="p-8 text-center text-white">
        <h3 class="text-2xl font-bold mb-2">{{ banner.title }}</h3>
        <p class="text-lg opacity-90">{{ banner.description }}</p>
      </div>
    </a>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  banner: {
    title: string
    description?: string
    imageUrl?: string
    targetUrl: string
  }
}>()
</script>
