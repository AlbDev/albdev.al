import { getFirebaseAuth } from '../utils/firebase-admin'

export default defineEventHandler(async (event) => {
  const token = getHeader(event, 'authorization')?.split('Bearer ')[1]

  if (!token) {
    event.context.user = null
    return
  }

  try {
    const decodedToken = await getFirebaseAuth().verifyIdToken(token)
    event.context.user = {
      uid: decodedToken.uid,
      email: decodedToken.email
    }
  } catch (error) {
    console.error('Token verification failed:', error)
    event.context.user = null
  }
})
