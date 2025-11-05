import { useFirestore, collections } from '~/server/utils/firestore'
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
  const db = useFirestore()

  // Check if community name is taken
  const existingQuery = await db.collection(collections.communities)
    .where('name', '==', body.name)
    .limit(1)
    .get()

  if (!existingQuery.empty) {
    throw createError({
      statusCode: 400,
      message: 'Community name already taken'
    })
  }

  // Create community
  const communityRef = db.collection(collections.communities).doc()
  const communityData = {
    name: body.name,
    displayName: body.displayName,
    description: body.description || null,
    icon: null,
    banner: null,
    memberCount: 1,
    creatorId: user.uid,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  await communityRef.set(communityData)

  // Add creator as admin member
  await db.collection(collections.communityMembers).doc(`${user.uid}_${communityRef.id}`).set({
    userId: user.uid,
    communityId: communityRef.id,
    role: 'admin',
    joinedAt: new Date().toISOString()
  })

  return {
    id: communityRef.id,
    ...communityData
  }
})
