import { useFirestore, collections } from '~/server/utils/firestore'

export default defineEventHandler(async (event) => {
  const db = useFirestore()
  const query = getQuery(event)
  const communityId = query.communityId as string | undefined

  let postsQuery = db.collection(collections.posts)
    .where('isDeleted', '==', false)
    .orderBy('createdAt', 'desc')
    .limit(25)

  if (communityId) {
    postsQuery = postsQuery.where('communityId', '==', communityId)
  }

  const postsSnapshot = await postsQuery.get()

  const posts = await Promise.all(
    postsSnapshot.docs.map(async (doc) => {
      const data = doc.data()

      // Get author info
      const authorDoc = await db.collection(collections.users).doc(data.authorId).get()
      const author = authorDoc.exists ? {
        id: authorDoc.id,
        username: authorDoc.data()?.username,
        avatar: authorDoc.data()?.avatar
      } : null

      // Get community info
      const communityDoc = await db.collection(collections.communities).doc(data.communityId).get()
      const community = communityDoc.exists ? {
        id: communityDoc.id,
        name: communityDoc.data()?.name,
        displayName: communityDoc.data()?.displayName,
        icon: communityDoc.data()?.icon
      } : null

      return {
        id: doc.id,
        ...data,
        author,
        community
      }
    })
  )

  return posts
})
