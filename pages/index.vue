<template lang="pug">
div
  .g-hero.g-hero--large
    .g-hero__img
      img(src="/content/background.gif")
    div.g-hero__inner
      h1.g-hero__title SUSH-i BLOG
      h2.g-hero__sub-title
        | 名古屋のWeb制作会社につとめる
        br
        | プログラマーのつぶやき

      ul.g-hero__socials
        li
          a(href="https://twitter.com/sushat4692" target="_blank")
            font-awesome-icon(:icon="['fab', 'twitter']")
        li
          a(href="https://www.facebook.com/sushat4692" target="_blank")
            font-awesome-icon(:icon="['fab', 'facebook-f']")
        li
          a(href="https://github.com/sushat4692" target="_blank")
            font-awesome-icon(:icon="['fab', 'github-alt']")
        li
          a(href="https://sus-happy.net" target="_blank")
            font-awesome-icon(:icon="['fas', 'link']")

  List(
    :posts="posts"
    :prev="prev"
    :next="next"
    path="page-p"
  )
</template>

<script lang="ts">
// Mixins
import Visual from '~/assets/mixins/visual'

// Component
import List from '@/components/List.vue'

export default {
  components: {
    List
  },
  mixins: [Visual],
  asyncData({ store }) {
    const per_page = process.env.POSTS_PER_PAGE ? parseInt(process.env.POSTS_PER_PAGE, 10) : 10
    return store.getters['posts/recent'](1, per_page)
  },
  head() {
    return {
      titleTemplate: ''
    }
  },

  async mounted() {
    const thumbnail = (this as any).$el.querySelector('.g-hero__img img')
    if (thumbnail) {
      ;(this as any).mainVisual(thumbnail)
    }
  }
}
</script>
