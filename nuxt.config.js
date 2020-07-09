import { readFileSync } from 'fs'
import crypto from 'crypto'
import { parse } from 'dotenv'

// Gravatar

const envFileName =
  process.env.NODE_ENV === 'production' ? '.env.production' : '.env.local'
const envConfig = parse(readFileSync(envFileName))
const md5Hash = crypto.createHash('md5')
md5Hash.update('sush@sus-happy.net')
const avatar = `https://www.gravatar.com/avatar/${md5Hash.digest('hex')}?s=480`

module.exports = {
  mode: 'spa',

  env: {
    avatar,
  },

  /*
   ** Headers of the page
   */
  head: {
    // title: 'SUSH-i LOG',
    titleTemplate: (titleChunk) => {
      return titleChunk ? `${titleChunk} - SUSH-i LOG` : 'SUSH-i LOG'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || '',
      },
      { hid: 'og:site_name', property: 'og:site_name', content: 'SUSH-i LOG' },
      { hid: 'og:type', property: 'og:type', content: 'website' },
      { hid: 'og:url', property: 'og:url', content: envConfig.URL },
      { hid: 'og:title', property: 'og:title', content: 'SUSH-i LOG' },
      {
        hid: 'og:description',
        property: 'og:description',
        content: process.env.npm_package_description || '',
      },
      {
        hid: 'og:image',
        property: 'og:image',
        content: envConfig.URL + '/content/background.jpg',
      },
      { name: 'msapplication-TileColor', content: '#ffffff' },
      { name: 'theme-color', content: '#ffffff' },
    ],
    link: [
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/apple-touch-icon.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: '/favicon-32x32.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: '/favicon-16x16.png',
      },
      { rel: 'manifest', href: '/site.webmanifest' },
      { rel: 'mask-icon', href: '/safari-pinned-tab.svg', color: '#5bbad5' },
    ],
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: [],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '~/plugins/date-fns.ts',
    { src: '~/plugins/vue-infinite-loading.ts', ssr: false },
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    '@nuxt/typescript-build',
    // Doc: https://github.com/nuxt-community/stylelint-module
    '@nuxtjs/stylelint-module',
    // Doc: https://github.com/nuxt-community/nuxt-tailwindcss
    '@nuxtjs/tailwindcss',
    [
      '@nuxtjs/fontawesome',
      {
        icons: {
          solid: [
            'faLink',
            'faTag',
            'faMountain',
            'faAngleLeft',
            'faAngleRight',
          ],
          regular: ['faClock'],
          brands: ['faTwitter', 'faFacebookF', 'faGithubAlt'],
        },
      },
    ],
    '@aceforth/nuxt-optimized-images',
    'nuxt-composition-api',
    '@nuxtjs/gtm',
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    '@nuxtjs/pwa',
    // Doc: https://github.com/nuxt-community/dotenv-module
    '@nuxtjs/dotenv',
    '@nuxt/content',
  ],
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    // extend(config, ctx) {}
    postcss: {
      // キーとしてプラグイン名を、値として引数を追加します
      // プラグインは前もって npm か yarn で dependencies としてインストールしておきます
      plugins: {
        // 値として false を渡すことによりプラグインを無効化します
        'postcss-nested': {},
      },
    },
  },
  // Content
  content: {
    markdown: {
      prism: {
        theme: 'prism-themes/themes/prism-vsc-dark-plus.css',
      },
    },
  },

  optimizedImages: {
    optimizeImages: true,
  },

  generate: {
    async routes() {
      const { $content } = require('@nuxt/content')
      const files = await $content().only(['path']).fetch()

      return files.map((file) => (file.path === '/index' ? '/' : file.path))
    },
  },
  gtm: {
    id: 'GTM-KJLXDZ',
  },
}
