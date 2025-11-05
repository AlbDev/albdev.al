import { useDB } from '~/server/utils/db'
import { postVotes, posts } from '~/server/database/schema'
import { eq, and, sql } from 'drizzle-orm'
import { z } from 'zod'

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
  const db = useDB()

  // Get existing vote
  const existingVote = await db.query.postVotes.findFirst({
    where: and(
      eq(postVotes.postId, postId),
      eq(postVotes.userId, user.uid)
    )
  })

  if (body.value === 0) {
    // Remove vote
    if (existingVote) {
      await db.delete(postVotes).where(
        and(
          eq(postVotes.postId, postId),
          eq(postVotes.userId, user.uid)
        )
      )

      // Update post vote counts
      if (existingVote.value === 1) {
        await db.update(posts)
          .set({ upvotes: sql`${posts.upvotes} - 1` })
          .where(eq(posts.id, postId))
      } else {
        await db.update(posts)
          .set({ downvotes: sql`${posts.downvotes} - 1` })
          .where(eq(posts.id, postId))
      }
    }
  } else {
    // Add or update vote
    if (existingVote) {
      // Update existing vote
      const oldValue = existingVote.value
      await db.update(postVotes)
        .set({ value: body.value })
        .where(
          and(
            eq(postVotes.postId, postId),
            eq(postVotes.userId, user.uid)
          )
        )

      // Update post vote counts
      if (oldValue === 1 && body.value === -1) {
        await db.update(posts)
          .set({
            upvotes: sql`${posts.upvotes} - 1`,
            downvotes: sql`${posts.downvotes} + 1`
          })
          .where(eq(posts.id, postId))
      } else if (oldValue === -1 && body.value === 1) {
        await db.update(posts)
          .set({
            upvotes: sql`${posts.upvotes} + 1`,
            downvotes: sql`${posts.downvotes} - 1`
          })
          .where(eq(posts.id, postId))
      }
    } else {
      // Create new vote
      await db.insert(postVotes).values({
        postId,
        userId: user.uid,
        value: body.value
      })

      // Update post vote counts
      if (body.value === 1) {
        await db.update(posts)
          .set({ upvotes: sql`${posts.upvotes} + 1` })
          .where(eq(posts.id, postId))
      } else {
        await db.update(posts)
          .set({ downvotes: sql`${posts.downvotes} + 1` })
          .where(eq(posts.id, postId))
      }
    }
  }

  return { success: true }
})
