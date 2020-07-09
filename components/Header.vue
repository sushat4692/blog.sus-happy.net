<template lang="pug">
  header.c-header
    button.c-header__button.is-show.c-header__trigger(
      :class="{'is-active': isShowNav}"
      @click.prevent="toggleNavHandler"
    )
    nuxt-link.c-header__button(
      :to="{name: 'index'}"
      :class="{'is-show': isButtonActive}"
    )
      font-awesome-icon(:icon="['fas', 'mountain']").c-header__button__icon
</template>

<script lang="ts">
import {
  defineComponent,
  inject,
  computed,
  useContext,
} from 'nuxt-composition-api'

// Store
import { StoreKey as SiteStoreKey } from '@/stores/Site'

export default defineComponent({
  setup(_prop) {
    const store = inject(SiteStoreKey)
    if (!store) {
      throw new Error(`${SiteStoreKey} is not provided`)
    }
    const { route } = useContext()

    const isShowNav = computed(() => {
      return store.isShowNav
    })
    const isButtonActive = computed(() => {
      return route.value.path !== '/'
    })

    const toggleNavHandler = () => {
      store.isShowNav = !store.isShowNav
    }

    return {
      isShowNav,
      isButtonActive,
      toggleNavHandler,
    }
  },
})
</script>
