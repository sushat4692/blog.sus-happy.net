<template lang="pug">
.l-wrapper
  Header
  main.l-wrapper__main(
    :class="{'l-wrapper__main--avoid': is_show_nav}"
  )
    nuxt

  Side
</template>

<script lang="ts">
// Component
import Header from '@/components/Header.vue'
import Side from '@/components/Side.vue'

export default {
  components: {
    Header,
    Side
  },

  computed: {
    is_show_nav(): boolean {
      return (this as any).$store.state.layout.is_show_nav
    }
  }
}
</script>

<style lang="scss" scoped>
.l-wrapper {
  overflow: hidden;
  position: relative;

  &__main {
    transition: transform $transition-base-speed;
    min-height: 100vh;

    // &::before {
    //   content: '';
    //   display: block;
    //   position: absolute;
    //   left: 0;
    //   top: 0;
    //   right: 0;
    //   bottom: 0;
    //   background: rgba(0, 0, 0, 0.5);
    //   pointer-events: none;
    //   opacity: 0;
    //   transition: opacity $transition-base-speed;
    //   z-index: 9;
    // }

    @include mq_sp {
      padding-top: 0;
      padding-bottom: $header-height * 2;
    }

    &--avoid {
      transform: translateX($sidebar-width/2);
      // &::before {
      //   opacity: 1;
      //   pointer-events: all;
      // }

      @include mq_pc_big {
        transform: translateX(0);
      }
    }
  }
}
</style>
