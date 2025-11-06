<template>
  <UContainer class="py-8">
    <div class="grid grid-cols-12 gap-6">
      <!-- Main Feed -->
      <div class="col-span-12 lg:col-span-8">
        <!-- Feed Filters -->
        <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-4">
          <div class="flex gap-4">
            <UButton
              v-for="filter in feedFilters"
              :key="filter.value"
              :variant="selectedFilter === filter.value ? 'solid' : 'ghost'"
              :icon="filter.icon"
              :label="filter.label"
              @click="selectedFilter = filter.value"
            />
          </div>
        </div>

        <!-- Posts -->
        <div class="space-y-4">
          <PostCard
            v-for="post in posts"
            :key="post.id"
            :post="post"
          />

          <div v-if="pending" class="flex justify-center py-8">
            <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin" />
          </div>

          <div v-if="!pending && posts.length === 0" class="text-center py-12">
            <UIcon name="i-heroicons-document-text" class="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p class="text-gray-500">No posts yet. Be the first to post!</p>
          </div>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="col-span-12 lg:col-span-4">
        <!-- Create Post Card -->
        <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-4">
          <h3 class="text-lg font-semibold mb-4">Welcome to AlbDev</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Join the Albanian developer community. Share your projects, ask questions, and connect with fellow developers.
          </p>
          <UButton
            to="/submit"
            block
            color="primary"
            label="Create Post"
            icon="i-heroicons-pencil-square"
          />
        </div>

        <!-- Popular Communities -->
        <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 class="text-lg font-semibold mb-4">Popular Communities</h3>
          <div class="space-y-3">
            <CommunityCard
              v-for="community in communities"
              :key="community.id"
              :community="community"
              compact
            />
          </div>
          <UButton
            to="/communities"
            variant="ghost"
            block
            class="mt-4"
            label="View All"
          />
        </div>
      </div>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore'

definePageMeta({
  layout: 'default'
})

const selectedFilter = ref('hot')
const feedFilters = [
  { value: 'hot', label: 'Hot', icon: 'i-heroicons-fire' },
  { value: 'new', label: 'New', icon: 'i-heroicons-sparkles' },
  { value: 'top', label: 'Top', icon: 'i-heroicons-arrow-trending-up' }
]

const { $firestore } = useNuxtApp()
const posts = ref([])
const communities = ref([])
const pending = ref(true)

// Fetch posts from Firestore
onMounted(async () => {
  try {
    const postsQuery = query(
      collection($firestore, 'posts'),
      orderBy('createdAt', 'desc'),
      limit(25)
    )
    const postsSnapshot = await getDocs(postsQuery)
    posts.value = postsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    // Fetch communities
    const communitiesQuery = query(
      collection($firestore, 'communities'),
      orderBy('memberCount', 'desc'),
      limit(10)
    )
    const communitiesSnapshot = await getDocs(communitiesQuery)
    communities.value = communitiesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  } catch (error) {
    console.error('Error fetching data:', error)
  } finally {
    pending.value = false
  }
})
</script>
