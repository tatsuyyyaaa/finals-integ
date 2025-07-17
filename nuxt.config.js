import colors from 'vuetify/lib/util/colors'

export default {
  // Disable server-side rendering (SPA mode)
  ssr: false,
  target: 'static',

  // Global page headers
  head: {
    titleTemplate: '%s - My App',
    title: 'My App',
    htmlAttrs: { lang: 'en' },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'My application description' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS
  css: [
    '~/assets/main.css'
  ],

  // Plugins
  plugins: [
    '~/plugins/axios.js'
  ],

  // Auto import components
  components: true,

  // Build Modules
  buildModules: [
    '@nuxtjs/vuetify',
    '@nuxtjs/dotenv'
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
        clientId: process.env.GOOGLE_CLIENT_ID,
        codeChallengeMethod: '',
        responseType: 'code',
        endpoints: {
          token: `${process.env.API_BASE_URL}/auth/google/callback`,
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
        }
      }
    }
  },

  // Build configuration
  build: {
    transpile: ['vuetify']
  },

  // Environment variables
  publicRuntimeConfig: {
    axios: {
      baseURL: process.env.API_BASE_URL || 'http://localhost:3000'
    },
    googleClientId: process.env.GOOGLE_CLIENT_ID
  },

  privateRuntimeConfig: {
    apiSecret: process.env.API_SECRET
  }
}