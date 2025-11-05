<template>
  <UContainer class="py-8 max-w-4xl">
    <UCard>
      <template #header>
        <h1 class="text-2xl font-bold">Create a Post</h1>
      </template>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Community Selection -->
        <UFormGroup label="Community" required>
          <USelect
            v-model="formData.communityId"
            :options="communityOptions"
            placeholder="Choose a community"
          />
        </UFormGroup>

        <!-- Post Type Tabs -->
        <div class="flex gap-2 border-b border-gray-200 dark:border-gray-700">
          <button
            v-for="type in postTypes"
            :key="type.value"
            type="button"
            class="px-4 py-2 font-medium transition-colors"
            :class="formData.type === type.value
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            "
            @click="formData.type = type.value"
          >
            <UIcon :name="type.icon" class="mr-2" />
            {{ type.label }}
          </button>
        </div>

        <!-- Title -->
        <UFormGroup label="Title" required>
          <UInput
            v-model="formData.title"
            placeholder="An interesting title"
            maxlength="300"
          />
          <template #hint>
            <span class="text-xs">{{ formData.title.length }}/300</span>
          </template>
        </UFormGroup>

        <!-- Content based on type -->
        <template v-if="formData.type === 'text'">
          <UFormGroup label="Text (optional)">
            <UTextarea
              v-model="formData.content"
              rows="10"
              placeholder="Text (optional)"
            />
          </UFormGroup>
        </template>

        <template v-else-if="formData.type === 'link'">
          <UFormGroup label="URL" required>
            <UInput
              v-model="formData.url"
              type="url"
              placeholder="https://example.com"
            />
          </UFormGroup>
        </template>

        <template v-else-if="formData.type === 'image'">
          <UFormGroup label="Image URL" required>
            <UInput
              v-model="formData.url"
              type="url"
              placeholder="https://example.com/image.jpg"
            />
          </UFormGroup>
        </template>

        <!-- Submit -->
        <div class="flex gap-3 justify-end">
          <UButton
            to="/"
            variant="ghost"
            label="Cancel"
          />
          <UButton
            type="submit"
            color="primary"
            :loading="loading"
            :disabled="!canSubmit"
            label="Post"
          />
        </div>
      </form>
    </UCard>
  </UContainer>
</template>

<script setup lang="ts">
import { collection, addDoc, query, orderBy, limit, getDocs } from 'firebase/firestore'

definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

const { user } = useAuth()
const { $firestore } = useNuxtApp()
const router = useRouter()

const loading = ref(false)
const communities = ref([])

// Fetch communities from Firestore
onMounted(async () => {
  const communitiesQuery = query(
    collection($firestore, 'communities'),
    orderBy('memberCount', 'desc'),
    limit(50)
  )
  const communitiesSnapshot = await getDocs(communitiesQuery)
  communities.value = communitiesSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }))
})

const communityOptions = computed(() =>
  communities.value?.map(c => ({
    label: `r/${c.name}`,
    value: c.id
  })) || []
)

const postTypes = [
  { value: 'text', label: 'Text', icon: 'i-heroicons-document-text' },
  { value: 'link', label: 'Link', icon: 'i-heroicons-link' },
  { value: 'image', label: 'Image', icon: 'i-heroicons-photo' }
]

const formData = reactive({
  communityId: '',
  type: 'text' as 'text' | 'link' | 'image',
  title: '',
  content: '',
  url: ''
})

const canSubmit = computed(() => {
  if (!user.value || !formData.communityId || !formData.title) return false
  if (formData.type === 'link' && !formData.url) return false
  if (formData.type === 'image' && !formData.url) return false
  return true
})

const handleSubmit = async () => {
  if (!canSubmit.value || !user.value) return

  loading.value = true

  try {
    // Create post in Firestore
    const postRef = await addDoc(collection($firestore, 'posts'), {
      title: formData.title,
      content: formData.content || null,
      type: formData.type,
      url: formData.url || null,
      authorId: user.value.uid,
      communityId: formData.communityId,
      upvotes: 0,
      downvotes: 0,
      commentCount: 0,
      isDeleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })

    // Navigate to home page
    router.push('/')
  } catch (error) {
    console.error('Failed to create post:', error)
    alert('Failed to create post. Please try again.')
  } finally {
    loading.value = false
  }
}
</script>
