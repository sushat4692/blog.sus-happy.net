<template lang="pug">
div
  part-hero
    template(v-slot:title) {{ $route.params.tag }}

  list(:posts="posts")

  no-ssr
    infinite-loading(
        @infinite="infiniteHandler"
    )
</template>

<script lang="ts">
import {
  defineComponent,
  useContext,
  useFetch,
  ref,
} from 'nuxt-composition-api'
import { Result } from '@nuxt/content'

// Components
import PartHero from '@/components/Parts/Hero.vue'
import List from '@/components/List.vue'

export default defineComponent({
  components: {
    PartHero,
    List,
  },
  setup() {
    const perPage = process.env.POSTS_PER_PAGE
      ? parseInt(process.env.POSTS_PER_PAGE, 10)
      : 10
    let page = 1

    const { $content, params } = useContext()
    const posts = ref<Result[]>([])

    const fetchResult = useFetch(async () => {
      const _posts = await $content()
        .sortBy('date', 'desc')
        .limit(perPage)
        .where({ tags: { $contains: params.value.tag } })
        .fetch<Result[]>()
      posts.value = [..._posts]
    })

    if (!fetchResult) {
      return { posts, infiniteHandler: () => {} }
    }
    fetchResult.fetch()

    const infiniteHandler = async ($state: any) => {
      const perPage = process.env.POSTS_PER_PAGE
        ? parseInt(process.env.POSTS_PER_PAGE, 10)
        : 10

      const _posts = await $content()
        .sortBy('date', 'desc')
        .limit(perPage)
        .skip(page * perPage)
        .where({ tags: { $contains: params.value.tag } })
        .fetch<Result[]>()
      page += 1

      if (_posts.length) {
        posts.value.push(..._posts)
        $state.loaded()
      } else {
        $state.complete()
      }
    }

    return {
      posts,
      infiniteHandler,
    }
  },
})
</script>

<style></style>
