<template lang="pug">
aside.c-side(
  :class="{'c-side--show': is_show_nav}"
)
  div.c-side__avatar
    figure
      img(:src="avatarSrc")
      figcaption SUSH
    ul.c-side__avatar__socials
      li
        a(href="https://twitter.com/sushat4692" target="_blank")
          font-awesome-icon(:icon="['fab', 'twitter']")
      li
        a(href="https://www.facebook.com/sushat4692" target="_blank")
          font-awesome-icon(:icon="['fab', 'facebook-f']")
      li
        a(href="https://github.com/sushat4692" target="_blank")
          font-awesome-icon(:icon="['fab', 'github-alt']")
      li
        a(href="https://sus-happy.net" target="_blank")
          font-awesome-icon(:icon="['fas', 'link']")

  nav
    ul
      li
        nuxt-link(to="/" @click.native="hideNav") HOME
      li
        nuxt-link(to="/tags/" @click.native="hideNav") Tags
</template>

<script lang="ts">
export default {
  computed: {
    is_show_nav(): boolean {
      return (this as any).$store.state.layout.is_show_nav
    },
    avatarSrc(): string {
      return process.env.avatar || ''
    }
  },

  methods: {
    hideNav() {
      ;(this as any).$store.commit('layout/toggle_show_nav')
    }
  }
}
</script>

<style lang="scss" scoped>
.c-side {
  position: fixed;
  background: #fff;
  width: $sidebar-width;
  top: 0;
  left: 0;
  bottom: 0;
  transform: translateX(-$sidebar-width * 1.1);
  transition: transform $transition-base-speed;
  overflow: auto;
  box-shadow: 0.5rem 0 0.5rem rgba(0, 0, 0, 0.1);
  z-index: 10;

  &--show {
    transform: translateX(0);
  }

  &__avatar {
    margin: 0 auto;
    padding: 3rem 0;
    background: #f5f5f5;
    text-align: center;
    img {
      width: 34%;
      border-radius: 50%;
      vertical-align: top;
    }
    figcaption {
      margin-top: 0.5rem;
    }

    &__socials {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 2rem;

      > li {
        list-style: none;
        margin: 0 0.5rem;

        > a {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 3.2rem;
          height: 3.2rem;
          border: 1px solid $color-base-text;
          color: $color-base-text;
          border-radius: 50%;
          transition: background $transition-base-speed, color $transition-base-speed;

          &:hover {
            background: $color-base-text;
            color: #fff;
          }
        }
      }
    }
  }

  nav {
    a {
      display: block;
      color: inherit;
      text-decoration: none;
      padding: 1.5rem;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      transition: color $transition-base-speed, background $transition-base-speed;

      &:hover {
        color: #fff;
        background: $color-base-red;
      }
    }
  }

  @include mq_sp {
  }
}
</style>
