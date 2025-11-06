<template>
  <UCard class="hover:border-primary cursor-pointer" @click="navigateTo(`/projects/${project.id}`)">
    <img
      v-if="project.imageUrls && project.imageUrls[0]"
      :src="project.imageUrls[0]"
      :alt="project.title"
      class="w-full h-48 object-cover rounded-lg mb-4"
    />
    <h3 class="text-lg font-semibold mb-2">{{ project.title }}</h3>
    <p class="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
      {{ project.description }}
    </p>
    <div class="flex gap-2 flex-wrap">
      <UBadge v-for="tech in project.techStack?.slice(0, 3)" :key="tech" color="purple" variant="soft">
        {{ tech }}
      </UBadge>
    </div>
  </UCard>
</template>

<script setup lang="ts">
defineProps<{ project: any }>()
</script>
