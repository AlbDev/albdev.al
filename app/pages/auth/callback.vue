<template>
  <UContainer class="py-8">
    <UCard>
      <div class="text-center py-8">
        <UIcon
          v-if="!error"
          name="i-heroicons-arrow-path"
          class="w-12 h-12 mx-auto mb-4 animate-spin text-primary"
        />
        <UIcon
          v-else
          name="i-heroicons-exclamation-triangle"
          class="w-12 h-12 mx-auto mb-4 text-error"
        />
        <p class="text-lg">{{ error || 'Completing authentication...' }}</p>
        <UButton
          v-if="error"
          @click="navigateTo('/')"
          class="mt-4"
          label="Return Home"
        />
      </div>
    </UCard>
  </UContainer>
</template>

<script setup lang="ts">
import { signInWithCustomToken } from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'

const route = useRoute()
const config = useRuntimeConfig()
const { $auth, $firestore } = useNuxtApp()
const error = ref('')

onMounted(async () => {
  const code = route.query.code as string

  if (!code) {
    error.value = 'No authorization code found'
    setTimeout(() => {
      if (window.opener) window.close()
      else navigateTo('/')
    }, 2000)
    return
  }

  try {
    // Exchange code for tokens
    const tokenResponse = await fetch(config.public.oauthBaseTokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        client_id: config.public.oauthBaseClientId,
        redirect_uri: config.public.oauthBaseRedirectUri,
      }),
    })

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text()
      console.error('Token exchange failed:', errorData)
      throw new Error('Failed to exchange code for token')
    }

    const tokens = await tokenResponse.json()

    // Get user info from Base.al
    const userResponse = await fetch(config.public.oauthBaseUserinfoUrl, {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    })

    if (!userResponse.ok) {
      throw new Error('Failed to get user info')
    }

    const baseUserInfo = await userResponse.json()

    // TODO: Exchange Base.al token for Firebase custom token
    // For now, we'll create a Firebase user with email/password
    // This requires a server endpoint that creates custom tokens

    // Create or update user in Firestore
    const username = baseUserInfo.username || baseUserInfo.email.split('@')[0]
    const userId = `base_${baseUserInfo.sub || baseUserInfo.id}` // Use Base.al user ID

    const userRef = doc($firestore, 'users', userId)
    const userDoc = await getDoc(userRef)

    const now = new Date().toISOString()
    const userData = {
      uid: userId,
      email: baseUserInfo.email,
      username,
      displayName: baseUserInfo.name || username,
      avatarUrl: baseUserInfo.picture || baseUserInfo.avatar_url || null,
      bio: baseUserInfo.bio || null,
      location: baseUserInfo.location || null,
      website: baseUserInfo.website || null,
      reputation: 0,
      roles: ['user'],
      lastSeen: now,
      updatedAt: now,
    }

    if (!userDoc.exists()) {
      // First time user - create profile
      await setDoc(userRef, {
        ...userData,
        createdAt: now,
      })
    } else {
      // Update existing user
      await setDoc(userRef, userData, { merge: true })
    }

    // Store user info in localStorage for client-side auth
    localStorage.setItem('albdev_user', JSON.stringify({
      ...userData,
      accessToken: tokens.access_token,
    }))

    // If this is a popup, send message to parent
    if (window.opener) {
      window.opener.postMessage({
        type: 'oauth-success',
        user: userData
      }, window.location.origin)

      setTimeout(() => {
        window.close()
      }, 500)
    } else {
      // If not a popup, redirect to home
      setTimeout(() => {
        navigateTo('/')
      }, 1000)
    }
  } catch (err: any) {
    console.error('OAuth callback error:', err)
    error.value = err.message || 'Authentication failed'

    if (window.opener) {
      window.opener.postMessage({
        type: 'oauth-error',
        error: err.message
      }, window.location.origin)

      setTimeout(() => {
        window.close()
      }, 2000)
    } else {
      setTimeout(() => {
        navigateTo('/')
      }, 3000)
    }
  }
})
</script>
