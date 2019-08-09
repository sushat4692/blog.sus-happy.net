<template lang="pug">
.p-detail
  .p-detail__thumb
    img(
      :src="attributes.thumbnail"
      v-if="attributes.thumbnail"
    )
    img(
      src="/content/background.gif"
      v-else
    )

  .g-container.p-detail__block(v-if="attributes")
    h1.p-detail__title {{ attributes.title }}

    .p-detail__meta
      time.p-detail__meta__time
        font-awesome-icon(:icon="['far', 'clock']")
        | {{ $distanceInWordsToNow(attributes.date) }}
      ul.p-detail__meta__tags(v-if="attributes.tags")
        li(v-for="tag in attributes.tags")
          router-link(:to="{name: 'tags-tag-p', params: {tag}}")
            font-awesome-icon(:icon="['fas', 'tag']")
            | {{ tag }}

    .p-detail__content(v-html="body")
</template>

<script lang="ts">
import marked from 'marked'
import Prism from 'prismjs'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-coffeescript'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-css-extras'
import 'prismjs/components/prism-docker'
import 'prismjs/components/prism-go'
import 'prismjs/components/prism-http'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-js-extras'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-markdown'
import 'prismjs/components/prism-markup-templating'
import 'prismjs/components/prism-nginx'
import 'prismjs/components/prism-perl'
import 'prismjs/components/prism-php'
import 'prismjs/components/prism-php-extras'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-twig'
import 'prismjs/components/prism-sql'
import 'prismjs/components/prism-sass'
import 'prismjs/components/prism-scss'
import 'prismjs/components/prism-ruby'
import 'prismjs/components/prism-pug'
import 'prismjs/components/prism-yaml'

// Mixins
import Meta from '~/assets/mixins/meta'
import Visual from '~/assets/mixins/visual'

export default {
  mixins: [Meta, Visual],

  async asyncData({ params }) {
    let post = {}
    let body = ''

    marked.setOptions({
      breaks: true,
      langPrefix: 'language-',
      highlight: function(code, lang: string) {
        lang = lang.toLowerCase()
        if (lang && lang.match(':')) {
          lang = lang.substring(0, lang.indexOf(':'))
        }
        if (lang in Prism.languages) {
          return Prism.highlight(code, Prism.languages[lang], lang)
        } else {
          return code
        }
      }
    })

    // Get post
    const content = await import(`~/posts/${params.slug}.md`)
    const attributes = content.attributes

    // Body
    body = marked(content.body, { sanitize: false })

    // Description
    const description =
      body
        .replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, '')
        .replace(/\r?\n/g, '')
        .substr(0, 200) + '...'

    // Meta
    const meta: any = {
      title: attributes.title,
      description,
      type: 'article',
      url: '/' + params.slug + '/'
    }

    if (attributes.thumbnail) {
      meta.image = attributes.thumbnail
    }

    return { post, body, attributes, meta }
  },

  async mounted() {
    await Prism.highlightAll()
    const thumbnail = (this as any).$el.querySelector('.p-detail__thumb img')
    if (thumbnail) {
      ;(this as any).mainVisual(thumbnail)
    }
  }
}
</script>

<style lang="scss" scoped>
.p-detail {
  &__thumb {
    img {
      width: 100%;
      height: 300px;
      object-fit: cover;

      @include mq_sp {
        height: 15rem;
      }
    }

    + .p-detail__block {
      margin-top: -10rem;
      position: relative;

      @include mq_sp {
        margin-top: 0;
      }
    }
  }

  &__title {
    font-size: 3.2rem;
    font-weight: bold;
    line-height: 1.2;
    margin: 0 0 1rem;
  }

  &__meta {
    color: #666;
    margin-bottom: 2rem;
    padding-bottom: 2rem;
    border-bottom: 1px dotted #ccc;

    svg {
      margin-right: 0.5em;
    }

    &__tags {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      flex-wrap: wrap;

      li {
        list-style: none;
        margin-top: 0.5em;
        margin-right: 1em;
      }

      a {
        text-decoration: none;
        color: inherit;

        &:hover {
          color: $color-base-red;
        }
      }
    }
  }

  &__block {
    background: #fff;
    border-radius: 5px 5px 0 0;

    @include mq_sp {
      border-radius: 0;
    }
  }
}
</style>

<style lang="scss">
.p-detail {
  &__content {
    line-height: 1.8;

    a {
      color: $color-base-red;
      &:visited {
        color: darken($color-base-red, 30);
      }
      &:hover {
        text-decoration: none;
      }
    }

    /**
     * Heading
     */
    h2,
    h3,
    h4,
    h5 {
      // font-size: 2.8rem;
      margin: 2em 0 0.5em;

      a {
        color: inherit;
        text-decoration: none;
      }
    }

    /**
     * Paragraph
     */
    p {
      margin: 1.4em 0;
    }

    /**
     * Image
     */
    img {
      max-width: 100%;
      height: auto;
      vertical-align: top;

      &[style*='float: left;'] {
        margin: 0 1.5em 1.5em 0;
      }
      &[style*='float: right;'] {
        margin: 0 0 1.5em 1.5em;
      }
    }

    /**
     * Table
     */
    table {
      margin: 1.4em 0;
      th {
        background: #eee;
        border: 1px solid #ccc;
        padding: 0.5em;
      }
      td {
        border: 1px solid #ccc;
        padding: 0.5em;
      }
    }

    /**
     * Media
     */
    iframe {
      max-width: 100%;
      @include mq_sp {
        max-height: 40rem;
      }
    }

    /**
     * List
     */
    ul,
    ol,
    dl {
      margin: 1.4em 0;
      li {
        list-style: disc outside;
        margin-left: 1.4em;
      }

      ul,
      ol,
      dl {
        margin: 0;
      }
    }
    ol {
      li {
        list-style: decimal outside;
      }
    }
    dl {
      dt {
        font-weight: bold;
      }
      dd {
        padding-left: 2em;
      }
    }

    /**
     * Code
     */
    pre {
      line-height: 1.2;
    }

    /**
    * For SP Layout
    */
    @include mq_sp {
      img {
        &[style*='float: left;'],
        &[style*='float: right;'] {
          display: block;
          // stylelint-disable-next-line
          float: none !important;
          margin: 0 auto 1.5em;
        }
      }
    }
  }
}
</style>

<style lang="scss">
.page-enter {
  .p-detail__thumb {
    transform: translateY(-20px);
  }
  &-active {
    transition: transform 0.3s;
  }
  &-to {
    .p-detail__thumb {
      transform: translateY(0px);
    }
  }
  &-leave {
    &-active {
      transition: transform 0.3s;
    }
    &-to {
      .p-detail__thumb {
        transform: translateY(20px);
      }
    }
  }
}
</style>
