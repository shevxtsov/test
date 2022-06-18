export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Пульт СОРМ',
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
      {
        rel: 'icon',
        type: 'image/x-icon',
        href: '/favicon.ico'
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css?family=Roboto&display=swap'
      }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '@/assets/scss/main.scss',

    // Modules
    '@/assets/scss/modules/forms.scss',
    '@/assets/scss/modules/spaces.scss',
    '@/assets/scss/modules/icons.scss',
    '@/assets/scss/modules/flex-grid.scss',
    '@/assets/scss/modules/btns.scss'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '@/plugins/nuxt-client-init.client.js',
    '@/plugins/event-bus.js',
    '@/plugins/mixins/global.js',

    // Modules
    '@/plugins/axios.js',
    '@/plugins/click-outside.js',
    '@/plugins/timer.js'
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    // '@nuxt/typescript-build'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/style-resources',
    '@nuxtjs/i18n'
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // baseUrl: process.env.API_URL || 'http://10.10.77.11:8086/api'
    // baseUrl: process.env.API_URL || 'http://192.168.1.219:8080/api'
    // baseUrl: process.env.API_URL || 'http://192.168.1.122:8086/api'
    baseUrl: process.env.API_URL || 'http://localhost:8080/api'
  },

  // Global scss variables
  styleResources: {
    scss: [
      '@/assets/scss/base/_vars.scss'
    ]
  },

  // Lang
  i18n: {
    strategy: 'no_prefix',
    locales: [
      { code: 'ru', name: 'RU', file: 'ru.js' },
      { code: 'kz', name: 'KZ', file: 'kz.js' }
    ],
    defaultLocale: 'ru',
    lazy: true,
    langDir: '@/assets/json/lang/'
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: ['vue-echarts', 'resize-detector']
  },
  server: {
    host: '0.0.0.0'
  }
}
