import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithCustomToken,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User
} from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'

interface AlbDevUser {
  uid: string
  email: string
  username: string
  displayName: string
  avatarUrl?: string
  bio?: string
  location?: string
  website?: string
  githubUsername?: string
  twitterHandle?: string
  reputation: number
  roles: string[]
  createdAt: string
  updatedAt: string
  lastSeen: string
  accessToken?: string
}

export const useAuth = () => {
  const { $auth, $firestore } = useNuxtApp()
  const user = useState<AlbDevUser | null>('user', () => null)
  const authToken = useState<string | null>('authToken', () => null)
  const route = useRoute()

  // Check localStorage for Base.al OAuth user on mount
  onMounted(() => {
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

    // Handle OAuth callback token
    const token = route.query.token as string
    if (token) {
      signInWithCustomToken($auth, token).then(() => {
        // Remove token from URL
        const newUrl = window.location.pathname
        window.history.replaceState({}, '', newUrl)
      })
    }
  })

  const signIn = async (email: string, password: string) => {
    try {
      const credential = await signInWithEmailAndPassword($auth, email, password)
      user.value = credential.user
      authToken.value = await credential.user.getIdToken()
      return credential.user
    } catch (error: any) {
      throw new Error(error.message)
    }
  }

  const signUp = async (email: string, password: string, username: string) => {
    try {
      const credential = await createUserWithEmailAndPassword($auth, email, password)
      const token = await credential.user.getIdToken()

      // Create user in Firestore
      const now = new Date().toISOString()
      const userData: AlbDevUser = {
        uid: credential.user.uid,
        email: credential.user.email!,
        username,
        displayName: username,
        reputation: 0,
        roles: ['user'],
        createdAt: now,
        updatedAt: now,
        lastSeen: now,
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

      return userData
    } catch (error: any) {
      throw new Error(error.message)
    }
  }

  const signOut = async () => {
    try {
      // Clear Firebase Auth if signed in
      if ($auth.currentUser) {
        await firebaseSignOut($auth)
      }

      // Clear state and localStorage
      user.value = null
      authToken.value = null
      localStorage.removeItem('albdev_user')
    } catch (error: any) {
      throw new Error(error.message)
    }
  }

  const initAuth = () => {
    return new Promise<User | null>((resolve) => {
      onAuthStateChanged($auth, async (firebaseUser) => {
        user.value = firebaseUser
        if (firebaseUser) {
          authToken.value = await firebaseUser.getIdToken()
        } else {
          authToken.value = null
        }
        resolve(firebaseUser)
      })
    })
  }

  return {
    user: readonly(user),
    authToken: readonly(authToken),
    signIn,
    signUp,
    signOut,
    initAuth
  }
}
