import { useDB } from '~/server/utils/db'
import { desc } from 'drizzle-orm'
import { communities } from '~/server/database/schema'

export default defineEventHandler(async () => {
  const db = useDB()

  const allCommunities = await db.query.communities.findMany({
    orderBy: [desc(communities.memberCount)],
    limit: 50,
    with: {
      creator: {
        columns: {
          id: true,
          username: true,
          avatar: true
        }
      }
    }
  })

  return allCommunities
})
