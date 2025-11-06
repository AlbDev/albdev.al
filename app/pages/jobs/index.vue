<template>
  <UContainer class="py-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold">Job Board</h1>
      <UButton
        v-if="user"
        to="/jobs/new"
        icon="i-heroicons-plus"
        label="Post a Job"
        color="primary"
      />
    </div>

    <div class="space-y-4">
      <UCard v-for="job in jobs" :key="job.id" class="hover:border-primary cursor-pointer" @click="navigateTo(`/jobs/${job.id}`)">
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <h3 class="text-xl font-semibold mb-1">{{ job.title }}</h3>
            <p class="text-gray-600 dark:text-gray-400 mb-2">{{ job.companyName }}</p>
            <p class="text-sm line-clamp-2 mb-3">{{ job.description }}</p>
            <div class="flex gap-2 flex-wrap">
              <UBadge color="teal">{{ job.type }}</UBadge>
              <UBadge color="gray">{{ job.location }}</UBadge>
              <UBadge v-if="job.salary" color="green">${{ job.salary.min }}-${{ job.salary.max }}/mo</UBadge>
            </div>
          </div>
        </div>
      </UCard>

      <p v-if="jobs.length === 0" class="text-center text-gray-500 py-12">
        No job listings yet
      </p>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore'

const { $firestore } = useNuxtApp()
const { user } = useAuth()

const jobs = ref([])

onMounted(async () => {
  const jobsQuery = query(
    collection($firestore, 'jobs'),
    where('isActive', '==', true),
    orderBy('createdAt', 'desc')
  )

  const jobsSnapshot = await getDocs(jobsQuery)
  jobs.value = jobsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
})

useHead({ title: 'Jobs - AlbDev' })
</script>
