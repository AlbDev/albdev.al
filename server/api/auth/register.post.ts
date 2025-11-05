import { useDB } from '~/server/utils/db'
import { users } from '~/server/database/schema'
import { z } from 'zod'

const registerSchema = z.object({
  uid: z.string(),
  email: z.string().email(),
  username: z.string().min(3).max(20).regex(/^[a-zA-Z0-9_]+$/),
  displayName: z.string().min(1).max(50).optional()
})

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, registerSchema.parse)

  const db = useDB()

  // Check if user already exists
  const existingUser = await db.query.users.findFirst({
    where: (users, { eq, or }) => or(
      eq(users.id, body.uid),
      eq(users.username, body.username),
      eq(users.email, body.email)
    )
  })

  if (existingUser) {
    throw createError({
      statusCode: 400,
      message: 'User already exists'
    })
  }

  // Create new user
  const [newUser] = await db.insert(users).values({
    id: body.uid,
    email: body.email,
    username: body.username,
    displayName: body.displayName || body.username
  }).returning()

  return newUser
})
