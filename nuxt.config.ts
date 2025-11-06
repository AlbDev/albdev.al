// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',

  future: {
    compatibilityVersion: 4
  },

  devtools: { enabled: true },

  modules: [
    '@nuxt/ui'
  ],

  css: ['~/app/assets/css/main.css'],

  runtimeConfig: {
    // Public keys (exposed to client) - hardcoded for static build
    public: {
      firebaseApiKey: 'AIzaSyDSeTvW6CbgBjRUfzG734CVuC54pv9iajM',
      firebaseAuthDomain: 'albaniandotdev.firebaseapp.com',
      firebaseProjectId: 'albaniandotdev',
      firebaseStorageBucket: 'albaniandotdev.firebasestorage.app',
      firebaseMessagingSenderId: '189842779837',
      firebaseAppId: '1:189842779837:web:38ac2bfc404c52a69bd1d4',
      oauthBaseAuthorizeUrl: 'https://accounts.base.al/oauth/authorize',
      oauthBaseTokenUrl: 'https://accounts.base.al/oauth/token',
      oauthBaseUserinfoUrl: 'https://accounts.base.al/oauth/userinfo'
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
