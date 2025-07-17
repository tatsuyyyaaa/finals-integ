import colors from 'vuetify/lib/util/colors'

export default {
  // Basic SPA configuration
  ssr: false,
  target: 'static',

  // Essential head tags
  head: {
    title: 'My App',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Vuetify module only
  buildModules: [
    '@nuxtjs/vuetify'
  ],

  // Simple Vuetify theme
  vuetify: {
    theme: {
      themes: {
        light: {
          primary: colors.blue.darken2,
          secondary: colors.amber.darken3,
          error: colors.red.accent3
        }
      }
    }
  },

  // Basic build config
  build: {
    transpile: ['vuetify']
  }
}