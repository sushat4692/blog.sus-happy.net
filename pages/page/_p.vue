<template lang="pug">
List(
  :posts="posts"
  :prev="prev"
  :next="next"
  path="page-p"
)
</template>

<script lang="ts">
// Component
import List from '@/components/List.vue'

export default {
  components: {
    List
  },
  asyncData({ store, params }) {
    const per_page = process.env.POSTS_PER_PAGE ? parseInt(process.env.POSTS_PER_PAGE, 10) : 10
    return store.getters['posts/recent'](parseInt(params.p, 10), per_page)
  }
}
</script>

<style lang="scss" scoped></style>
