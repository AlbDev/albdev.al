<template>
  <UContainer class="py-8 max-w-2xl">
    <h1 class="text-3xl font-bold mb-6">Edit Profile</h1>

    <UCard>
      <form @submit.prevent="saveProfile" class="space-y-6">
        <UFormField label="Display Name">
          <UInput v-model="formData.displayName" placeholder="Your name" />
        </UFormField>

        <UFormField label="Bio">
          <UTextarea v-model="formData.bio" rows="4" placeholder="Tell us about yourself" />
        </UFormField>

        <UFormField label="Location">
          <UInput v-model="formData.location" placeholder="City, Country" />
        </UFormField>

        <UFormField label="Website">
          <UInput v-model="formData.website" type="url" placeholder="https://example.com" />
        </UFormField>

        <UFormField label="GitHub Username">
          <UInput v-model="formData.githubUsername" placeholder="yourusername" />
        </UFormField>

        <UFormField label="Twitter Handle">
          <UInput v-model="formData.twitterHandle" placeholder="@yourusername" />
        </UFormField>

        <div class="flex gap-3">
          <UButton type="submit" :loading="loading" label="Save Changes" color="primary" />
          <UButton :to="`/u/${user?.username}`" variant="ghost" label="Cancel" />
        </div>
      </form>
    </UCard>
  </UContainer>
</template>

<script setup lang="ts">
import { doc, updateDoc } from 'firebase/firestore'

definePageMeta({
  middleware: 'auth'
})

const { user } = useAuth()
const { $firestore } = useNuxtApp()

const loading = ref(false)
const formData = reactive({
  displayName: user.value?.displayName || '',
  bio: user.value?.bio || '',
  location: user.value?.location || '',
  website: user.value?.website || '',
  githubUsername: user.value?.githubUsername || '',
  twitterHandle: user.value?.twitterHandle || '',
})

const saveProfile = async () => {
  if (!user.value) return

  loading.value = true

  try {
    const userRef = doc($firestore, 'users', user.value.uid)
    await updateDoc(userRef, {
      ...formData,
      updatedAt: new Date().toISOString()
    })

    // Update local storage
    const storedUser = JSON.parse(localStorage.getItem('albdev_user') || '{}')
    localStorage.setItem('albdev_user', JSON.stringify({ ...storedUser, ...formData }))

    navigateTo(`/u/${user.value.username}`)
  } catch (error) {
    console.error('Failed to update profile:', error)
    alert('Failed to update profile')
  } finally {
    loading.value = false
  }
}

useHead({ title: 'Edit Profile - AlbDev' })
</script>
