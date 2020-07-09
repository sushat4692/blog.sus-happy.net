<template lang="pug">
  .c-meta
    time.c-meta__time
      font-awesome-icon(:icon="['far', 'clock']")
      | {{ $formatDistanceToNow(post.date) }}
    ul.c-meta__tags(v-if="post.tags")
      li(v-for="tag in post.tags").c-meta__tags__item
        nuxt-link(:to="{name: 'tags-tag', params: {tag}}" v-if="isDetail").c-meta__tags__anchor
          font-awesome-icon(:icon="['fas', 'tag']")
          | {{ tag }}
        template(v-else)
          font-awesome-icon(:icon="['fas', 'tag']")
          | {{ tag }}
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'ComponentPartMeta',
  props: {
    post: { type: Object, required: true },
    isDetail: { type: Boolean, default: false },
  },
})
</script>
