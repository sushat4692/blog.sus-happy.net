<template lang="pug">
  aside.c-sidebar(:class="{'is-show': isShowNav}")
    .c-sidebar__avatar
      figure.c-sidebar__avatar__figure
        img(:src="avatarSrc").c-sidebar__avatar__figure__img
        figcaption.c-sidebar__avatar__figure__caption SUSH
      part-social.c-sidebar__avatar__social

    part-toc(:toc-list="tocList")
</template>

<script lang="ts">
import {
  defineComponent,
  inject,
  computed,
  useContext,
} from 'nuxt-composition-api'

// Components
import PartSocial from '@/components/Parts/Social.vue'
import PartToc from '@/components/Parts/Toc.vue'

// Store
import { StoreKey as SiteStoreKey } from '@/stores/Site'

export default defineComponent({
  components: {
    PartSocial,
    PartToc,
  },
  setup() {
    const store = inject(SiteStoreKey)
    if (!store) {
      throw new Error(`${SiteStoreKey} is not provided`)
    }
    const { route } = useContext()

    const isShowNav = computed(() => {
      return store.isShowNav
    })

    const tocList = computed(() => {
      return store.toc
    })

    return {
      isShowNav,
      tocList,
      avatarSrc: process.env.avatar || '',
    }
  },
})
</script>
