import { useFirestore, collections } from '~/server/utils/firestore'
import { z } from 'zod'

const createPostSchema = z.object({
  title: z.string().min(1).max(300),
  content: z.string().optional(),
  type: z.enum(['text', 'link', 'image']),
  url: z.string().url().optional(),
  communityId: z.string()
})

export default defineEventHandler(async (event) => {
  const user = event.context.user

  if (!user) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized'
    })
  }

  const body = await readValidatedBody(event, createPostSchema.parse)
  const db = useFirestore()

  // Create post
  const postRef = db.collection(collections.posts).doc()
  const postData = {
    title: body.title,
    content: body.content || null,
    type: body.type,
    url: body.url || null,
    authorId: user.uid,
    communityId: body.communityId,
    upvotes: 0,
    downvotes: 0,
    commentCount: 0,
    isDeleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  await postRef.set(postData)

  return {
    id: postRef.id,
    ...postData
  }
})
