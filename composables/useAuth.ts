import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User
} from 'firebase/auth'

export const useAuth = () => {
  const { $auth } = useNuxtApp()
  const user = useState<User | null>('user', () => null)
  const authToken = useState<string | null>('authToken', () => null)

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

      // Register user in database
      await $fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: {
          uid: credential.user.uid,
          email: credential.user.email!,
          username,
          displayName: username
        }
      })

      user.value = credential.user
      authToken.value = token
      return credential.user
    } catch (error: any) {
      throw new Error(error.message)
    }
  }

  const signOut = async () => {
    try {
      await firebaseSignOut($auth)
      user.value = null
      authToken.value = null
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
