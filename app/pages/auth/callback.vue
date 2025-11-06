<template>
  <UContainer class="py-8">
    <UCard>
      <div class="text-center py-8">
        <UIcon name="i-heroicons-arrow-path" class="w-12 h-12 mx-auto mb-4 animate-spin text-primary" />
        <p class="text-lg">Completing authentication...</p>
      </div>
    </UCard>
  </UContainer>
</template>

<script setup lang="ts">
import { getAuth, signInWithCustomToken } from 'firebase/auth'

const route = useRoute()
const config = useRuntimeConfig()

onMounted(async () => {
  const code = route.query.code as string

  if (!code) {
    console.error('No authorization code found')
    window.close()
    return
  }

  try {
    // Exchange code for tokens (this would normally be done server-side)
    // For now, we'll use the code to get user info directly
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
      throw new Error('Failed to exchange code for token')
    }

    const tokens = await tokenResponse.json()

    // Get user info
    const userResponse = await fetch(config.public.oauthBaseUserinfoUrl, {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    })

    if (!userResponse.ok) {
      throw new Error('Failed to get user info')
    }

    const userInfo = await userResponse.json()

    // If this is a popup, send message to parent
    if (window.opener) {
      window.opener.postMessage({
        type: 'oauth-success',
        user: userInfo
      }, window.location.origin)
      window.close()
    } else {
      // If not a popup, redirect to home
      navigateTo('/')
    }
  } catch (error) {
    console.error('OAuth callback error:', error)

    if (window.opener) {
      window.opener.postMessage({
        type: 'oauth-error',
        error: error.message
      }, window.location.origin)
      window.close()
    } else {
      navigateTo('/')
    }
  }
})
</script>
