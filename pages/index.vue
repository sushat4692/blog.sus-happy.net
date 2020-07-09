<template lang="pug">
div
  part-hero(is-large)
    template(v-slot:title) SUSH-i BLOG
    template(v-slot:subTitle)
      | 名古屋のWeb制作会社につとめる
      br
      | プログラマーのつぶやき

    part-social(is-white)

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
import PartSocial from '@/components/Parts/Social.vue'
import List from '@/components/List.vue'

export default defineComponent({
  components: {
    PartHero,
    PartSocial,
    List,
  },
  head: {},
  setup() {
    const perPage = process.env.POSTS_PER_PAGE
      ? parseInt(process.env.POSTS_PER_PAGE, 10)
      : 10
    let page = 1

    const { $content } = useContext()
    const posts = ref<Result[]>([])

    const fetchResult = useFetch(async () => {
      const _posts = await $content()
        .sortBy('date', 'desc')
        .limit(perPage)
        .fetch<Result[]>()
      posts.value = [..._posts]
    })

    if (!fetchResult) {
      return { posts, infiniteHandler: () => {} }
    }
    fetchResult.fetch()

    const infiniteHandler = async ($state: any) => {
      const _posts = await $content()
        .sortBy('date', 'desc')
        .limit(perPage)
        .skip(page * perPage)
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
