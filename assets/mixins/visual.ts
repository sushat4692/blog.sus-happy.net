export default {
  methods: {
    mainVisual(target) {
      if (!target) {
        return
      }

      const pos = document.documentElement.scrollTop || document.body.scrollTop
      const rect = target.getBoundingClientRect()

      const perValue = pos > rect.height ? rect.height : pos
      target.style.objectPosition = '50% calc(50% + ' + perValue / 2 + 'px)'

      window.requestAnimationFrame(this.mainVisual.bind(this, target))
    }
  }
}
