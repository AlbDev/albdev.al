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
          :color="userVote === -1 ? 'red' : 'gray'"
          @click="handleVote(-1)"
        />
      </div>

      <!-- Content Section -->
      <div class="flex-1 p-4">
        <!-- Post Meta -->
        <div class="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 mb-2">
          <span class="font-semibold">AlbDev</span>
          <span>•</span>
          <span>{{ formatTimeAgo(post.createdAt) }}</span>
        </div>

        <!-- Post Title -->
        <h3 class="text-lg font-semibold mb-2">
          {{ post.title }}
        </h3>

        <!-- Post Content Preview -->
        <p v-if="post.content" class="text-gray-700 dark:text-gray-300 mb-3 line-clamp-3">
          {{ post.content }}
        </p>

        <!-- Post URL -->
        <a
          v-if="post.url"
          :href="post.url"
          target="_blank"
          class="text-primary hover:underline text-sm mb-3 block"
        >
          {{ post.url }}
        </a>

        <!-- Post Actions -->
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-1 text-gray-600 dark:text-gray-400">
            <UIcon name="i-heroicons-chat-bubble-left" class="w-4 h-4" />
            <span class="text-sm">{{ post.commentCount || 0 }} Comments</span>
          </div>
          <UButton
            variant="ghost"
            size="sm"
            icon="i-heroicons-share"
            label="Share"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { doc, updateDoc, setDoc, deleteDoc, getDoc, increment } from 'firebase/firestore'

const props = defineProps<{
  post: any
}>()

const { user } = useAuth()
const { $firestore } = useNuxtApp()
const userVote = ref(0)

const voteCount = computed(() => (props.post.upvotes || 0) - (props.post.downvotes || 0))

const voteColor = computed(() => {
  if (userVote.value === 1) return 'text-primary'
  if (userVote.value === -1) return 'text-red-500'
  return 'text-gray-700 dark:text-gray-300'
})

const handleVote = async (value: number) => {
  if (!user.value) {
    alert('Please sign in to vote')
    return
  }

  const newVote = userVote.value === value ? 0 : value
  const voteId = `${user.value.uid}_${props.post.id}`

  try {
    const postRef = doc($firestore, 'posts', props.post.id)
    const voteRef = doc($firestore, 'postVotes', voteId)

    if (newVote === 0) {
      // Remove vote
      await deleteDoc(voteRef)
      if (userVote.value === 1) {
        await updateDoc(postRef, { upvotes: increment(-1) })
      } else {
        await updateDoc(postRef, { downvotes: increment(-1) })
      }
    } else {
      // Add or update vote
      await setDoc(voteRef, {
        userId: user.value.uid,
        postId: props.post.id,
        value: newVote,
        createdAt: new Date().toISOString()
      })

      if (userVote.value === 0) {
        // New vote
        if (newVote === 1) {
          await updateDoc(postRef, { upvotes: increment(1) })
        } else {
          await updateDoc(postRef, { downvotes: increment(1) })
        }
      } else {
        // Change vote
        if (newVote === 1) {
          await updateDoc(postRef, {
            upvotes: increment(1),
            downvotes: increment(-1)
          })
        } else {
          await updateDoc(postRef, {
            upvotes: increment(-1),
            downvotes: increment(1)
          })
        }
      }
    }

    userVote.value = newVote
  } catch (error) {
    console.error('Vote failed:', error)
    alert('Failed to vote. Please try again.')
  }
}

const formatTimeAgo = (date: string) => {
  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000)

  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}

// Load user's vote on mount
onMounted(async () => {
  if (user.value) {
    try {
      const voteId = `${user.value.uid}_${props.post.id}`
      const voteRef = doc($firestore, 'postVotes', voteId)
      const voteDoc = await getDoc(voteRef)

      if (voteDoc.exists()) {
        userVote.value = voteDoc.data().value
      }
    } catch (error) {
      console.error('Failed to load vote:', error)
    }
  }
})
</script>
