export default defineNuxtRouteMiddleware((to, from) => {
  const { user } = useAuth()

  if (!user.value) {
    return navigateTo('/')
  }

  if (!user.value.roles?.includes('admin')) {
    return navigateTo('/')
  }
})
