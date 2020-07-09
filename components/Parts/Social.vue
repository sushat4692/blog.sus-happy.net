<template lang="pug">
  .c-social(:class="{'is-white': isWhite}")
    a(href="https://twitter.com/sushat4692" target="_blank").c-social__item
      font-awesome-icon(:icon="['fab', 'twitter']").c-social__icon
    a(href="https://www.facebook.com/sushat4692" target="_blank").c-social__item
      font-awesome-icon(:icon="['fab', 'facebook-f']").c-social__icon
    a(href="https://github.com/sushat4692" target="_blank").c-social__item
      font-awesome-icon(:icon="['fab', 'github-alt']").c-social__icon
    a(href="https://sus-happy.net" target="_blank").c-social__item
      font-awesome-icon(:icon="['fas', 'link']").c-social__icon
</template>

<script lang="ts">
import { defineComponent } from 'nuxt-composition-api'

export default defineComponent({
  props: {
    isWhite: { type: Boolean, default: false },
  },
})
</script>
