import { useDB } from '~/server/utils/db'
import { communities, communityMembers } from '~/server/database/schema'
import { z } from 'zod'

const createCommunitySchema = z.object({
  name: z.string().min(3).max(21).regex(/^[a-zA-Z0-9_]+$/),
  displayName: z.string().min(3).max(50),
  description: z.string().max(500).optional()
})

export default defineEventHandler(async (event) => {
  const user = event.context.user

  if (!user) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized'
    })
  }

  const body = await readValidatedBody(event, createCommunitySchema.parse)
  const db = useDB()

  // Check if community name is taken
  const existing = await db.query.communities.findFirst({
    where: (communities, { eq }) => eq(communities.name, body.name)
  })

  if (existing) {
    throw createError({
      statusCode: 400,
      message: 'Community name already taken'
    })
  }

  // Create community
  const [newCommunity] = await db.insert(communities).values({
    name: body.name,
    displayName: body.displayName,
    description: body.description,
    creatorId: user.uid,
    memberCount: 1
  }).returning()

  // Add creator as admin member
  await db.insert(communityMembers).values({
    userId: user.uid,
    communityId: newCommunity.id,
    role: 'admin'
  })

  return newCommunity
})
