import { useDB } from '~/server/utils/db'
import { users } from '~/server/database/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const user = event.context.user

  if (!user) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized'
    })
  }

  const db = useDB()
  const dbUser = await db.query.users.findFirst({
    where: eq(users.id, user.uid)
  })

  if (!dbUser) {
    throw createError({
      statusCode: 404,
      message: 'User not found'
    })
  }

  return dbUser
})
