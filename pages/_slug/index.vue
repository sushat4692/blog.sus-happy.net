<template lang="pug">
div(v-if="post")
  part-hero(:is-large="hasThumbnail" :image="post.thumbnail")

  .p-detail
    .l-container.p-detail__main
      h1.p-detail__title {{ post.title }}

      part-meta(:post="post" is-detail)

      nuxt-content(:document="post").c-content

  part-navigation(:prev-next="prevNext")
</template>

<script lang="ts">
import {
  defineComponent,
  useFetch,
  useContext,
  ref,
  computed,
  inject,
  onUnmounted,
  useMeta,
  useAsync,
  watch,
} from 'nuxt-composition-api'
import { Result } from '@nuxt/content'

// Components
import PartHero from '@/components/Parts/Hero.vue'
import PartMeta from '@/components/Parts/Meta.vue'
import PartNavigation from '@/components/Parts/Navigation.vue'

// Store
import { StoreKey as SiteStoreKey } from '@/stores/Site'

export default defineComponent({
  components: {
    PartHero,
    PartMeta,
    PartNavigation,
  },
  head: {},
  setup(_prop) {
    const store = inject(SiteStoreKey)
    if (!store) {
      throw new Error(`${SiteStoreKey} is not provided`)
    }

    const { $content, params } = useContext()
    const post = useAsync(() => $content(params.value.slug).fetch<Result>())
    const prevNext = useAsync(() =>
      $content()
        .sortBy('date', 'desc')
        .surround(params.value.slug)
        .fetch<[Result, Result]>()
    )

    const { title } = useMeta({
      title: post.value ? (post.value as any).title : 'Now loading...',
      titleTemplate: '%s - SUSH-i LOG',
    })

    const hasThumbnail = computed(() => {
      if (!post.value) {
        return false
      }

      return Object.prototype.hasOwnProperty.call(post.value, 'thumbnail')
    })

    watch(post, (newVal) => {
      title.value = newVal ? (newVal as any).title : 'Now loading...'
    })

    onUnmounted(() => {
      store.toc = []
    })

    return {
      post,
      prevNext,
      hasThumbnail,
    }
  },
})
</script>
