import { useDB } from '~/server/utils/db'
import { posts } from '~/server/database/schema'
import { z } from 'zod'

const createPostSchema = z.object({
  title: z.string().min(1).max(300),
  content: z.string().optional(),
  type: z.enum(['text', 'link', 'image']),
  url: z.string().url().optional(),
  communityId: z.string().uuid()
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
  const db = useDB()

  const [newPost] = await db.insert(posts).values({
    title: body.title,
    content: body.content,
    type: body.type,
    url: body.url,
    authorId: user.uid,
    communityId: body.communityId
  }).returning()

  return newPost
})
