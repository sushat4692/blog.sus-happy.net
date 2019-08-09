<template lang="pug">
.g-container
  .c-archive
    nuxt-link.c-archive__item(
      v-for="post, key in posts"
      :key="key"
      :to="link(post)"
    )
      .c-archive__thumb
        img(v-if="post.thumbnail" :src="post.thumbnail")
        img(v-else src="/content/noimage.png")
      h2.c-archive__title {{ post.title }}
      .c-archive__meta
        time.c-archive__meta__time
          font-awesome-icon(:icon="['far', 'clock']")
          | {{ $distanceInWordsToNow(post.date) }}
        ul.c-archive__meta__tags(v-if="post.tags")
          li(v-for="tag in post.tags")
            font-awesome-icon(:icon="['fas', 'tag']")
            | {{ tag }}
      p.c-archive__body {{ post.preview }}

  .g-pagination
    nuxt-link.g-pagination__link.g-pagination__link--prev(
      :to="{name: path, params: {'p': prev}}"
      v-if="prev > 0"
    )
      font-awesome-icon(:icon="['fas', 'chevron-left']")
      | Prev
    span.g-pagination__empty(v-else)

    nuxt-link.g-pagination__link.g-pagination__link--next(
      :to="{name: path, params: {'p': next}}"
      v-if="next > 0"
    )
      | Next
      font-awesome-icon(:icon="['fas', 'chevron-right']")
    span.g-pagination__empty(v-else)
</template>

<script lang="ts">
//- {name: 'slug', params: {'slug': post.slug}}

export default {
  props: {
    posts: {
      type: Array,
      default: function() {
        return []
      }
    },
    path: {
      type: String,
      default: ''
    },
    prev: {
      type: Number,
      default: 0
    },
    next: {
      type: Number,
      default: 0
    }
  },
  methods: {
    link: function(post) {
      const path = (this as any).$router.resolve({ name: 'slug', params: { slug: post.slug } })
      return path.href
    }
  }
}
</script>

<style lang="scss" scoped>
.c-archive {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

  &__item {
    display: block;
    width: calc(50% + 15px);
    color: inherit;
    text-decoration: none;
    border-radius: 3px;
    box-shadow: 0 0 1px rgba($color-base-red, 0);
    padding: 20px;
    margin: -20px;
    background: rgba($color-base-red, 0);
    border: 1px solid rgba($color-base-red, 0);
    transition: box-shadow $transition-base-speed, background $transition-base-speed,
      border-color $transition-base-speed;

    &:nth-child(n + 3) {
      margin-top: 30px;
    }

    &:hover {
      background: rgba($color-base-red, 0.05);
      box-shadow: 0 0 10px rgba($color-base-red, 0.5);
      border-color: rgba($color-base-red, 0.5);
    }
  }

  &__thumb {
    height: 180px;
    background: #ddd;
    margin-bottom: 15px;

    img {
      height: 100%;
      width: 100%;
      object-fit: cover;
    }
  }

  &__title {
    font-size: 2rem;
    margin: 0;
    line-height: 1.2;
    margin-bottom: 0.5em;
  }

  &__meta {
    color: #666;

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
    }
  }

  @include mq_sp {
    display: block;

    &__item {
      width: auto;
      padding: 1rem;
      margin: 0 -1rem;

      &:nth-child(n + 2) {
        margin-top: 2rem;
      }
    }
  }
}
</style>
