import { useFirestore, collections } from '~/server/utils/firestore'
import { z } from 'zod'
import { FieldValue } from 'firebase-admin/firestore'

const voteSchema = z.object({
  value: z.number().int().min(-1).max(1) // -1, 0, 1
})

export default defineEventHandler(async (event) => {
  const user = event.context.user

  if (!user) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized'
    })
  }

  const postId = getRouterParam(event, 'id')!
  const body = await readValidatedBody(event, voteSchema.parse)
  const db = useFirestore()

  const voteId = `${user.uid}_${postId}`
  const voteRef = db.collection(collections.postVotes).doc(voteId)
  const postRef = db.collection(collections.posts).doc(postId)

  // Get existing vote
  const voteDoc = await voteRef.get()
  const existingVote = voteDoc.exists ? voteDoc.data() : null

  if (body.value === 0) {
    // Remove vote
    if (existingVote) {
      await voteRef.delete()

      // Update post vote counts
      if (existingVote.value === 1) {
        await postRef.update({
          upvotes: FieldValue.increment(-1)
        })
      } else {
        await postRef.update({
          downvotes: FieldValue.increment(-1)
        })
      }
    }
  } else {
    // Add or update vote
    if (existingVote) {
      // Update existing vote
      const oldValue = existingVote.value
      await voteRef.update({
        value: body.value,
        createdAt: new Date().toISOString()
      })

      // Update post vote counts
      if (oldValue === 1 && body.value === -1) {
        await postRef.update({
          upvotes: FieldValue.increment(-1),
          downvotes: FieldValue.increment(1)
        })
      } else if (oldValue === -1 && body.value === 1) {
        await postRef.update({
          upvotes: FieldValue.increment(1),
          downvotes: FieldValue.increment(-1)
        })
      }
    } else {
      // Create new vote
      await voteRef.set({
        postId,
        userId: user.uid,
        value: body.value,
        createdAt: new Date().toISOString()
      })

      // Update post vote counts
      if (body.value === 1) {
        await postRef.update({
          upvotes: FieldValue.increment(1)
        })
      } else {
        await postRef.update({
          downvotes: FieldValue.increment(1)
        })
      }
    }
  }

  return { success: true }
})
