// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',

  future: {
    compatibilityVersion: 4
  },

  devtools: { enabled: true },

  modules: [
    '@nuxt/ui',
    '@nuxtjs/mdc'
  ],

  ui: {
    theme: {
      colors: ['primary', 'secondary', 'teal', 'success', 'warning', 'error']
    }
  },

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    // Public keys (exposed to client) - hardcoded for static build
    public: {
      // Base.al API Configuration
      baseApiUrl: process.env.BASE_API_URL || 'http://localhost:8100',
      baseApiKey: process.env.BASE_API_KEY || 'albdev_api_key_for_frontend_access_12345',

      // Firebase Configuration (for Firestore only - NOT authentication)
      firebaseApiKey: 'AIzaSyDSeTvW6CbgBjRUfzG734CVuC54pv9iajM',
      firebaseAuthDomain: 'albaniandotdev.firebaseapp.com',
      firebaseProjectId: 'albaniandotdev',
      firebaseStorageBucket: 'albaniandotdev.firebasestorage.app',
      firebaseMessagingSenderId: '189842779837',
      firebaseAppId: '1:189842779837:web:38ac2bfc404c52a69bd1d4',

      // OAuth Configuration (for social login via Base API)
      oauthBaseAuthorizeUrl: 'https://accounts.base.al/oauth/authorize',
      oauthBaseTokenUrl: 'https://accounts.base.al/oauth/token',
      oauthBaseUserinfoUrl: 'https://accounts.base.al/oauth/userinfo',
      oauthBaseClientId: 'albdev_client_id', // TODO: Replace with actual client ID
      oauthBaseRedirectUri: 'https://albanian.dev/auth/callback'
    }
  },

  ssr: false,

  nitro: {
    preset: 'static'
  },

  typescript: {
    strict: false,
    typeCheck: false
  },

  app: {
    head: {
      title: 'AlbDev - Albanian Developer Community',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Albanian Developer Community - Share, discuss, and learn together' }
      ]
    }
  }
})
