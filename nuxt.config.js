import colors from 'vuetify/lib/util/colors'

export default {
  ssr: false,
  target: 'static',

  server: {
    host: process.env.NODE_ENV === 'production' ? '0' : 'localhost',
    port: process.env.PORT || 3000
  },

  publicRuntimeConfig: {
    baseURL: process.env.BASE_URL || 'https://finals-integ-4bta.vercel.app',
    removeBgApiKey: process.env.REMOVEBG_API_KEY,
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    axios: {
      baseURL: process.env.BASE_URL || 'https://finals-integ-4bta.vercel.app'
    }
  },

  router: {
    middleware: ['auth']
  },

  auth: {
    redirect: {
      login: '/auth/signin',
      logout: '/auth/signin',
      callback: '/auth/callback',
      home: '/'
    },
    cookie: {
      options: {
        secure: true,
        domain: '.vercel.app'
      }
    },
    autoFetchUser: true,
    strategies: {
      google: {
        scheme: 'oauth2',
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        redirectUri:
          process.env.NODE_ENV === 'production'
            ? 'https://finals-integ-4bta.vercel.app/auth/callback'
            : 'http://localhost:3000/auth/callback',
        responseType: 'code',
        codeChallengeMethod: 'S256', // ✅ REQUIRED for PKCE
        token: {
          property: 'access_token',
          type: 'Bearer',
          maxAge: 1800
        },
        user: {
          property: false
        },
        endpoints: {
          authorization: 'https://accounts.google.com/o/oauth2/v2/auth',
          token: 'https://oauth2.googleapis.com/token',
          userInfo: 'https://www.googleapis.com/oauth2/v3/userinfo'
        },
        scope: ['openid', 'profile', 'email']
      }
    }
  },

  head: {
    titleTemplate: '%s - BG Remover Tool',
    title: 'Background Remover Tool',
    htmlAttrs: { lang: 'en' },
    meta: [
      { charset: 'utf-8' },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no'
      },
      {
        hid: 'description',
        name: 'description',
        content: 'Remove image backgrounds instantly using AI technology'
      }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap'
      }
    ]
  },

  css: [],

  plugins: [
    {
      src: '~/plugins/removeBgApi.client.js',
      mode: 'client'
    }
  ],

  components: true,

  buildModules: [
    '@nuxtjs/vuetify',
    '@nuxtjs/dotenv'
  ],

  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/auth-next'
  ],

  vuetify: {
    theme: {
      dark: true,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          error: colors.red.accent3,
          success: colors.green.accent3
        }
      }
    },
    defaultAssets: {
      font: true,
      icons: 'mdi'
    }
  },

  build: {
    transpile: ['vuetify'],
    postcss: {
      postcssOptions: {
        plugins: {
          'postcss-preset-env': {
            stage: 3,
            features: {
              'nesting-rules': true
            }
          }
        }
      }
    }
  }
}
