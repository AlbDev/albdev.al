<template>
  <UContainer class="py-8">
    <h1 class="text-3xl font-bold mb-6">Trending</h1>

    <UTabs :items="tabs" v-model="activeTab">
      <template #posts>
        <div class="space-y-4">
          <PostCard v-for="post in trendingPosts" :key="post.id" :post="post" />
        </div>
      </template>

      <template #projects>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ProjectCard v-for="project in trendingProjects" :key="project.id" :project="project" />
        </div>
      </template>

      <template #users>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <UCard v-for="user in trendingUsers" :key="user.id" class="hover:border-primary cursor-pointer" @click="navigateTo(`/u/${user.username}`)">
            <div class="flex items-center gap-4">
              <UAvatar :alt="user.displayName" size="lg" :src="user.avatarUrl" />
              <div>
                <h3 class="font-semibold">{{ user.displayName }}</h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">u/{{ user.username }}</p>
                <UBadge color="purple" variant="soft" class="mt-1">{{ user.reputation }} rep</UBadge>
              </div>
            </div>
          </UCard>
        </div>
      </template>
    </UTabs>
  </UContainer>
</template>

<script setup lang="ts">
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore'

const { $firestore } = useNuxtApp()

const activeTab = ref(0)
const trendingPosts = ref([])
const trendingProjects = ref([])
const trendingUsers = ref([])

const tabs = [
  { label: 'Posts', value: 'posts', slot: 'posts' },
  { label: 'Projects', value: 'projects', slot: 'projects' },
  { label: 'Users', value: 'users', slot: 'users' },
]

onMounted(async () => {
  // Load trending posts
  const postsQuery = query(
    collection($firestore, 'posts'),
    orderBy('upvotes', 'desc'),
    limit(20)
  )
  const postsSnapshot = await getDocs(postsQuery)
  trendingPosts.value = postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))

  // Load trending users
  const usersQuery = query(
    collection($firestore, 'users'),
    orderBy('reputation', 'desc'),
    limit(12)
  )
  const usersSnapshot = await getDocs(usersQuery)
  trendingUsers.value = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
})

useHead({ title: 'Trending - AlbDev' })
</script>
