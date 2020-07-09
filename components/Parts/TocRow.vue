<template lang="pug">
  a(:href="`#${toc.id}`" :class="`is-level-${toc.depth}`" @click.prevent="clickHandler").c-toc__item {{ toc.text }}
</template>

<script lang="ts">
import { defineComponent, inject } from 'nuxt-composition-api'

// Store
import { StoreKey as SiteStoreKey, TocRow } from '@/stores/Site'

type Props = {
  toc: TocRow
}

export default defineComponent({
  props: {
    toc: { type: Object, required: true },
  },
  setup(props: Props) {
    const store = inject(SiteStoreKey)
    if (!store) {
      throw new Error(`${SiteStoreKey} is not provided`)
    }

    const clickHandler = () => {
      const target = document.querySelector(`#${props.toc.id}`)
      if (!target) {
        return
      }

      const rect = target.getBoundingClientRect()
      const toTop = rect.top + window.pageYOffset

      store.isShowNav = false
      window.scrollTo({
        top: toTop,
        left: 0,
        behavior: 'smooth',
      })
    }

    return {
      clickHandler,
    }
  },
})
</script>
