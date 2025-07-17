import colors from 'vuetify/es5/util/colors'

export default {
  // Disable server-side rendering
  ssr: false,

  // Global page headers
  head: {
    titleTemplate: '%s - rbg-img-finals',
    title: 'rbg-img-finals',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS
  css: [
  ],

  // Plugins
  plugins: [
  ],

  // Auto import components
  components: true,

  // Build Modules
  buildModules: [
    '@nuxtjs/vuetify',
  ],

  // Modules
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/auth-next'
  ],

  // Auth configuration
  auth: {
    strategies: {
      google: {
        clientId: '721612083479-irseivo0evhhj8jccvoq8bvdq6dhtupa.apps.googleusercontent.com',
        codeChallengeMethod: '',
        responseType: 'code',
        endpoints: {
          token: 'http://localhost:3000/auth/google/callback', // Update with your backend
          userInfo: 'https://www.googleapis.com/oauth2/v3/userinfo'
        },
        scope: ['openid', 'profile', 'email']
      },
      local: {
        token: {
          property: 'token',
          global: true,
        },
        user: {
          property: 'user',
          autoFetch: true
        },
        endpoints: {
          login: { url: '/api/auth/login', method: 'post' },
          logout: { url: '/api/auth/logout', method: 'post' },
          user: { url: '/api/auth/user', method: 'get' }
        }
      }
    },
    redirect: {
      login: '/auth/signin',
      logout: '/',
      callback: '/auth/google/callback',
      home: '/'
    }
  },

  // Vuetify configuration
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        light: {
          primary: colors.blue.darken2,
          secondary: colors.amber.darken3,
          accent: colors.grey.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        },
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },

  // Build configuration
  build: {
  },

  // Server middleware (if needed)
  serverMiddleware: [
    { path: '/api', handler: '~/server/api.js' }
  ],

  // Environment variables
  publicRuntimeConfig: {
    axios: {
      baseURL: process.env.BASE_URL || 'http://localhost:3000'
    }
  }
}