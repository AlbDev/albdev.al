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
          @click="vote(1)"
        />
        <span class="text-sm font-semibold" :class="voteColor">
          {{ voteCount }}
        </span>
        <UButton
          icon="i-heroicons-arrow-down"
          size="sm"
          variant="ghost"
          :color="userVote === -1 ? 'red' : 'gray'"
          @click="vote(-1)"
        />
      </div>

      <!-- Content Section -->
      <div class="flex-1 p-4">
        <!-- Post Meta -->
        <div class="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 mb-2">
          <NuxtLink
            :to="`/r/${post.community.name}`"
            class="font-semibold hover:underline"
          >
            r/{{ post.community.name }}
          </NuxtLink>
          <span>•</span>
          <span>Posted by</span>
          <NuxtLink
            :to="`/u/${post.author.username}`"
            class="hover:underline"
          >
            u/{{ post.author.username }}
          </NuxtLink>
          <span>•</span>
          <span>{{ formatTimeAgo(post.createdAt) }}</span>
        </div>

        <!-- Post Title -->
        <NuxtLink :to="`/r/${post.community.name}/comments/${post.id}`">
          <h3 class="text-lg font-semibold mb-2 hover:text-primary">
            {{ post.title }}
          </h3>
        </NuxtLink>

        <!-- Post Content Preview -->
        <p v-if="post.content" class="text-gray-700 dark:text-gray-300 mb-3 line-clamp-3">
          {{ post.content }}
        </p>

        <!-- Post Actions -->
        <div class="flex items-center gap-4">
          <UButton
            :to="`/r/${post.community.name}/comments/${post.id}`"
            variant="ghost"
            size="sm"
            icon="i-heroicons-chat-bubble-left"
            :label="`${post.commentCount} Comments`"
          />
          <UButton
            variant="ghost"
            size="sm"
            icon="i-heroicons-share"
            label="Share"
          />
          <UButton
            variant="ghost"
            size="sm"
            icon="i-heroicons-bookmark"
            label="Save"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  post: any
}>()

const { user } = useAuth()
const { apiFetch } = useApi()
const userVote = ref(0)

const voteCount = computed(() => props.post.upvotes - props.post.downvotes)

const voteColor = computed(() => {
  if (userVote.value === 1) return 'text-primary'
  if (userVote.value === -1) return 'text-red-500'
  return 'text-gray-700 dark:text-gray-300'
})

const vote = async (value: number) => {
  if (!user.value) {
    // Show login modal
    return
  }

  const newVote = userVote.value === value ? 0 : value

  try {
    await apiFetch(`/api/posts/${props.post.id}/vote`, {
      method: 'POST',
      body: { value: newVote }
    })

    userVote.value = newVote
  } catch (error) {
    console.error('Vote failed:', error)
  }
}

const formatTimeAgo = (date: string) => {
  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000)

  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}
</script>
