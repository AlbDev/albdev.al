<template>
  <div class="space-y-3">
    <UFormField label="Add a comment">
      <UTextarea
        v-model="comment"
        rows="3"
        placeholder="What are your thoughts?"
      />
    </UFormField>
    <div class="flex justify-end">
      <UButton
        @click="submitComment"
        :loading="loading"
        :disabled="!comment.trim()"
        label="Comment"
        color="primary"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { collection, addDoc, doc, updateDoc, increment } from 'firebase/firestore'

const props = defineProps<{
  postId: string
  parentId?: string | null
}>()

const emit = defineEmits(['comment-added'])

const { user } = useAuth()
const { $firestore } = useNuxtApp()

const comment = ref('')
const loading = ref(false)

const submitComment = async () => {
  if (!user.value || !comment.value.trim()) return

  loading.value = true

  try {
    await addDoc(collection($firestore, 'comments'), {
      postId: props.postId,
      parentId: props.parentId || null,
      authorId: user.value.uid,
      authorUsername: user.value.username,
      content: comment.value,
      upvotes: 0,
      downvotes: 0,
      isDeleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })

    // Update post comment count
    const postRef = doc($firestore, 'posts', props.postId)
    await updateDoc(postRef, {
      commentCount: increment(1)
    })

    comment.value = ''
    emit('comment-added')
  } catch (error) {
    console.error('Failed to submit comment:', error)
    alert('Failed to submit comment. Please try again.')
  } finally {
    loading.value = false
  }
}
</script>
