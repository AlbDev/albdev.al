import { useFirestore, collections } from '~/server/utils/firestore'
import { z } from 'zod'

const registerSchema = z.object({
  uid: z.string(),
  email: z.string().email(),
  username: z.string().min(3).max(20).regex(/^[a-zA-Z0-9_]+$/),
  displayName: z.string().min(1).max(50).optional()
})

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, registerSchema.parse)

  const db = useFirestore()

  // Check if username is taken
  const usernameQuery = await db.collection(collections.users)
    .where('username', '==', body.username)
    .limit(1)
    .get()

  if (!usernameQuery.empty) {
    throw createError({
      statusCode: 400,
      message: 'Username already taken'
    })
  }

  // Check if user already exists
  const userDoc = await db.collection(collections.users).doc(body.uid).get()

  if (userDoc.exists) {
    throw createError({
      statusCode: 400,
      message: 'User already exists'
    })
  }

  // Create new user
  const userData = {
    email: body.email,
    username: body.username,
    displayName: body.displayName || body.username,
    avatar: null,
    bio: null,
    karma: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  await db.collection(collections.users).doc(body.uid).set(userData)

  return {
    id: body.uid,
    ...userData
  }
})
