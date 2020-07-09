<template lang="pug">
  div.l-wrapper
    Header

    main.l-wrapper__main(
      :class="{'is-avoid': isShowNav}"
    )
      nuxt

    Side
</template>

<script lang="ts">
import { defineComponent, provide, computed } from 'nuxt-composition-api'

// Component
import Header from '@/components/Header.vue'
import Side from '@/components/Side.vue'

// Store
import { store as SiteStore, StoreKey as SiteStoreKey } from '@/stores/Site'

export default defineComponent({
  components: {
    Header,
    Side,
  },
  setup() {
    const siteStore = SiteStore()
    provide(SiteStoreKey, siteStore)

    const isShowNav = computed(() => {
      return siteStore.isShowNav
    })

    return {
      isShowNav,
    }
  },
})
</script>
