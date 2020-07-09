<template lang="pug">
nuxt-link.c-archive(:to="{name: 'slug', params: {slug: post.slug}}")
  .c-archive__thumb
    img(:src="post.thumbnail" loading="lazy" v-if="post.thumbnail").c-archive__thumb__img
    img(src="/content/noimage.png" loading="lazy" v-else).c-archive__thumb__img
  h2.c-archive__title {{ post.title }}
  part-meta(:post="post")
</template>

<script lang="ts">
import Vue from 'vue'

// Components
import PartMeta from '@/components/Parts/Meta.vue'

export default Vue.extend({
  name: 'ComponentPartArchive',
  components: {
    PartMeta,
  },
  props: {
    post: { type: Object, required: true },
  },
})
</script>
