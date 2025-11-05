import { useFirestore, collections } from '~/server/utils/firestore'

export default defineEventHandler(async () => {
  const db = useFirestore()

  const communitiesSnapshot = await db.collection(collections.communities)
    .orderBy('memberCount', 'desc')
    .limit(50)
    .get()

  const communities = await Promise.all(
    communitiesSnapshot.docs.map(async (doc) => {
      const data = doc.data()

      // Get creator info
      const creatorDoc = await db.collection(collections.users).doc(data.creatorId).get()
      const creator = creatorDoc.exists ? {
        id: creatorDoc.id,
        username: creatorDoc.data()?.username,
        avatar: creatorDoc.data()?.avatar
      } : null

      return {
        id: doc.id,
        ...data,
        creator
      }
    })
  )

  return communities
})
