<template>
  <UContainer class="py-8">
    <div v-if="loading" class="flex justify-center py-12">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-primary" />
    </div>

    <div v-else-if="profile" class="space-y-6">
      <!-- Profile Header -->
      <UCard>
        <div class="flex items-start gap-6">
          <UAvatar :alt="profile.displayName" size="3xl" :src="profile.avatarUrl" />
          <div class="flex-1">
            <div class="flex items-center justify-between">
              <div>
                <h1 class="text-3xl font-bold">{{ profile.displayName }}</h1>
                <p class="text-gray-600 dark:text-gray-400">u/{{ profile.username }}</p>
              </div>
              <UButton
                v-if="isOwnProfile"
                to="/settings/profile"
                icon="i-heroicons-pencil"
                label="Edit Profile"
              />
            </div>

            <p v-if="profile.bio" class="mt-4 text-gray-700 dark:text-gray-300">{{ profile.bio }}</p>

            <div class="flex gap-6 mt-4 text-sm">
              <div v-if="profile.location" class="flex items-center gap-1">
                <UIcon name="i-heroicons-map-pin" />
                {{ profile.location }}
              </div>
              <div v-if="profile.website" class="flex items-center gap-1">
                <UIcon name="i-heroicons-link" />
                <a :href="profile.website" target="_blank" class="text-primary hover:underline">
                  {{ profile.website }}
                </a>
              </div>
            </div>

            <div class="flex gap-4 mt-4">
              <UBadge color="purple">{{ profile.reputation || 0 }} reputation</UBadge>
              <UBadge v-if="profile.githubUsername" color="gray">
                <UIcon name="i-simple-icons-github" class="mr-1" />
                {{ profile.githubUsername }}
              </UBadge>
            </div>
          </div>
        </div>
      </UCard>

      <!-- Tabs -->
      <UTabs :items="tabs" v-model="activeTab">
        <template #posts>
          <div class="space-y-4">
            <PostCard v-for="post in posts" :key="post.id" :post="post" />
            <p v-if="posts.length === 0" class="text-center text-gray-500 py-8">
              No posts yet
            </p>
          </div>
        </template>

        <template #projects>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ProjectCard v-for="project in projects" :key="project.id" :project="project" />
            <p v-if="projects.length === 0" class="col-span-2 text-center text-gray-500 py-8">
              No projects yet
            </p>
          </div>
        </template>

        <template #repos>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <RepoCard v-for="repo in repos" :key="repo.id" :repo="repo" />
            <p v-if="repos.length === 0" class="col-span-2 text-center text-gray-500 py-8">
              No repositories yet
            </p>
          </div>
        </template>
      </UTabs>
    </div>

    <div v-else class="text-center py-12">
      <UIcon name="i-heroicons-user-circle" class="w-16 h-16 mx-auto mb-4 text-gray-400" />
      <p class="text-gray-600 dark:text-gray-400">User not found</p>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore'

const route = useRoute()
const { $firestore } = useNuxtApp()
const { user } = useAuth()

const profile = ref(null)
const posts = ref([])
const projects = ref([])
const repos = ref([])
const loading = ref(true)
const activeTab = ref(0)

const tabs = [
  { label: 'Posts', value: 'posts', slot: 'posts' },
  { label: 'Projects', value: 'projects', slot: 'projects' },
  { label: 'Repositories', value: 'repos', slot: 'repos' },
]

const isOwnProfile = computed(() =>
  user.value?.username === route.params.username
)

onMounted(async () => {
  const username = route.params.username as string

  // Find user by username
  const usersQuery = query(
    collection($firestore, 'users'),
    where('username', '==', username),
    limit(1)
  )

  const usersSnapshot = await getDocs(usersQuery)

  if (!usersSnapshot.empty) {
    const userDoc = usersSnapshot.docs[0]
    profile.value = { id: userDoc.id, ...userDoc.data() }

    // Load posts
    const postsQuery = query(
      collection($firestore, 'posts'),
      where('authorId', '==', profile.value.uid),
      orderBy('createdAt', 'desc'),
      limit(20)
    )

    const postsSnapshot = await getDocs(postsQuery)
    posts.value = postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))

    // Load projects
    const projectsQuery = query(
      collection($firestore, 'projects'),
      where('userId', '==', profile.value.uid),
      orderBy('createdAt', 'desc'),
      limit(10)
    )

    const projectsSnapshot = await getDocs(projectsQuery)
    projects.value = projectsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  }

  loading.value = false
})

useHead({
  title: computed(() => profile.value ? `${profile.value.displayName} (u/${profile.value.username})` : 'User Profile'),
})
</script>
