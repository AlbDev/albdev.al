<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'AlbDev',
  description: 'Albanian Developer Community',
  ogTitle: 'AlbDev',
  ogDescription: 'Albanian Developer Community - Share, discuss, and learn together',
  ogImage: '/og-image.png',
  twitterCard: 'summary_large_image'
})
</script>
