<template>
  <UContainer class="py-8 max-w-4xl">
    <UCard>
      <template #header>
        <h1 class="text-2xl font-bold">Create a Post</h1>
      </template>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Community Selection -->
        <UFormField label="Community" required>
          <USelect
            v-model="formData.communityId"
            :options="communityOptions"
            placeholder="Choose a community"
          />
        </UFormField>

        <!-- Post Type Tabs -->
        <div class="flex gap-2 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
          <button
            v-for="type in postTypes"
            :key="type.value"
            type="button"
            class="px-4 py-2 font-medium transition-colors whitespace-nowrap flex items-center gap-2"
            :class="formData.type === type.value
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            "
            @click="formData.type = type.value"
          >
            <UIcon :name="type.icon" />
            {{ type.label }}
          </button>
        </div>

        <!-- Title -->
        <UFormField label="Title" required>
          <UInput
            v-model="formData.title"
            placeholder="An interesting title"
            maxlength="300"
          />
          <template #hint>
            <span class="text-xs">{{ formData.title.length }}/300</span>
          </template>
        </UFormField>

        <!-- Content based on type -->
        <template v-if="formData.type === 'text'">
          <UFormField label="Text (optional)">
            <UTextarea
              v-model="formData.content"
              rows="10"
              placeholder="Text (optional)"
            />
          </UFormField>
        </template>

        <template v-else-if="formData.type === 'link'">
          <UFormField label="URL" required>
            <UInput
              v-model="formData.url"
              type="url"
              placeholder="https://example.com"
            />
          </UFormField>
        </template>

        <template v-else-if="formData.type === 'image'">
          <UFormField label="Image URL" required>
            <UInput
              v-model="formData.url"
              type="url"
              placeholder="https://example.com/image.jpg"
            />
          </UFormField>
        </template>

        <template v-else-if="formData.type === 'code'">
          <div class="space-y-4">
            <div v-for="(snippet, index) in formData.codeSnippets" :key="index" class="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div class="flex justify-between items-center mb-3">
                <h3 class="font-semibold">File {{ index + 1 }}</h3>
                <UButton
                  v-if="formData.codeSnippets.length > 1"
                  @click="removeCodeSnippet(index)"
                  icon="i-heroicons-trash"
                  color="error"
                  variant="ghost"
                  size="sm"
                />
              </div>
              <CodeEditor
                :filename="snippet.filename"
                :language="snippet.language"
                :code="snippet.code"
                @update="(data) => updateCodeSnippet(index, data)"
              />
            </div>
            <UButton
              @click="addCodeSnippet"
              icon="i-heroicons-plus"
              variant="outline"
              label="Add Another File"
              block
            />
          </div>
        </template>

        <template v-else-if="formData.type === 'repo'">
          <UFormField label="GitHub Repository URL" required>
            <UInput
              v-model="formData.repoUrl"
              type="url"
              placeholder="https://github.com/username/repository"
              @blur="fetchRepoData"
            />
          </UFormField>
          <div v-if="repoData" class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div class="flex items-start gap-3">
              <UIcon name="i-heroicons-code-bracket" class="w-8 h-8 text-primary" />
              <div class="flex-1">
                <h3 class="font-bold">{{ repoData.name }}</h3>
                <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">{{ repoData.description }}</p>
                <div class="flex gap-4 mt-2">
                  <div class="flex items-center gap-1 text-sm">
                    <UIcon name="i-heroicons-star" class="w-4 h-4" />
                    {{ repoData.stargazers_count }}
                  </div>
                  <div class="flex items-center gap-1 text-sm">
                    <UBadge color="teal" variant="soft">{{ repoData.language }}</UBadge>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
const { parseGithubUrl, fetchRepo } = useGithub()
const router = useRouter()

const loading = ref(false)
const communities = ref([])
const repoData = ref(null)

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
  { value: 'image', label: 'Image', icon: 'i-heroicons-photo' },
  { value: 'code', label: 'Code', icon: 'i-heroicons-code-bracket' },
  { value: 'repo', label: 'Repository', icon: 'i-heroicons-cube' },
]

const formData = reactive({
  communityId: '',
  type: 'text' as 'text' | 'link' | 'image' | 'code' | 'repo',
  title: '',
  content: '',
  url: '',
  repoUrl: '',
  codeSnippets: [{
    filename: '',
    language: 'javascript',
    code: ''
  }]
})

const addCodeSnippet = () => {
  formData.codeSnippets.push({
    filename: '',
    language: 'javascript',
    code: ''
  })
}

const removeCodeSnippet = (index: number) => {
  formData.codeSnippets.splice(index, 1)
}

const updateCodeSnippet = (index: number, data: any) => {
  formData.codeSnippets[index] = data
}

const fetchRepoData = async () => {
  if (!formData.repoUrl) return

  const parsed = parseGithubUrl(formData.repoUrl)
  if (!parsed) return

  const data = await fetchRepo(parsed.owner, parsed.repo)
  if (data) {
    repoData.value = data
  }
}

const canSubmit = computed(() => {
  if (!user.value || !formData.communityId || !formData.title) return false
  if (formData.type === 'link' && !formData.url) return false
  if (formData.type === 'image' && !formData.url) return false
  if (formData.type === 'code' && !formData.codeSnippets.some(s => s.code)) return false
  if (formData.type === 'repo' && !formData.repoUrl) return false
  return true
})

const handleSubmit = async () => {
  if (!canSubmit.value || !user.value) return

  loading.value = true

  try {
    const postData: any = {
      title: formData.title,
      content: formData.content || null,
      type: formData.type,
      url: formData.url || null,
      authorId: user.value.uid,
      authorUsername: user.value.username,
      communityId: formData.communityId,
      upvotes: 0,
      downvotes: 0,
      commentCount: 0,
      isDeleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    if (formData.type === 'code') {
      postData.codeSnippets = formData.codeSnippets.filter(s => s.code)
    }

    if (formData.type === 'repo' && repoData.value) {
      postData.repoUrl = formData.repoUrl
      postData.repoData = {
        name: repoData.value.name,
        description: repoData.value.description,
        stars: repoData.value.stargazers_count,
        language: repoData.value.language,
        topics: repoData.value.topics || []
      }
    }

    // Create post in Firestore
    const postRef = await addDoc(collection($firestore, 'posts'), postData)

    // Navigate to post detail page
    router.push(`/p/${postRef.id}`)
  } catch (error) {
    console.error('Failed to create post:', error)
    alert('Failed to create post. Please try again.')
  } finally {
    loading.value = false
  }
}
</script>
