import { useDB } from '~/server/utils/db'
import { posts } from '~/server/database/schema'
import { desc, eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const db = useDB()
  const query = getQuery(event)
  const communityId = query.communityId as string | undefined

  let postsQuery = db.query.posts.findMany({
    where: communityId ? eq(posts.communityId, communityId) : undefined,
    orderBy: [desc(posts.createdAt)],
    limit: 25,
    with: {
      author: {
        columns: {
          id: true,
          username: true,
          avatar: true
        }
      },
      community: {
        columns: {
          id: true,
          name: true,
          displayName: true,
          icon: true
        }
      }
    },
    where: (posts, { eq }) => eq(posts.isDeleted, false)
  })

  const allPosts = await postsQuery

  return allPosts
})
