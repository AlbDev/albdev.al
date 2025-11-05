import { useFirestore, collections } from '~/server/utils/firestore'

export default defineEventHandler(async (event) => {
  const user = event.context.user

  if (!user) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized'
    })
  }

  const db = useFirestore()
  const userDoc = await db.collection(collections.users).doc(user.uid).get()

  if (!userDoc.exists) {
    throw createError({
      statusCode: 404,
      message: 'User not found'
    })
  }

  return {
    id: userDoc.id,
    ...userDoc.data()
  }
})
