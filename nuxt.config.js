import colors from 'vuetify/es5/util/colors'

export default {
  // Disable server-side rendering (https://go.nuxtjs.dev/ssr-mode)
  ssr: false,

  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    titleTemplate: '%s - sharingthailand',
    title: 'sharingthailand',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      //{ hid: 'og:title', property: 'og:title', content: 'SharingThailand' },
      //{ hid: 'og:url', property: 'og:url', content: 'https://sharingthailand.com' },
      //{ hid: 'og:image', property: 'og:image', content: 'http://via.placeholder.com/1200x630' },
      //{ hid: 'og:description', property: 'og:description', content: 'SharingThailand' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      // {
      //   rel: 'stylesheet',
      //   type : 'text/css',
      //   href:
      //     'https://fonts.googleapis.com/css2?family=Mitr:wght@300&display=swap',
      // },
      {
        rel: 'stylesheet',
        type : 'text/css',
        href:
          '//db.onlinewebfonts.com/c/9e29a765855a9000ab8e4aa2883d5384?family=DB+Helvethaica+X+Reg',
      },
    ],
    script: [{ src: '/js/fb-sdk.js' }],
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [
    '@assets/main.css',
    '@assets/fonts/stylesheet.css'
  ],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    { src: '@/plugins/datetimepicker.js' },
    { src: '@/plugins/countdown.js' },
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: [
    {
      path: '~/pages/Marketing/Components/',
      prefix: 'marketing',
    },
  ],

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    '@nuxtjs/proxy',
    'cookie-universal-nuxt',
    //'axios'
  ],

  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  axios: {
    baseURL: 'https://sharingthailand.com/api',
  },

  proxy: {
    '/api': {
      target: 'https://sharingthailand.com/api',
      //target: 'https://sharingthailand.com/api',
      pathRewrite: {
        '^/api': '/',
      },
    },
  },

  // Vuetify module configuration (https://go.nuxtjs.dev/config-vuetify)
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    treeShake : true,
    //defaultAssets : false,
    theme: {
      dark: true,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
        },
      },
    },
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
    // transpile: [
    //   'vuetify-datetime-picker',
    // ],
  },
}
