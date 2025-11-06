<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Header -->
    <header class="sticky top-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <UContainer class="py-3">
        <div class="flex items-center justify-between">
          <!-- Logo -->
          <NuxtLink to="/" class="flex items-center gap-2">
            <UIcon name="i-heroicons-code-bracket" class="w-8 h-8 text-primary" />
            <span class="text-xl font-bold">AlbDev</span>
          </NuxtLink>

          <!-- Navigation Links -->
          <nav class="flex items-center gap-4">
            <NuxtLink to="/trending" class="text-sm hover:text-primary">Trending</NuxtLink>
            <NuxtLink to="/projects" class="text-sm hover:text-primary">Projects</NuxtLink>
            <NuxtLink to="/jobs" class="text-sm hover:text-primary">Jobs</NuxtLink>
            <NuxtLink to="/events" class="text-sm hover:text-primary">Events</NuxtLink>
            <NuxtLink to="/search" class="text-sm hover:text-primary">
              <UIcon name="i-heroicons-magnifying-glass" class="w-5 h-5" />
            </NuxtLink>
          </nav>

          <!-- Actions -->
          <div class="flex items-center gap-3">
            <template v-if="user">
              <UButton
                to="/notifications"
                icon="i-heroicons-bell"
                variant="ghost"
                size="sm"
              />
              <UButton
                to="/submit"
                icon="i-heroicons-plus"
                color="primary"
                size="sm"
              />
              <UDropdown :items="userMenuItems">
                <UAvatar
                  :src="user.avatarUrl"
                  :alt="user.displayName"
                  size="sm"
                  class="cursor-pointer"
                />
              </UDropdown>
            </template>
            <template v-else>
              <UModal>
                <UButton
                  variant="ghost"
                  label="Log In"
                />
                <template #content>
                  <AuthForm />
                </template>
              </UModal>
              <UModal>
                <UButton
                  color="primary"
                  label="Sign Up"
                />
                <template #content>
                  <AuthForm />
                </template>
              </UModal>
            </template>
          </div>
        </div>
      </UContainer>
    </header>

    <!-- Main Content -->
    <main>
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
const { user, signOut } = useAuth()

const userMenuItems = computed(() => [
  [{
    label: 'Profile',
    icon: 'i-heroicons-user',
    to: `/u/${user.value?.username}`
  }, {
    label: 'My Projects',
    icon: 'i-heroicons-cube',
    to: '/projects'
  }],
  [{
    label: 'Settings',
    icon: 'i-heroicons-cog-6-tooth',
    to: '/settings/profile'
  }, {
    label: 'Notifications',
    icon: 'i-heroicons-bell',
    to: '/notifications'
  }],
  [{
    label: 'Sign Out',
    icon: 'i-heroicons-arrow-right-on-rectangle',
    click: signOut
  }]
])

// Initialize auth on mount
onMounted(() => {
  const { initAuth } = useAuth()
  initAuth()
})
</script>
