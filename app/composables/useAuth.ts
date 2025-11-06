import type { BaseUser, BaseAuthResponse, RegisterRequest } from './useBaseApi'

interface AlbDevUser {
  id: number
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
  role_id: number
  createdAt: string
  updatedAt: string
  lastSeen?: string
  accessToken?: string
}

export const useAuth = () => {
  const { register, login, logout: baseLogout, getCurrentUser, isAuthenticated } = useBaseApi()
  const user = useState<AlbDevUser | null>('user', () => null)
  const authToken = useState<string | null>('authToken', () => null)
  const route = useRoute()

  // Check localStorage for user on mount
  onMounted(() => {
    // Try Base API user first
    const baseUser = getCurrentUser()
    if (baseUser && isAuthenticated()) {
      // Convert Base user to AlbDev user format
      user.value = {
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
      }
      authToken.value = localStorage.getItem('base_access_token')
      return
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

  const signIn = async (email: string, password: string) => {
    try {
      const response: BaseAuthResponse = await login({ email, password })

      // Convert Base response to AlbDev format
      const userData: AlbDevUser = {
        id: response.user.id,
        email: response.user.email,
        username: response.user.username,
        displayName: `${response.user.first_name} ${response.user.last_name}`,
        first_name: response.user.first_name,
        last_name: response.user.last_name,
        avatarUrl: response.user.avatar_url,
        bio: response.user.bio,
        location: response.user.location,
        website: response.user.website,
        githubUsername: response.user.github_username,
        twitterHandle: response.user.twitter_username,
        reputation: response.user.reputation,
        role_id: response.user.role_id,
        createdAt: response.user.created_at,
        updatedAt: response.user.updated_at,
        accessToken: response.accessToken,
      }

      user.value = userData
      authToken.value = response.accessToken

      return userData
    } catch (error: any) {
      throw new Error(error.message || 'Login failed')
    }
  }

  const signUp = async (data: RegisterRequest) => {
    try {
      const response: BaseAuthResponse = await register(data)

      // Convert Base response to AlbDev format
      const userData: AlbDevUser = {
        id: response.user.id,
        email: response.user.email,
        username: response.user.username,
        displayName: `${response.user.first_name} ${response.user.last_name}`,
        first_name: response.user.first_name,
        last_name: response.user.last_name,
        avatarUrl: response.user.avatar_url,
        bio: response.user.bio,
        location: response.user.location,
        website: response.user.website,
        githubUsername: response.user.github_username,
        twitterHandle: response.user.twitter_username,
        reputation: response.user.reputation,
        role_id: response.user.role_id,
        createdAt: response.user.created_at,
        updatedAt: response.user.updated_at,
        accessToken: response.accessToken,
      }

      user.value = userData
      authToken.value = response.accessToken

      return userData
    } catch (error: any) {
      throw new Error(error.message || 'Registration failed')
    }
  }

  const signOut = async () => {
    try {
      // Call Base API logout
      await baseLogout()

      // Clear state
      user.value = null
      authToken.value = null
    } catch (error: any) {
      // Log error but still clear local state
      console.error('Logout error:', error)
      user.value = null
      authToken.value = null
    }
  }

  // Initialize auth - check if user is already logged in
  const initAuth = async () => {
    const baseUser = getCurrentUser()
    if (baseUser && isAuthenticated()) {
      user.value = {
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
      }
      authToken.value = localStorage.getItem('base_access_token')
      return user.value
    }
    return null
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
