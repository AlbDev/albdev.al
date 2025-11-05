import { useFirestore, collections } from '~/server/utils/firestore'
import { getFirebaseAuth } from '~/server/utils/firebase-admin'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const query = getQuery(event)
  const code = query.code as string

  if (!code) {
    throw createError({
      statusCode: 400,
      message: 'No authorization code provided'
    })
  }

  try {
    // Exchange code for token
    const tokenResponse = await $fetch<{
      access_token: string
      token_type: string
      expires_in: number
      id_token?: string
    }>(config.public.oauthBaseTokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: config.oauthBaseRedirectUri,
        client_id: config.oauthBaseClientId,
        client_secret: config.oauthBaseClientSecret
      }).toString()
    })

    // Get user info
    const userInfo = await $fetch<{
      sub: string
      email: string
      name?: string
      username?: string
      avatar?: string
    }>(config.public.oauthBaseUserinfoUrl, {
      headers: {
        Authorization: `Bearer ${tokenResponse.access_token}`
      }
    })

    // Create or get Firebase user
    const auth = getFirebaseAuth()
    let firebaseUser

    try {
      // Try to get existing user by email
      firebaseUser = await auth.getUserByEmail(userInfo.email)
    } catch (error) {
      // User doesn't exist, create new Firebase user
      firebaseUser = await auth.createUser({
        email: userInfo.email,
        displayName: userInfo.name || userInfo.username,
        photoURL: userInfo.avatar,
        emailVerified: true
      })
    }

    // Create custom token for Firebase
    const customToken = await auth.createCustomToken(firebaseUser.uid)

    // Check if user exists in Firestore
    const db = useFirestore()
    const userDoc = await db.collection(collections.users).doc(firebaseUser.uid).get()

    if (!userDoc.exists) {
      // Create user document in Firestore
      const username = userInfo.username || userInfo.email.split('@')[0]

      await db.collection(collections.users).doc(firebaseUser.uid).set({
        email: userInfo.email,
        username,
        displayName: userInfo.name || username,
        avatar: userInfo.avatar || null,
        bio: null,
        karma: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
    }

    // Redirect to frontend with custom token
    const redirectUrl = new URL('/', 'https://albanian.dev')
    redirectUrl.searchParams.set('token', customToken)

    return sendRedirect(event, redirectUrl.toString())
  } catch (error: any) {
    console.error('OAuth callback error:', error)
    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to authenticate with base.al'
    })
  }
})
