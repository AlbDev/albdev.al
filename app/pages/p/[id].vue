<template>
  <UContainer class="py-8 max-w-6xl">
    <div v-if="loading" class="flex justify-center py-12">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-primary" />
    </div>

    <div v-else-if="post" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main Content -->
      <div class="lg:col-span-2 space-y-4">
        <PostCard :post="post" :show-full="true" />

        <!-- Comments Section -->
        <UCard>
          <template #header>
            <h2 class="text-xl font-bold">Comments ({{ post.commentCount || 0 }})</h2>
          </template>

          <div v-if="user" class="mb-6">
            <CommentForm :post-id="post.id" @comment-added="loadComments" />
          </div>
          <div v-else class="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p class="text-center">Log in to comment</p>
          </div>

          <div class="space-y-4">
            <CommentCard
              v-for="comment in comments"
              :key="comment.id"
              :comment="comment"
              :post-id="post.id"
              @reply-added="loadComments"
            />
            <p v-if="comments.length === 0" class="text-center text-gray-500 py-8">
              No comments yet. Be the first to comment!
            </p>
          </div>
        </UCard>
      </div>

      <!-- Sidebar -->
      <div class="space-y-4">
        <UCard>
          <template #header>
            <h3 class="font-bold">About Community</h3>
          </template>
          <div v-if="community">
            <h4 class="font-semibold">r/{{ community.name }}</h4>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-2">{{ community.description }}</p>
            <div class="flex gap-4 mt-4 text-sm">
              <div>
                <div class="font-semibold">{{ community.memberCount || 0 }}</div>
                <div class="text-gray-600 dark:text-gray-400">Members</div>
              </div>
            </div>
          </div>
        </UCard>

        <UCard v-if="post.authorId">
          <template #header>
            <h3 class="font-bold">Posted by</h3>
          </template>
          <div class="flex items-center gap-3">
            <UAvatar :alt="post.authorUsername" size="md" />
            <div>
              <NuxtLink :to="`/u/${post.authorUsername}`" class="font-semibold hover:text-primary">
                u/{{ post.authorUsername }}
              </NuxtLink>
              <div class="text-xs text-gray-600 dark:text-gray-400">
                {{ formatDate(post.createdAt) }}
              </div>
            </div>
          </div>
        </UCard>
      </div>
    </div>

    <div v-else class="text-center py-12">
      <UIcon name="i-heroicons-exclamation-circle" class="w-12 h-12 mx-auto mb-4 text-gray-400" />
      <p class="text-gray-600 dark:text-gray-400">Post not found</p>
      <UButton to="/" label="Go Home" class="mt-4" />
    </div>
  </UContainer>
</template>

<script setup lang="ts">
import { doc, getDoc, collection, query, where, orderBy, getDocs } from 'firebase/firestore'
import { formatDistanceToNow } from 'date-fns'

const route = useRoute()
const { $firestore } = useNuxtApp()
const { user } = useAuth()

const post = ref(null)
const community = ref(null)
const comments = ref([])
const loading = ref(true)

const formatDate = (dateString: string) => {
  return formatDistanceToNow(new Date(dateString), { addSuffix: true })
}

const loadPost = async () => {
  const postId = route.params.id as string
  const postRef = doc($firestore, 'posts', postId)
  const postDoc = await getDoc(postRef)

  if (postDoc.exists()) {
    post.value = { id: postDoc.id, ...postDoc.data() }

    // Load community
    if (post.value.communityId) {
      const communityRef = doc($firestore, 'communities', post.value.communityId)
      const communityDoc = await getDoc(communityRef)
      if (communityDoc.exists()) {
        community.value = { id: communityDoc.id, ...communityDoc.data() }
      }
    }
  }

  loading.value = false
}

const loadComments = async () => {
  const postId = route.params.id as string
  const commentsQuery = query(
    collection($firestore, 'comments'),
    where('postId', '==', postId),
    where('parentId', '==', null),
    orderBy('createdAt', 'desc')
  )

  const commentsSnapshot = await getDocs(commentsQuery)
  comments.value = commentsSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }))
}

onMounted(async () => {
  await loadPost()
  await loadComments()
})

useHead({
  title: computed(() => post.value?.title || 'Post'),
  meta: [
    { name: 'description', content: computed(() => post.value?.content || post.value?.title || '') }
  ]
})
</script>
