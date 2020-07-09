<template lang="pug">
.l-container
  .c-navigation
    .c-navigation__item.is-prev
      nuxt-link(:to="{name: 'slug', params: {slug: prev.slug}}" v-if="prev").c-navigation__anchor.is-prev
        font-awesome-icon(:icon="['fas', 'angle-left']").c-navigation__anchor__icon
        | {{ prev.title }}
    .c-navigation__item.is-next
      nuxt-link(:to="{name: 'slug', params: {slug: next.slug}}" v-if="next").c-navigation__anchor.is-next
        font-awesome-icon(:icon="['fas', 'angle-right']").c-navigation__anchor__icon
        | {{ next.title }}
  .c-navigation
    .c-navigation__item.is-home
      nuxt-link(:to="{name: 'index'}").c-button.is-primary HOME
</template>

<script lang="ts">
import { defineComponent, computed } from 'nuxt-composition-api'
import { Result } from '@nuxt/content'

type Props = {
  prevNext: Result[] | null
}

export default defineComponent({
  props: {
    prevNext: { type: Array, required: false },
  },
  setup(props: Props) {
    const prev = computed(() => {
      if (!Array.isArray(props.prevNext) || !props.prevNext[0]) {
        return false
      }
      return props.prevNext[0]
    })
    const next = computed(() => {
      if (!Array.isArray(props.prevNext) || !props.prevNext[1]) {
        return false
      }
      return props.prevNext[1]
    })

    return {
      prev,
      next,
    }
  },
})
</script>
