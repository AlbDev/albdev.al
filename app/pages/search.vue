<template>
  <UContainer class="py-8">
    <div class="max-w-4xl mx-auto space-y-6">
      <UFormField label="Search">
        <UInput
          v-model="searchQuery"
          size="lg"
          icon="i-heroicons-magnifying-glass"
          placeholder="Search posts, users, projects..."
          @keyup.enter="performSearch"
        />
      </UFormField>

      <UTabs :items="tabs" v-model="activeTab">
        <template #posts>
          <div class="space-y-4">
            <PostCard v-for="post in searchResults.posts" :key="post.id" :post="post" />
            <p v-if="searchResults.posts.length === 0" class="text-center text-gray-500 py-8">
              No posts found
            </p>
          </div>
        </template>

        <template #users>
          <div class="space-y-4">
            <UCard v-for="user in searchResults.users" :key="user.id" class="hover:border-primary cursor-pointer" @click="navigateTo(`/u/${user.username}`)">
              <div class="flex items-center gap-4">
                <UAvatar :alt="user.displayName" size="lg" :src="user.avatarUrl" />
                <div>
                  <h3 class="font-semibold">{{ user.displayName }}</h3>
                  <p class="text-sm text-gray-600 dark:text-gray-400">u/{{ user.username }}</p>
                  <p v-if="user.bio" class="text-sm mt-1">{{ user.bio }}</p>
                </div>
              </div>
            </UCard>
            <p v-if="searchResults.users.length === 0" class="text-center text-gray-500 py-8">
              No users found
            </p>
          </div>
        </template>

        <template #projects>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ProjectCard v-for="project in searchResults.projects" :key="project.id" :project="project" />
            <p v-if="searchResults.projects.length === 0" class="col-span-2 text-center text-gray-500 py-8">
              No projects found
            </p>
          </div>
        </template>
      </UTabs>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
const searchQuery = ref('')
const activeTab = ref(0)
const searchResults = ref({ posts: [], users: [], projects: [] })

const tabs = [
  { label: 'Posts', value: 'posts', slot: 'posts' },
  { label: 'Users', value: 'users', slot: 'users' },
  { label: 'Projects', value: 'projects', slot: 'projects' },
]

const performSearch = () => {
  // Simple client-side search for now
  console.log('Searching for:', searchQuery.value)
  // In production, this would query Firestore or use Algolia/MeiliSearch
}

useHead({ title: 'Search - AlbDev' })
</script>
