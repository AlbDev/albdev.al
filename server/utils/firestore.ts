import { getFirestore } from 'firebase-admin/firestore'
import { getFirebaseAdmin } from './firebase-admin'

let db: FirebaseFirestore.Firestore | null = null

export function useFirestore() {
  if (db) {
    return db
  }

  const app = getFirebaseAdmin()
  db = getFirestore(app)

  return db
}

// Collection references
export const collections = {
  users: 'users',
  communities: 'communities',
  posts: 'posts',
  comments: 'comments',
  postVotes: 'postVotes',
  commentVotes: 'commentVotes',
  communityMembers: 'communityMembers'
} as const

// Helper to get server timestamp
export function serverTimestamp() {
  return getFirestore().FieldValue.serverTimestamp()
}

// Helper to increment
export function increment(value: number) {
  return getFirestore().FieldValue.increment(value)
}
