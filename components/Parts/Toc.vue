<template lang="pug">
.c-toc(v-if="tocList.length")
  h2.c-toc__title Table of contents

  part-toc-row(v-for="toc in tocList" :key="toc.id" :toc="toc")
</template>

<script lang="ts">
import { defineComponent } from 'nuxt-composition-api'

// Components
import PartTocRow from '@/components/Parts/TocRow.vue'

export default defineComponent({
  props: {
    tocList: { type: Array, required: true },
  },
  components: {
    PartTocRow,
  },
})
</script>
