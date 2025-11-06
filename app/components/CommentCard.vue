<template>
  <div class="space-y-2">
    <div class="flex gap-3">
      <div class="flex flex-col items-center gap-1">
        <UButton
          icon="i-heroicons-arrow-up"
          size="xs"
          variant="ghost"
          @click="handleVote(1)"
        />
        <span class="text-xs font-semibold">{{ voteCount }}</span>
        <UButton
          icon="i-heroicons-arrow-down"
          size="xs"
          variant="ghost"
          @click="handleVote(-1)"
        />
      </div>

      <div class="flex-1">
        <div class="flex items-center gap-2 text-sm mb-1">
          <NuxtLink :to="`/u/${comment.authorUsername}`" class="font-semibold hover:text-primary">
            u/{{ comment.authorUsername }}
          </NuxtLink>
          <span class="text-gray-600 dark:text-gray-400 text-xs">
            {{ formatTimeAgo(comment.createdAt) }}
          </span>
        </div>

        <p class="text-gray-700 dark:text-gray-300 mb-2">{{ comment.content }}</p>

        <div class="flex gap-3 text-xs text-gray-600 dark:text-gray-400">
          <button @click="showReply = !showReply" class="hover:text-primary">
            Reply
          </button>
        </div>

        <div v-if="showReply" class="mt-3">
          <CommentForm :post-id="postId" :parent-id="comment.id" @comment-added="onReplyAdded" />
        </div>

        <div v-if="replies.length > 0" class="mt-4 space-y-3 pl-4 border-l-2 border-gray-200 dark:border-gray-700">
          <CommentCard
            v-for="reply in replies"
            :key="reply.id"
            :comment="reply"
            :post-id="postId"
            @reply-added="$emit('reply-added')"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore'
import { formatDistanceToNow } from 'date-fns'

const props = defineProps<{
  comment: any
  postId: string
}>()

const emit = defineEmits(['reply-added'])

const { $firestore } = useNuxtApp()

const showReply = ref(false)
const replies = ref([])
const voteCount = ref(props.comment.upvotes - props.comment.downvotes)

const formatTimeAgo = (dateString: string) => {
  return formatDistanceToNow(new Date(dateString), { addSuffix: true })
}

const loadReplies = async () => {
  const repliesQuery = query(
    collection($firestore, 'comments'),
    where('parentId', '==', props.comment.id),
    orderBy('createdAt', 'asc')
  )

  const repliesSnapshot = await getDocs(repliesQuery)
  replies.value = repliesSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }))
}

const onReplyAdded = () => {
  showReply.value = false
  loadReplies()
  emit('reply-added')
}

const handleVote = async (value: number) => {
  // Similar to PostCard vote logic
  console.log('Vote:', value)
}

onMounted(() => {
  loadReplies()
})
</script>
