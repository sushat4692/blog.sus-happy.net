<template lang="pug">
header.c-header
  button.c-header__trigger(
    :class="{'c-header__trigger--active': is_show_nav}"
    @click="toggleNav"
  )
    span
    span
</template>

<script lang="ts">
export default {
  computed: {
    is_show_nav(): boolean {
      return (this as any).$store.state.layout.is_show_nav
    }
  },

  methods: {
    toggleNav() {
      ;(this as any).$store.commit('layout/toggle_show_nav')
    }
  }
}
</script>

<style lang="scss" scoped>
.c-header {
  position: fixed;
  left: 0;
  top: 0;
  height: $header-height;
  width: $header-height;
  overflow: hidden;
  z-index: 99;
  padding: 0 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: linear-gradient(135deg, $color-base-red, darken($color-base-red, 15));

  &__trigger {
    position: absolute;
    left: 0;
    top: 0;
    height: $header-height;
    width: $header-height;
    outline: none;
    appearance: none;
    background: none;
    border-radius: 0;

    span {
      display: block;
      width: 2.4rem;
      height: 1px;
      background: #fff;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      margin: auto;
      transition: transform $transition-base-speed;

      &:nth-child(1) {
        transform: translateY(-0.5rem);
      }
      &:nth-child(2) {
        transform: translateY(0.5rem);
      }
    }

    &--active {
      span:nth-child(1) {
        transform: rotate(45deg);
      }
      span:nth-child(2) {
        transform: rotate(-45deg);
      }
    }
  }

  @include mq_sp {
    top: auto;
    bottom: 0;
    // box-shadow: 0 -0.25rem 0.25rem rgba(0, 0, 0, 0.3);
  }
}
</style>
