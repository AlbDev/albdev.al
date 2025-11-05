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

  runtimeConfig: {
    // Private keys (server-side only)
    firebasePrivateKey: '',
    firebaseClientEmail: '',
    oauthBaseClientId: '',
    oauthBaseClientSecret: '',
    oauthBaseRedirectUri: '',

    // Public keys (exposed to client)
    public: {
      firebaseApiKey: '',
      firebaseAuthDomain: '',
      firebaseProjectId: '',
      firebaseStorageBucket: '',
      firebaseMessagingSenderId: '',
      firebaseAppId: '',
      oauthBaseAuthorizeUrl: '',
      oauthBaseTokenUrl: '',
      oauthBaseUserinfoUrl: ''
    }
  },

  nitro: {
    preset: 'firebase',
    firebase: {
      gen: 2,
      serverFunctionName: 'albdevServer'
    }
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
