<template lang="pug">
  .c-hero(:class="{'is-large': isLarge}")
    .c-hero__figure
      img(:src="image" loading="lazy" v-if="image").c-hero__image
      img(src="/content/background.jpg" loading="lazy" v-else).c-hero__image
    .l-container.c-hero__inner
      h1.c-hero__title(v-if="$scopedSlots.title")
        slot(name="title")
      h2.c-hero__sub-title(v-if="$scopedSlots.subTitle")
        slot(name="subTitle")

      slot
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'ComponentPartHero',
  props: {
    isLarge: { type: Boolean, default: false },
    image: { type: String, default: '' },
  },
})
</script>
