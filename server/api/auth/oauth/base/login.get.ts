export default defineEventHandler((event) => {
  const config = useRuntimeConfig()

  const authUrl = new URL(config.public.oauthBaseAuthorizeUrl)
  authUrl.searchParams.set('client_id', config.oauthBaseClientId)
  authUrl.searchParams.set('redirect_uri', config.oauthBaseRedirectUri)
  authUrl.searchParams.set('response_type', 'code')
  authUrl.searchParams.set('scope', 'openid profile email avatar')

  return sendRedirect(event, authUrl.toString())
})
