import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from '../database/schema'

let db: ReturnType<typeof drizzle> | null = null

export function useDB() {
  if (db) {
    return db
  }

  const config = useRuntimeConfig()
  const connectionString = config.databaseUrl

  if (!connectionString) {
    throw new Error('DATABASE_URL is not configured')
  }

  const client = postgres(connectionString)
  db = drizzle(client, { schema })

  return db
}
