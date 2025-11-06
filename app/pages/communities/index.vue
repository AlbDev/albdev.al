<template>
  <UContainer class="py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold mb-2">Communities</h1>
      <p class="text-gray-600 dark:text-gray-400">
        Discover and join communities based on your interests
      </p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <USkeleton v-for="i in 6" :key="i" class="h-48" />
    </div>

    <!-- Communities Grid -->
    <div v-else-if="communities.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <UCard
        v-for="community in communities"
        :key="community.id"
        :ui="{ body: { padding: 'p-6' } }"
      >
        <div class="space-y-4">
          <!-- Community Header -->
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <h3 class="text-lg font-bold mb-1">
                {{ community.displayName }}
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                c/{{ community.name }}
              </p>
            </div>
          </div>

          <!-- Description -->
          <p class="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
            {{ community.description }}
          </p>

          <!-- Stats -->
          <div class="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <div class="flex items-center gap-1">
              <UIcon name="i-heroicons-user-group" />
              <span>{{ formatNumber(community.memberCount || 0) }} members</span>
            </div>
          </div>

          <!-- Action Button -->
          <div class="flex gap-2">
            <UButton
              :to="`/c/${community.name}`"
              block
              variant="soft"
              label="View Community"
            />
          </div>
        </div>
      </UCard>
    </div>

    <!-- Empty State -->
    <UCard v-else>
      <div class="text-center py-12">
        <UIcon
          name="i-heroicons-user-group"
          class="w-16 h-16 mx-auto mb-4 text-gray-400"
        />
        <h3 class="text-xl font-semibold mb-2">No Communities Yet</h3>
        <p class="text-gray-600 dark:text-gray-400 mb-6">
          Communities haven't been created yet. Run the seed script to populate communities.
        </p>
        <code class="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded text-sm">
          npm run seed
        </code>
      </div>
    </UCard>
  </UContainer>
</template>

<script setup lang="ts">
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore'

definePageMeta({
  layout: 'default'
})

const { $firestore } = useNuxtApp()
const communities = ref<any[]>([])
const loading = ref(true)

const formatNumber = (num: number) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
  return num.toString()
}

onMounted(async () => {
  try {
    const communitiesQuery = query(
      collection($firestore, 'communities'),
      where('isDeleted', '==', false),
      orderBy('memberCount', 'desc')
    )

    const snapshot = await getDocs(communitiesQuery)
    communities.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  } catch (error) {
    console.error('Error loading communities:', error)
  } finally {
    loading.value = false
  }
})
</script>
