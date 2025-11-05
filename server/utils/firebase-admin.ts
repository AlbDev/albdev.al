import { initializeApp, cert, getApps, type App } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'

let adminApp: App | undefined

export function getFirebaseAdmin() {
  if (adminApp) {
    return adminApp
  }

  const apps = getApps()
  if (apps.length > 0) {
    adminApp = apps[0]
    return adminApp
  }

  const config = useRuntimeConfig()

  const privateKey = config.firebasePrivateKey?.replace(/\\n/g, '\n')
  const clientEmail = config.firebaseClientEmail

  if (!privateKey || !clientEmail) {
    throw new Error('Firebase Admin credentials not configured')
  }

  adminApp = initializeApp({
    credential: cert({
      projectId: config.public.firebaseProjectId,
      privateKey,
      clientEmail
    })
  })

  return adminApp
}

export function getFirebaseAuth() {
  const app = getFirebaseAdmin()
  return getAuth(app)
}
