<template lang="pug">
.l-container
  .p-archive
    part-archive(v-for="post in posts" :key="post.slug" :post="post")
</template>

<script lang="ts">
import Vue from 'vue'

// Components
import PartArchive from '@/components/Parts/Archive.vue'

export default Vue.extend({
  name: 'ComponentList',
  components: {
    PartArchive
  },
  props: {
    posts: { type: Array, required: true }
  }
})
</script>
