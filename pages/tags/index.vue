<template lang="pug">
div
  .g-hero
    .g-hero__img
      img(src="/content/background.gif")
    div.g-hero__inner
      h1.g-hero__title Tags

  .g-container
    .p-tags-list
      nuxt-link.p-tags-list__item(
        v-for="tag, key in tags"
        :key="key"
        :to="{name: 'tags-tag-p', params: {tag: tag.label}}"
      ) {{ tag.label }}
        small {{ tag.count }}
</template>

<script lang="ts">
// Mixins
import Visual from '~/assets/mixins/visual'

export default {
  mixins: [Visual],
  asyncData({ store }) {
    return { tags: store.state.posts.tags }
  },
  head() {
    return {
      title: 'Tags'
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

<style lang="scss" scoped>
.p-tags-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;

  &__item {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0.5rem 1rem;
    border: 1px solid $color-base-red;
    border-radius: 3px;
    margin: 0.5rem;
    text-decoration: none;
    color: inherit;
    box-shadow: 0 0 0 transparent;
    transition: box-shadow $transition-base-speed;

    > small {
      margin-left: 0.5em;
      padding: 0 0.3em;
      font-size: 0.8em;
      height: 1.25em;
      min-width: 1.25em;
      line-height: 1.25;
      text-align: center;
      color: #fff;
      background: $color-base-red;
      border-radius: 0.625em;
    }

    &:hover {
      box-shadow: 0 0 0.25em $color-base-red;
    }
  }
}
</style>
