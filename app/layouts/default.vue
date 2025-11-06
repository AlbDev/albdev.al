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

          <!-- Search -->
          <div class="flex-1 max-w-2xl mx-8">
            <UInput
              placeholder="Search communities, posts..."
              icon="i-heroicons-magnifying-glass"
              size="lg"
            />
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-3">
            <template v-if="user">
              <UButton
                to="/submit"
                icon="i-heroicons-plus"
                color="primary"
                label="Create Post"
              />
              <UDropdown :items="userMenuItems">
                <UAvatar
                  :src="user.photoURL"
                  :alt="user.displayName"
                  size="md"
                  class="cursor-pointer"
                />
              </UDropdown>
            </template>
            <template v-else>
              <UButton
                @click="showAuthModal = true"
                variant="ghost"
                label="Log In"
              />
              <UButton
                @click="showAuthModal = true"
                color="primary"
                label="Sign Up"
              />
            </template>
          </div>
        </div>
      </UContainer>
    </header>

    <!-- Main Content -->
    <main>
      <slot />
    </main>

    <!-- Auth Modal -->
    <UModal v-model="showAuthModal">
      <AuthForm @close="showAuthModal = false" />
    </UModal>
  </div>
</template>

<script setup lang="ts">
const { user, signOut } = useAuth()
const showAuthModal = ref(false)

const userMenuItems = [
  [{
    label: 'Profile',
    icon: 'i-heroicons-user',
    to: `/u/${user.value?.displayName}`
  }],
  [{
    label: 'Settings',
    icon: 'i-heroicons-cog-6-tooth'
  }],
  [{
    label: 'Sign Out',
    icon: 'i-heroicons-arrow-right-on-rectangle',
    click: signOut
  }]
]

// Initialize auth on mount
onMounted(() => {
  const { initAuth } = useAuth()
  initAuth()
})
</script>
