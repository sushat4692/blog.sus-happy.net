<template lang="pug">
div
  .g-hero
    .g-hero__img
      img(src="/content/background.gif")
    div.g-hero__inner
      h1.g-hero__title {{ $route.params.tag }}

  List(
    :posts="posts"
    :prev="prev"
    :next="next"
    path="tags-tag-p"
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
  asyncData({ store, params }) {
    const p = parseInt(params.p, 10) || 1
    const per_page = process.env.POSTS_PER_PAGE ? parseInt(process.env.POSTS_PER_PAGE, 10) : 10
    return store.getters['posts/tags'](params.tag, p, per_page)
  },
  head() {
    return {
      title: (this as any).$route.params.tag
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

<style lang="scss" scoped></style>
