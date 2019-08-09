import NuxtConfiguration from '@nuxt/config'
import sass from 'sass'
import fibers from 'fibers'

import summary from './.posts/summary.json'

import { parse } from 'dotenv'
import { readFileSync } from 'fs'

const envFileName = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.local'
const envConfig = parse(readFileSync(envFileName))

// Gravatar
import crypto from 'crypto'
const md5Hash = crypto.createHash('md5')
md5Hash.update('sush@sus-happy.net')
const avatar = `https://www.gravatar.com/avatar/${md5Hash.digest('hex')}?s=480`

const config: NuxtConfiguration = {
  mode: 'universal',

  env: {
    avatar
  },

  generate: {
    routes() {
      return Object.keys(summary.fileMap).map((key: string) => {
        const row = summary.fileMap[key]
        return row.base.split('.')[0]
      })
    }
  },

  /*
   ** Headers of the page
   */
  head: {
    title: 'SUSH-i BLOG',
    titleTemplate: '%s - SUSH-i BLOG',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      },
      { hid: 'og:site_name', property: 'og:site_name', content: 'SUSH-i BLOG' },
      { hid: 'og:type', property: 'og:type', content: 'website' },
      { hid: 'og:url', property: 'og:url', content: envConfig.URL },
      { hid: 'og:title', property: 'og:title', content: 'SUSH-i BLOG' },
      { hid: 'og:description', property: 'og:description', content: process.env.npm_package_description || '' },
      { hid: 'og:image', property: 'og:image', content: envConfig.URL + '/content/background.gif' }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: ['ress/ress.css', '~/assets/scss/styles.scss', 'prismjs/themes/prism-okaidia.css'],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: ['~/plugins/date-fns.ts', { src: '~plugins/ga.js', ssr: false }],
  /*
   ** Nuxt.js modules
   */
  modules: [
    '@nuxtjs/pwa',
    '@nuxtjs/eslint-module',
    '@nuxtjs/axios',
    'nuxt-fontawesome',
    ['@nuxtjs/dotenv', { filename: envFileName }]
  ],
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {
      if (!config.module) {
        return
      }

      config.module.rules.push({
        test: /\.md$/,
        use: 'frontmatter-markdown-loader'
      })
    },

    loaders: {
      scss: {
        data: `@import "~/assets/scss/_import.scss";`,
        implementation: sass,
        fiber: fibers
      }
    }
  },
  fontawesome: {
    imports: [
      {
        set: '@fortawesome/free-solid-svg-icons',
        icons: ['fas']
      },
      {
        set: '@fortawesome/free-brands-svg-icons',
        icons: ['fab']
      },
      {
        set: '@fortawesome/free-regular-svg-icons',
        icons: ['far']
      }
    ]
  }
}

export default config
