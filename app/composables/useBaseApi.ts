/**
 * Base API Composable
 *
 * This composable provides integration with the Base.al API backend.
 * It handles authentication, API calls, and token management.
 */

export interface BaseUser {
  id: number
  first_name: string
  last_name: string
  username: string
  email: string
  phone?: string
  role_id: number
  avatar_url?: string
  bio?: string
  location?: string
  website?: string
  github_username?: string
  twitter_username?: string
  reputation: number
  created_at: string
  updated_at: string
}

export interface BaseAuthResponse {
  user: BaseUser
  accessToken: string
  exp: number
  extend?: any
}

export interface RegisterRequest {
  first_name: string
  last_name: string
  username: string
  email: string
  password: string
  phone?: string
}

export interface LoginRequest {
  email: string
  password: string
}

export const useBaseApi = () => {
  const config = useRuntimeConfig()
  const baseURL = config.public.baseApiUrl || 'http://localhost:8100'
  const apiKey = config.public.baseApiKey || 'albdev_api_key_for_frontend_access_12345'

  // Get stored token
  const getToken = () => {
    if (process.client) {
      return localStorage.getItem('base_access_token')
    }
    return null
  }

  // Make authenticated API request
  const apiRequest = async <T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> => {
    const token = getToken()

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'X-API-Key': apiKey,
      ...options.headers,
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(`${baseURL}${endpoint}`, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: response.statusText }))
      throw new Error(error.error || error.message || 'API request failed')
    }

    return response.json()
  }

  // Register new user
  const register = async (data: RegisterRequest): Promise<BaseAuthResponse> => {
    const response = await apiRequest<BaseAuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    })

    // Store token and user info
    if (process.client) {
      localStorage.setItem('base_access_token', response.accessToken)
      localStorage.setItem('base_user', JSON.stringify(response.user))
    }

    return response
  }

  // Login user
  const login = async (data: LoginRequest): Promise<BaseAuthResponse> => {
    const response = await apiRequest<BaseAuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    })

    // Store token and user info
    if (process.client) {
      localStorage.setItem('base_access_token', response.accessToken)
      localStorage.setItem('base_user', JSON.stringify(response.user))
    }

    return response
  }

  // Logout user
  const logout = async () => {
    try {
      await apiRequest('/auth/logout', {
        method: 'POST',
      })
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Clear local storage regardless of API response
      if (process.client) {
        localStorage.removeItem('base_access_token')
        localStorage.removeItem('base_user')
      }
    }
  }

  // Forgot password
  const forgotPassword = async (email: string): Promise<{ message: string }> => {
    return apiRequest('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    })
  }

  // Reset password
  const resetPassword = async (
    email: string,
    token: string,
    newPassword: string
  ): Promise<{ message: string }> => {
    return apiRequest('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({
        email,
        token,
        new_password: newPassword,
      }),
    })
  }

  // Get current user from localStorage
  const getCurrentUser = (): BaseUser | null => {
    if (process.client) {
      const userStr = localStorage.getItem('base_user')
      if (userStr) {
        try {
          return JSON.parse(userStr)
        } catch (e) {
          return null
        }
      }
    }
    return null
  }

  // Check if user is authenticated
  const isAuthenticated = (): boolean => {
    return !!getToken() && !!getCurrentUser()
  }

  // Get user profile
  const getProfile = async (userId: number): Promise<BaseUser> => {
    return apiRequest(`/profile/${userId}`)
  }

  // Update user profile
  const updateProfile = async (userId: number, data: Partial<BaseUser>): Promise<BaseUser> => {
    return apiRequest(`/profile/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  return {
    // API methods
    apiRequest,

    // Auth methods
    register,
    login,
    logout,
    forgotPassword,
    resetPassword,

    // User methods
    getCurrentUser,
    isAuthenticated,
    getProfile,
    updateProfile,

    // Utilities
    getToken,
    baseURL,
  }
}
