<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
    <div class="flex">
      <!-- Vote Section -->
      <div class="flex flex-col items-center gap-1 p-2 bg-gray-50 dark:bg-gray-900 rounded-l-lg">
        <UButton
          icon="i-heroicons-arrow-up"
          size="sm"
          variant="ghost"
          :color="userVote === 1 ? 'primary' : 'gray'"
          @click="handleVote(1)"
        />
        <span class="text-sm font-semibold" :class="voteColor">
          {{ voteCount }}
        </span>
        <UButton
          icon="i-heroicons-arrow-down"
          size="sm"
          variant="ghost"
          :color="userVote === -1 ? 'error' : 'gray'"
          @click="handleVote(-1)"
        />
      </div>

      <!-- Content Section -->
      <div class="flex-1 p-4">
        <!-- Post Meta -->
        <div class="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 mb-2">
          <span class="font-semibold">r/{{ post.communityName || 'AlbDev' }}</span>
          <span>•</span>
          <span>Posted by u/{{ post.authorUsername || 'unknown' }}</span>
          <span>•</span>
          <span>{{ formatTimeAgo(post.createdAt) }}</span>
        </div>

        <!-- Post Title -->
        <NuxtLink :to="`/p/${post.id}`" class="block">
          <h3 class="text-lg font-semibold mb-2 hover:text-primary transition-colors">
            <UBadge v-if="post.type !== 'text'" :color="postTypeColor" variant="soft" class="mr-2">
              {{ post.type }}
            </UBadge>
            {{ post.title }}
          </h3>
        </NuxtLink>

        <!-- Content based on type -->
        <div v-if="!showFull" class="mb-3">
          <!-- Text preview -->
          <p v-if="post.type === 'text' && post.content" class="text-gray-700 dark:text-gray-300 line-clamp-3">
            {{ post.content }}
          </p>

          <!-- Link -->
          <a
            v-if="post.type === 'link' && post.url"
            :href="post.url"
            target="_blank"
            class="text-primary hover:underline text-sm flex items-center gap-1"
          >
            {{ post.url }}
            <UIcon name="i-heroicons-arrow-top-right-on-square" class="w-3 h-3" />
          </a>

          <!-- Image -->
          <img
            v-if="post.type === 'image' && post.url"
            :src="post.url"
            :alt="post.title"
            class="rounded-lg max-h-96 object-cover"
          />

          <!-- Code preview -->
          <div v-if="post.type === 'code' && post.codeSnippets && post.codeSnippets[0]">
            <CodeBlock
              :code="post.codeSnippets[0].code.substring(0, 300) + (post.codeSnippets[0].code.length > 300 ? '...' : '')"
              :language="post.codeSnippets[0].language"
              :filename="post.codeSnippets[0].filename"
            />
            <p v-if="post.codeSnippets.length > 1" class="text-sm text-gray-600 dark:text-gray-400 mt-2">
              + {{ post.codeSnippets.length - 1 }} more file(s)
            </p>
          </div>

          <!-- Repository -->
          <div v-if="post.type === 'repo' && post.repoData" class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div class="flex items-start gap-3">
              <UIcon name="i-heroicons-code-bracket" class="w-8 h-8 text-primary mt-1" />
              <div class="flex-1">
                <h4 class="font-semibold">{{ post.repoData.name }}</h4>
                <p class="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">{{ post.repoData.description }}</p>
                <div class="flex gap-4 mt-2 text-sm">
                  <div class="flex items-center gap-1">
                    <UIcon name="i-heroicons-star" class="w-4 h-4" />
                    {{ post.repoData.stars }}
                  </div>
                  <UBadge v-if="post.repoData.language" color="teal" variant="soft">{{ post.repoData.language }}</UBadge>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Full content for detail page -->
        <div v-else class="mb-4">
          <div v-if="post.content" class="prose dark:prose-invert max-w-none mb-4">
            {{ post.content }}
          </div>

          <a
            v-if="post.type === 'link' && post.url"
            :href="post.url"
            target="_blank"
            class="text-primary hover:underline flex items-center gap-1"
          >
            {{ post.url }}
            <UIcon name="i-heroicons-arrow-top-right-on-square" class="w-4 h-4" />
          </a>

          <img
            v-if="post.type === 'image' && post.url"
            :src="post.url"
            :alt="post.title"
            class="rounded-lg w-full"
          />

          <div v-if="post.type === 'code' && post.codeSnippets">
            <CodeBlock
              v-for="(snippet, index) in post.codeSnippets"
              :key="index"
              :code="snippet.code"
              :language="snippet.language"
              :filename="snippet.filename"
            />
          </div>

          <div v-if="post.type === 'repo' && post.repoUrl">
            <UCard>
              <div class="flex items-start gap-4">
                <UIcon name="i-heroicons-code-bracket" class="w-12 h-12 text-primary" />
                <div class="flex-1">
                  <h4 class="text-xl font-bold mb-2">{{ post.repoData.name }}</h4>
                  <p class="text-gray-600 dark:text-gray-400 mb-4">{{ post.repoData.description }}</p>
                  <div class="flex gap-4 mb-4">
                    <div class="flex items-center gap-1">
                      <UIcon name="i-heroicons-star" class="w-5 h-5" />
                      <span class="font-semibold">{{ post.repoData.stars }}</span>
                    </div>
                    <UBadge v-if="post.repoData.language" color="teal">{{ post.repoData.language }}</UBadge>
                  </div>
                  <UButton
                    :to="post.repoUrl"
                    external
                    target="_blank"
                    icon="i-heroicons-arrow-top-right-on-square"
                    label="View on GitHub"
                  />
                </div>
              </div>
            </UCard>
          </div>
        </div>

        <!-- Post Actions -->
        <div class="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
          <NuxtLink :to="`/p/${post.id}`" class="flex items-center gap-1 hover:text-primary">
            <UIcon name="i-heroicons-chat-bubble-left" class="w-4 h-4" />
            {{ post.commentCount || 0 }} comments
          </NuxtLink>
          <button class="flex items-center gap-1 hover:text-primary">
            <UIcon name="i-heroicons-share" class="w-4 h-4" />
            Share
          </button>
          <button class="flex items-center gap-1 hover:text-primary">
            <UIcon name="i-heroicons-bookmark" class="w-4 h-4" />
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { doc, setDoc, deleteDoc, getDoc, updateDoc, increment } from 'firebase/firestore'
import { formatDistanceToNow } from 'date-fns'

const props = defineProps<{
  post: any
  showFull?: boolean
}>()

const { user } = useAuth()
const { $firestore } = useNuxtApp()

const userVote = ref(0)
const voteCount = ref(props.post.upvotes - props.post.downvotes)

const postTypeColor = computed(() => {
  const colors = {
    code: 'purple',
    repo: 'teal',
    link: 'blue',
    image: 'green'
  }
  return colors[props.post.type] || 'gray'
})

const voteColor = computed(() => {
  if (voteCount.value > 0) return 'text-primary'
  if (voteCount.value < 0) return 'text-error'
  return 'text-gray-600 dark:text-gray-400'
})

const formatTimeAgo = (dateString: string) => {
  return formatDistanceToNow(new Date(dateString), { addSuffix: true })
}

// Check user's existing vote
onMounted(async () => {
  if (user.value) {
    const voteId = `${user.value.uid}_${props.post.id}`
    const voteRef = doc($firestore, 'postVotes', voteId)
    const voteDoc = await getDoc(voteRef)

    if (voteDoc.exists()) {
      userVote.value = voteDoc.data().value
    }
  }
})

const handleVote = async (value: number) => {
  if (!user.value) {
    alert('Please log in to vote')
    return
  }

  const voteId = `${user.value.uid}_${props.post.id}`
  const voteRef = doc($firestore, 'postVotes', voteId)
  const postRef = doc($firestore, 'posts', props.post.id)

  try {
    // Remove previous vote
    if (userVote.value !== 0) {
      voteCount.value -= userVote.value
      await updateDoc(postRef, {
        upvotes: increment(userVote.value === 1 ? -1 : 0),
        downvotes: increment(userVote.value === -1 ? -1 : 0)
      })
    }

    // Same vote means remove it
    if (userVote.value === value) {
      await deleteDoc(voteRef)
      userVote.value = 0
    } else {
      // Add new vote
      await setDoc(voteRef, {
        userId: user.value.uid,
        postId: props.post.id,
        value,
        createdAt: new Date().toISOString()
      })

      await updateDoc(postRef, {
        upvotes: increment(value === 1 ? 1 : 0),
        downvotes: increment(value === -1 ? 1 : 0)
      })

      voteCount.value += value
      userVote.value = value
    }
  } catch (error) {
    console.error('Failed to vote:', error)
  }
}
</script>
