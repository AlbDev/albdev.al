export const useApi = () => {
  const { authToken } = useAuth()

  const apiFetch = $fetch.create({
    onRequest({ options }) {
      const token = authToken.value
      if (token) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${token}`
        }
      }
    }
  })

  return {
    apiFetch
  }
}
