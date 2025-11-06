<template>
  <UCard>
    <template #header>
      <h2 class="text-xl font-bold">
        {{ isSignUp ? 'Create Account' : 'Welcome Back' }}
      </h2>
    </template>

    <div class="space-y-4">
      <!-- OAuth Login -->
      <UButton
        @click="handleBaseLogin"
        block
        size="lg"
        variant="outline"
        color="gray"
        class="relative"
      >
        <template #leading>
          <img src="https://base.al/base.svg" alt="Base" class="w-5 h-5" />
        </template>
        Continue with Base
      </UButton>

      <!-- Divider -->
      <div class="relative my-6">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-gray-300 dark:border-gray-700"></div>
        </div>
        <div class="relative flex justify-center text-sm">
          <span class="px-2 bg-white dark:bg-gray-800 text-gray-500">Or continue with email</span>
        </div>
      </div>

      <!-- Email/Password Form -->
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div v-if="isSignUp" class="grid grid-cols-2 gap-4">
          <UFormField label="First Name" required>
            <UInput
              v-model="formData.first_name"
              placeholder="John"
              icon="i-heroicons-user"
            />
          </UFormField>

          <UFormField label="Last Name" required>
            <UInput
              v-model="formData.last_name"
              placeholder="Doe"
              icon="i-heroicons-user"
            />
          </UFormField>
        </div>

        <UFormField v-if="isSignUp" label="Username" required>
          <UInput
            v-model="formData.username"
            placeholder="johndoe"
            icon="i-heroicons-at-symbol"
          />
        </UFormField>

        <UFormField label="Email" required>
          <UInput
            v-model="formData.email"
            type="email"
            placeholder="john@example.com"
            icon="i-heroicons-envelope"
          />
        </UFormField>

        <UFormField label="Password" required>
          <UInput
            v-model="formData.password"
            type="password"
            :placeholder="isSignUp ? 'At least 8 characters' : 'Enter password'"
            icon="i-heroicons-lock-closed"
          />
        </UFormField>

        <UButton
          type="submit"
          block
          size="lg"
          :loading="loading"
          :label="isSignUp ? 'Sign Up' : 'Log In'"
        />

        <p class="text-center text-sm text-gray-600 dark:text-gray-400">
          {{ isSignUp ? 'Already have an account?' : "Don't have an account?" }}
          <button
            type="button"
            class="text-primary font-semibold hover:underline"
            @click="isSignUp = !isSignUp"
          >
            {{ isSignUp ? 'Log In' : 'Sign Up' }}
          </button>
        </p>
      </form>
    </div>
  </UCard>
</template>

<script setup lang="ts">
const { signIn, signUp } = useAuth()
const isSignUp = ref(false)
const loading = ref(false)

const formData = reactive({
  first_name: '',
  last_name: '',
  email: '',
  password: '',
  username: ''
})

const handleSubmit = async () => {
  loading.value = true

  try {
    if (isSignUp.value) {
      // Validate required fields for signup
      if (!formData.first_name || !formData.last_name || !formData.username) {
        alert('Please fill in all required fields')
        loading.value = false
        return
      }
      await signUp({
        first_name: formData.first_name,
        last_name: formData.last_name,
        username: formData.username,
        email: formData.email,
        password: formData.password
      })
    } else {
      await signIn(formData.email, formData.password)
    }

    // Redirect to home on success
    await navigateTo('/')
  } catch (error: any) {
    console.error('Auth error:', error)
    alert(`Authentication failed: ${error.message || 'Unknown error'}`)
  } finally {
    loading.value = false
  }
}

const handleBaseLogin = () => {
  const config = useRuntimeConfig()

  // Build OAuth authorization URL
  const params = new URLSearchParams({
    client_id: config.public.oauthBaseClientId,
    redirect_uri: config.public.oauthBaseRedirectUri,
    response_type: 'code',
    scope: 'openid profile email'
  })

  const authUrl = `${config.public.oauthBaseAuthorizeUrl}?${params.toString()}`

  // Open OAuth popup
  const width = 600
  const height = 700
  const left = (window.screen.width - width) / 2
  const top = (window.screen.height - height) / 2

  const popup = window.open(
    authUrl,
    'Base.al Login',
    `width=${width},height=${height},left=${left},top=${top},toolbar=no,location=no,status=no,menubar=no`
  )

  // Listen for OAuth callback message
  const messageHandler = (event: MessageEvent) => {
    if (event.origin !== window.location.origin) return

    if (event.data.type === 'oauth-success') {
      console.log('OAuth success:', event.data.user)

      // Update auth state with new user
      const { user } = useAuth()
      user.value = event.data.user

      window.removeEventListener('message', messageHandler)
      popup?.close()

      // Reload page to update UI
      window.location.reload()
    } else if (event.data.type === 'oauth-error') {
      console.error('OAuth error:', event.data.error)
      window.removeEventListener('message', messageHandler)
      popup?.close()

      // Show error toast (TODO: add toast notification)
      alert(`Authentication failed: ${event.data.error}`)
    }
  }

  window.addEventListener('message', messageHandler)
}
</script>
