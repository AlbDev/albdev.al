<template>
  <UContainer class="py-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold">Projects</h1>
      <UButton
        v-if="user"
        to="/projects/new"
        icon="i-heroicons-plus"
        label="New Project"
        color="primary"
      />
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <ProjectCard v-for="project in projects" :key="project.id" :project="project" />
    </div>

    <p v-if="projects.length === 0" class="text-center text-gray-500 py-12">
      No projects yet. Be the first to share your project!
    </p>
  </UContainer>
</template>

<script setup lang="ts">
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore'

const { $firestore } = useNuxtApp()
const { user } = useAuth()

const projects = ref([])

onMounted(async () => {
  const projectsQuery = query(
    collection($firestore, 'projects'),
    orderBy('createdAt', 'desc'),
    limit(50)
  )

  const projectsSnapshot = await getDocs(projectsQuery)
  projects.value = projectsSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }))
})

useHead({ title: 'Projects - AlbDev' })
</script>
