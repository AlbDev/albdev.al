/**
 * Hybrid Auth Composable
 *
 * Tries Base API first, falls back to Firebase Auth if unavailable
 */

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import type { BaseUser, BaseAuthResponse, RegisterRequest } from './useBaseApi'

interface AlbDevUser {
  id: number | string
  email: string
  username: string
  displayName: string
  first_name: string
  last_name: string
  avatarUrl?: string
  bio?: string
  location?: string
  website?: string
  githubUsername?: string
  twitterHandle?: string
  reputation: number
  role_id?: number
  createdAt: string
  updatedAt: string
  lastSeen?: string
  accessToken?: string
  authProvider: 'base' | 'firebase'
}

export const useAuth = () => {
  const { register, login, logout: baseLogout, getCurrentUser, isAuthenticated } = useBaseApi()
  const { $auth, $firestore } = useNuxtApp()
  const user = useState<AlbDevUser | null>('user', () => null)
  const authToken = useState<string | null>('authToken', () => null)
  const route = useRoute()

  // Check if Base API is available
  const checkBaseApiAvailable = async (): Promise<boolean> => {
    const config = useRuntimeConfig()
    const baseURL = config.public.baseApiUrl || 'http://localhost:8100'

    try {
      const response = await fetch(`${baseURL}/health`, {
        method: 'GET',
        signal: AbortSignal.timeout(2000) // 2 second timeout
      })
      return response.ok
    } catch {
      return false
    }
  }

  // Convert Base user to AlbDev format
  const convertBaseUser = (baseUser: BaseUser, accessToken: string): AlbDevUser => ({
    id: baseUser.id,
    email: baseUser.email,
    username: baseUser.username,
    displayName: `${baseUser.first_name} ${baseUser.last_name}`,
    first_name: baseUser.first_name,
    last_name: baseUser.last_name,
    avatarUrl: baseUser.avatar_url,
    bio: baseUser.bio,
    location: baseUser.location,
    website: baseUser.website,
    githubUsername: baseUser.github_username,
    twitterHandle: baseUser.twitter_username,
    reputation: baseUser.reputation,
    role_id: baseUser.role_id,
    createdAt: baseUser.created_at,
    updatedAt: baseUser.updated_at,
    accessToken,
    authProvider: 'base'
  })

  // Initialize auth on mount
  onMounted(async () => {
    // Try Base API user first
    const baseUser = getCurrentUser()
    if (baseUser && isAuthenticated()) {
      user.value = convertBaseUser(baseUser, localStorage.getItem('base_access_token') || '')
      authToken.value = localStorage.getItem('base_access_token')
      return
    }

    // Check Firebase Auth
    if ($auth.currentUser) {
      await loadFirebaseUser($auth.currentUser.uid)
    }

    // Fall back to old OAuth user format
    const storedUser = localStorage.getItem('albdev_user')
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser)
        user.value = userData
        authToken.value = userData.accessToken || null
      } catch (e) {
        console.error('Failed to parse stored user:', e)
        localStorage.removeItem('albdev_user')
      }
    }
  })

  // Load Firebase user data
  const loadFirebaseUser = async (uid: string) => {
    try {
      const userRef = doc($firestore, 'users', uid)
      const userDoc = await getDoc(userRef)

      if (userDoc.exists()) {
        const data = userDoc.data()
        user.value = {
          id: uid,
          email: data.email,
          username: data.username,
          displayName: data.displayName || data.username,
          first_name: data.first_name || data.username.split(' ')[0] || '',
          last_name: data.last_name || data.username.split(' ')[1] || '',
          avatarUrl: data.avatarUrl,
          bio: data.bio,
          location: data.location,
          website: data.website,
          githubUsername: data.githubUsername,
          twitterHandle: data.twitterHandle,
          reputation: data.reputation || 0,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
          authProvider: 'firebase'
        }
        authToken.value = await $auth.currentUser?.getIdToken() || null
      }
    } catch (error) {
      console.error('Error loading Firebase user:', error)
    }
  }

  const signIn = async (email: string, password: string) => {
    // Try Base API first
    const baseApiAvailable = await checkBaseApiAvailable()

    if (baseApiAvailable) {
      try {
        const response: BaseAuthResponse = await login({ email, password })
        const userData = convertBaseUser(response.user, response.accessToken)
        user.value = userData
        authToken.value = response.accessToken
        return userData
      } catch (error: any) {
        console.error('Base API login failed, trying Firebase:', error)
        // Fall through to Firebase
      }
    }

    // Fall back to Firebase Auth
    try {
      const credential = await signInWithEmailAndPassword($auth, email, password)
      await loadFirebaseUser(credential.user.uid)
      authToken.value = await credential.user.getIdToken()

      // Show notification that we're using Firebase
      console.log('Logged in with Firebase (Base API unavailable)')

      return user.value
    } catch (error: any) {
      throw new Error(error.message || 'Login failed')
    }
  }

  const signUp = async (data: RegisterRequest) => {
    // Try Base API first
    const baseApiAvailable = await checkBaseApiAvailable()

    if (baseApiAvailable) {
      try {
        const response: BaseAuthResponse = await register(data)
        const userData = convertBaseUser(response.user, response.accessToken)
        user.value = userData
        authToken.value = response.accessToken
        return userData
      } catch (error: any) {
        console.error('Base API registration failed, trying Firebase:', error)
        // Fall through to Firebase
      }
    }

    // Fall back to Firebase Auth
    try {
      const credential = await createUserWithEmailAndPassword($auth, data.email, data.password)
      const token = await credential.user.getIdToken()

      // Create user in Firestore
      const now = new Date().toISOString()
      const userData: AlbDevUser = {
        id: credential.user.uid,
        email: credential.user.email!,
        username: data.username,
        displayName: `${data.first_name} ${data.last_name}`,
        first_name: data.first_name,
        last_name: data.last_name,
        reputation: 0,
        createdAt: now,
        updatedAt: now,
        lastSeen: now,
        authProvider: 'firebase'
      }

      const userRef = doc($firestore, 'users', credential.user.uid)
      await setDoc(userRef, userData)

      user.value = userData
      authToken.value = token

      // Store in localStorage
      localStorage.setItem('albdev_user', JSON.stringify({
        ...userData,
        accessToken: token,
      }))

      // Show notification that we're using Firebase
      console.log('Registered with Firebase (Base API unavailable)')

      return userData
    } catch (error: any) {
      throw new Error(error.message || 'Registration failed')
    }
  }

  const signOut = async () => {
    try {
      if (user.value?.authProvider === 'base') {
        await baseLogout()
      } else if ($auth.currentUser) {
        await firebaseSignOut($auth)
      }

      // Clear state
      user.value = null
      authToken.value = null
      localStorage.removeItem('albdev_user')
    } catch (error: any) {
      // Log error but still clear local state
      console.error('Logout error:', error)
      user.value = null
      authToken.value = null
    }
  }

  // Initialize auth - check if user is already logged in
  const initAuth = async () => {
    // Check Base API
    const baseUser = getCurrentUser()
    if (baseUser && isAuthenticated()) {
      user.value = convertBaseUser(baseUser, localStorage.getItem('base_access_token') || '')
      authToken.value = localStorage.getItem('base_access_token')
      return user.value
    }

    // Check Firebase
    return new Promise<AlbDevUser | null>((resolve) => {
      onAuthStateChanged($auth, async (firebaseUser) => {
        if (firebaseUser) {
          await loadFirebaseUser(firebaseUser.uid)
          authToken.value = await firebaseUser.getIdToken()
        } else {
          user.value = null
          authToken.value = null
        }
        resolve(user.value)
      })
    })
  }

  return {
    user: readonly(user),
    authToken: readonly(authToken),
    signIn,
    signUp,
    signOut,
    initAuth,
    checkBaseApiAvailable
  }
}
