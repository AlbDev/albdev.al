<template>
  <UCard>
    <template #header>
      <h2 class="text-xl font-bold">
        {{ isSignUp ? 'Create Account' : 'Welcome Back' }}
      </h2>
    </template>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <UFormGroup v-if="isSignUp" label="Username" required>
        <UInput
          v-model="formData.username"
          placeholder="Enter username"
          icon="i-heroicons-user"
        />
      </UFormGroup>

      <UFormGroup label="Email" required>
        <UInput
          v-model="formData.email"
          type="email"
          placeholder="Enter email"
          icon="i-heroicons-envelope"
        />
      </UFormGroup>

      <UFormGroup label="Password" required>
        <UInput
          v-model="formData.password"
          type="password"
          placeholder="Enter password"
          icon="i-heroicons-lock-closed"
        />
      </UFormGroup>

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
  </UCard>
</template>

<script setup lang="ts">
const emit = defineEmits(['close'])

const { signIn, signUp } = useAuth()
const isSignUp = ref(false)
const loading = ref(false)

const formData = reactive({
  email: '',
  password: '',
  username: ''
})

const handleSubmit = async () => {
  loading.value = true

  try {
    if (isSignUp.value) {
      await signUp(formData.email, formData.password, formData.username)
    } else {
      await signIn(formData.email, formData.password)
    }
    emit('close')
  } catch (error: any) {
    console.error('Auth error:', error)
    // Show error toast
  } finally {
    loading.value = false
  }
}
</script>
