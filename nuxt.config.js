import colors from 'vuetify/lib/util/colors'

export default {
  ssr: false,

  server: {
    host: process.env.NODE_ENV === 'production' ? '0' : 'localhost',
    port: process.env.PORT || 3000
  },

  publicRuntimeConfig: {
    baseURL: process.env.BASE_URL || 'https://finals-integ-4bta.vercel.app',
    removeBgApiKey: process.env.SLAZZER_API_KEY,
    auth0Domain: process.env.AUTH0_DOMAIN,
    auth0ClientId: process.env.AUTH0_CLIENT_ID,
    auth0Callback: process.env.AUTH0_CALLBACK_URL,
    googleRedirectUri: process.env.GOOGLE_REDIRECT_URI,
    facebookRedirectUri: process.env.FACEBOOK_REDIRECT_URI
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
    autoFetchUser: false,
    strategies: {
      auth0: {
        domain: process.env.AUTH0_DOMAIN,
        clientId: process.env.AUTH0_CLIENT_ID,
        redirectUri: process.env.AUTH0_CALLBACK_URL,
        audience: '', // Optional: only if you enabled API access
        logoutRedirectUri: process.env.BASE_URL,
        scope: ['openid', 'profile', 'email']
      },
      google: {
        scheme: 'oauth2',
        clientId: process.env.GOOGLE_CLIENT_ID,
        redirectUri: process.env.GOOGLE_REDIRECT_URI,
        endpoints: {
          authorization: 'https://accounts.google.com/o/oauth2/auth',
          userInfo: 'https://www.googleapis.com/oauth2/v3/userinfo'
        },
        token: {
          property: 'access_token',
          type: 'Bearer',
          maxAge: 1800
        },
        responseType: 'token id_token',
        scope: ['openid', 'profile', 'email'],
        codeChallengeMethod: "",
      },
      facebook: {
        scheme: 'oauth2',
        clientId: process.env.FACEBOOK_CLIENT_ID,
        redirectUri: process.env.FACEBOOK_REDIRECT_URI,
        endpoints: {
          authorization: 'https://www.facebook.com/v10.0/dialog/oauth',
          userInfo: 'https://graph.facebook.com/me?fields=id,name,email,picture'
        },
        scope: ['public_profile', 'email'],
        responseType: 'token',
        token: {
          property: 'access_token',
          type: 'Bearer',
          maxAge: 1800
        }
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

  css: ['vue-toastification/dist/index.css'],

  plugins: [
    { src: '~/plugins/removeBgApi.client.js', mode: 'client' },
    { src: '~/plugins/toast.client.js', mode: 'client' }
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
